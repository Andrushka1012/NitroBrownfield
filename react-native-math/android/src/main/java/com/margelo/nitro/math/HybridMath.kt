package com.margelo.nitro.math

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip

@DoNotStrip
@Keep
class HybridMath : HybridMathSpec() {
    override val pi: Double
        get() = 3.141592653589793

    override fun add(a: Double, b: Double): Double {
        return a + b
    }
}