import { PermissionsAndroid } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { checkSpamWithAPI } from './spamUtils';

export const readAndCheckSMS = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_SMS
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    SmsAndroid.list(
      JSON.stringify({ box: 'inbox', maxCount: 30 }),
      (fail:string) => console.log('Failed:', fail),
      async (count: number, smsList: string) => {
        const messages = JSON.parse(smsList);
        for (const sms of messages) {
          const msg = {
            id: sms._id,
            sender: sms.address,
            content: sms.body,
            timestamp: new Date(sms.date).toISOString(),
          };
          await checkSpamWithAPI(msg);
        }
      }
    );
  }
};
