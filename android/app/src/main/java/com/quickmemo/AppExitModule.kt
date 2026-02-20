package com.quickmemo

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AppExitModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AppExitModule"
    }

    @ReactMethod
    fun exitApp() {
        reactContext.currentActivity?.finish()
    }
}

