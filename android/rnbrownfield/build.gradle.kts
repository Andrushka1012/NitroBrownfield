import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import java.io.File

plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
    id("com.facebook.react")
    id("com.callstack.react.brownfield")
    id("maven-publish")
}

android {
    namespace = "com.box.rnbrownfield"
    compileSdk = 35

    defaultConfig {
        minSdk = 27

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        consumerProguardFiles("consumer-rules.pro")

        buildConfigField("boolean", "IS_NEW_ARCHITECTURE_ENABLED", properties["newArchEnabled"].toString())
        buildConfigField("boolean", "IS_HERMES_ENABLED", properties["hermesEnabled"].toString())
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        prefab = true
    }
    
    // Предотвращаем конфликты в метаданных
    packaging {
        resources {
            excludes += listOf(
                "META-INF/DEPENDENCIES",
                "META-INF/LICENSE",
                "META-INF/LICENSE.txt",
                "META-INF/license.txt",
                "META-INF/NOTICE",
                "META-INF/NOTICE.txt",
                "META-INF/notice.txt",
                "META-INF/ASL2.0",
                "META-INF/*.kotlin_module"
            )
        }
    }

    publishing {
        singleVariant("release") {
            withSourcesJar()
        }
    }
}

react {
    autolinkLibrariesWithApp()
}

// Task to copy native libraries from dependencies to jniLibs
tasks.register("copyNativeLibs") {
    doLast {
        val jniLibsDir = file("src/main/jniLibs")
        jniLibsDir.deleteRecursively()
        jniLibsDir.mkdirs()
        
        // Copy from react-native-math
        val mathLibsPath = file("../../react-native-math/android/build/intermediates/cxx")
        if (mathLibsPath.exists()) {
            println("Copying libraries from react-native-math...")
            val architectures = listOf("arm64-v8a", "armeabi-v7a", "x86", "x86_64")
            
            architectures.forEach { arch ->
                val sourceDir = fileTree(mathLibsPath) {
                    include("**/$arch/libNitroMath.so")
                }
                sourceDir.forEach { sourceFile ->
                    val targetDir = file("$jniLibsDir/$arch")
                    targetDir.mkdirs()
                    copy {
                        from(sourceFile)
                        into(targetDir)
                    }
                    println("Copied ${sourceFile.name} to $targetDir")
                }
            }
        }
    }
}

// Make sure copyNativeLibs runs before building
tasks.matching { it.name.startsWith("assemble") }.configureEach {
    dependsOn("copyNativeLibs")
}

// Maven publishing configuration
publishing {
    publications {
        create<MavenPublication>("mavenAar") {
            groupId = "com.nitro"
            artifactId = "rnbrownfield"
            version = "1.0.0"
            afterEvaluate {
                from(components.getByName("release"))
            }

            pom {
                name.set("RN Brownfield AAR")
                description.set("React Native AAR package with Nitro modules, Navigation and Camera support")
                
                withXml {
                    /**
                     * As a result of `from(components.getByName("release")` all of the project
                     * dependencies are added to `pom.xml` file. We do not need the react-native
                     * third party dependencies to be a part of it as we embed those dependencies.
                     */
                    val dependenciesNode = (asNode().get("dependencies") as groovy.util.NodeList).first() as groovy.util.Node
                    dependenciesNode.children()
                        .filterIsInstance<groovy.util.Node>()
                        .filter { (it.get("groupId") as groovy.util.NodeList).text() == rootProject.name }
                        .forEach { dependenciesNode.remove(it) }
                }
            }
        }
    }

    repositories {
        mavenLocal() // Publishes to the local Maven repository (~/.m2/repository by default)
    }
}

val moduleBuildDir: Directory = layout.buildDirectory.get()

/**
 * As a result of `from(components.getByName("release")` all of the project
 * dependencies are added to `module.json` file. We do not need the react-native
 * third party dependencies to be a part of it as we embed those dependencies.
 */
tasks.register("removeDependenciesFromModuleFile") {
    doLast {
        file("$moduleBuildDir/publications/mavenAar/module.json").run {
            val json = inputStream().use { JsonSlurper().parse(it) as Map<String, Any> }
            (json["variants"] as? List<MutableMap<String, Any>>)?.forEach { variant ->
                (variant["dependencies"] as? MutableList<Map<String, Any>>)?.removeAll { it["group"] == rootProject.name }
            }
            writer().use { it.write(JsonOutput.prettyPrint(JsonOutput.toJson(json))) }
        }
    }
}

tasks.named("generateMetadataFileForMavenAarPublication") {
   finalizedBy("removeDependenciesFromModuleFile")
}

dependencies {

    implementation("androidx.core:core-ktx:1.16.0")
    implementation("androidx.appcompat:appcompat:1.7.1")
    implementation("com.google.android.material:material:1.12.0")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.6.1")

    // React Native core dependencies - use api so they're included in POM
    api("com.facebook.react:react-android:0.79.3")
    api("com.facebook.react:hermes-android:0.79.3")

    // // Nitro modules - use compileOnly since native libs are already copied to AAR
    // compileOnly(project(":react-native-nitro-modules"))
    // compileOnly(project(":react-native-math"))

    // External dependencies that consumer apps need
    api("androidx.biometric:biometric:1.1.0")
    api("com.google.android.gms:play-services-location:21.0.1")
    api("androidx.exifinterface:exifinterface:1.3.6")
}