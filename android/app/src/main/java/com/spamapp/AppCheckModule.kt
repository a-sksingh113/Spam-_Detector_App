package com.spamapp

import android.content.pm.PackageManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AppCheckModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AppCheck"

    @ReactMethod
    fun isSuspiciousAppInstalled(promise: Promise) {
        val blacklisted = arrayOf(
            "com.anydesk.anydeskandroid",
            "com.teamviewer.quicksupport.market",
            "com.remotepc",
            "com.rsupport.mvagent"
            // add more package names you want to detect
        )

        val pm = reactApplicationContext.packageManager
        try {
            for (pkg in blacklisted) {
                try {
                    pm.getPackageInfo(pkg, 0)
                    // package exists
                    promise.resolve(true)
                    return
                } catch (e: PackageManager.NameNotFoundException) {
                    // not installed -> continue
                }
            }
            promise.resolve(false)
        } catch (e: Exception) {
            promise.reject("ERR_APPCHECK", e)
        }
    }
}
