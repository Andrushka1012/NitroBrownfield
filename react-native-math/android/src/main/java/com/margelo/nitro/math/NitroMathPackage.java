package com.margelo.nitro.math;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;
import com.margelo.nitro.math.views.HybridCameraViewManager;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class NitroMathPackage extends TurboReactPackage {
    @Nullable
    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactContext) {
        return null;
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        Log.d("ReactNativeJS", "getReactModuleInfoProvider called");
        return () -> {
            return new HashMap<>();
        };
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        Log.d("ReactNativeJS", "createViewManagers called");
        List<ViewManager> viewManagers = new ArrayList<>();
        viewManagers.add(new HybridCameraViewManager());
        return viewManagers;
    }

    static {
        Log.d("ReactNativeJS", "static block called");
        NitroMathOnLoad.initializeNative();
    }
}
