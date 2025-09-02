package com.margelo.nitro.math

import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.TextView
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.facebook.react.uimanager.ThemedReactContext

@DoNotStrip
@Keep
class HybridCameraView(val context: ThemedReactContext) : HybridCameraViewSpec() {
    // Props
    override var enableFlash: Boolean = false
    private var textView: TextView? = null

    // View
    override val view: View = FrameLayout(context).apply {
        Log.d("ReactNativeJS", "*** CREATE HybridCameraView ***")
        layoutParams = ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        )
        setBackgroundColor(android.graphics.Color.GREEN)
        
        // Add TextView inside FrameLayout
        val tv = TextView(context).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.WRAP_CONTENT,
                FrameLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                gravity = android.view.Gravity.CENTER
            }
            text = "CAMERA"
            setTextColor(android.graphics.Color.BLACK)
            textSize = 20f
            setPadding(8, 8, 8, 8)
        }
        textView = tv
        addView(tv)
        
        // Add another view to make it more obvious
        val indicator = View(context).apply {
            layoutParams = FrameLayout.LayoutParams(50, 50).apply {
                gravity = android.view.Gravity.TOP or android.view.Gravity.END
                setMargins(0, 10, 10, 0)
            }
            setBackgroundColor(android.graphics.Color.RED)
        }
        addView(indicator)
    }

    override fun afterUpdate() {
        super.afterUpdate()
        Log.d("ReactNativeJS", "*** AFTER UPDATE: enableFlash=$enableFlash ***")
        textView?.text = if (enableFlash) "FLASH ON" else "FLASH OFF"
        (view as FrameLayout).setBackgroundColor(
            if (enableFlash) android.graphics.Color.RED else android.graphics.Color.GREEN
        )
    }

    override fun beforeUpdate() {
        super.beforeUpdate()
        Log.d("ReactNativeJS", "*** BEFORE UPDATE: enableFlash=$enableFlash ***")
    }
}