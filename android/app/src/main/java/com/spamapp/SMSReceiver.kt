package com.spamapp

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.BroadcastReceiver
import okhttp3.MediaType.Companion.toMediaType
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.telephony.SmsMessage
import android.util.Log
import android.widget.Toast
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import okhttp3.*
import org.json.JSONObject
import java.io.IOException

class SMSReceiver : BroadcastReceiver() {

    private val client = OkHttpClient()
    private val apiUrl = "https://model1.satishdev.me/predict1" 

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == "android.provider.Telephony.SMS_RECEIVED") {
            val bundle: Bundle? = intent.extras
            try {
                val pdus = bundle?.get("pdus") as? Array<*>
                val format = bundle?.getString("format")

                pdus?.forEach { pduObj ->
                    val pdu = pduObj as ByteArray
                    val sms = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        SmsMessage.createFromPdu(pdu, format)
                    } else {
                        SmsMessage.createFromPdu(pdu)
                    }

                    val sender = sms.displayOriginatingAddress
                    val message = sms.displayMessageBody

                    Log.d("SMSReceiver", "From: $sender\nMsg: $message")

                    // Send to AI model
                    checkIfSpam(context, sender, message)
                }
            } catch (e: Exception) {
                Log.e("SMSReceiver", "Exception: ${e.message}", e)
            }
        }
    }

    private fun checkIfSpam(context: Context, sender: String, message: String) {
        val json = JSONObject()
        json.put("text", message)

       val body = RequestBody.create(
  "application/json; charset=utf-8".toMediaType(),
  json.toString()
)

        val request = Request.Builder()
            .url(apiUrl)
            .post(body)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e("SMSReceiver", "API call failed: ${e.message}")
            }

            override fun onResponse(call: Call, response: Response) {
                val result = response.body?.string()
                Log.d("SMSReceiver", "API response: $result")

                val prediction = try {
                    JSONObject(result).getString("prediction").lowercase()
                } catch (e: Exception) {
                    ""
                }

                if (prediction == "spam") {
                    showNotification(context, "SPAM Detected ⚠️", message)

                    // Optional: start React Native app with spam intent
                    val intent = Intent(context, MainActivity::class.java)
                    intent.putExtra("spam_message", message)
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
                    context.startActivity(intent)
                }
            }
        })
    }

    private fun showNotification(context: Context, title: String, content: String) {
        val channelId = "spam_channel_id"
        val channelName = "Spam Alerts"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                channelName,
                NotificationManager.IMPORTANCE_HIGH
            )
            val manager = context.getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.stat_notify_error)
            .setContentTitle(title)
            .setContentText(content)
            .setStyle(NotificationCompat.BigTextStyle().bigText(content))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()

        NotificationManagerCompat.from(context).notify(
            System.currentTimeMillis().toInt(),
            notification
        )
    }
}
