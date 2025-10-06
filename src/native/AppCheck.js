import { NativeModules, Platform } from 'react-native'
const { AppCheck } = NativeModules

export default {
  isSuspiciousAppInstalled: async () => {
    if (Platform.OS !== 'android' || !AppCheck) return false
    try {
      const found = await AppCheck.isSuspiciousAppInstalled()
      return !!found
    } catch (e) {
      console.warn('AppCheck error:', e)
      return false
    }
  }
}
