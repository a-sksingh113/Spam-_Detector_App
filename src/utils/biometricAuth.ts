import ReactNativeBiometrics from 'react-native-biometrics';

export const authenticateWithBiometrics = async () => {
  const rnBiometrics = new ReactNativeBiometrics();

  try {
    const { available, biometryType, error } = await rnBiometrics.isSensorAvailable();

    if (!available) {
      if (error?.includes('No enrolled biometrics')) {
        throw new Error('Biometric setup not found. Please set up fingerprint or face ID in phone settings.');
      }

      if (error?.includes('Biometrics unavailable') || !biometryType) {
        throw new Error('Please setup biometric authentication in your phone settings.');
      }

      throw new Error('Biometric authentication is not available.');
    }

    const resultObject = await rnBiometrics.simplePrompt({
      promptMessage: 'Authenticate to proceed',
      cancelButtonText: 'Cancel',
    });

    const { success } = resultObject;

    if (!success) {
      throw new Error('Authentication was cancelled or failed.');
    }

    return true;

  } catch (error: any) {
    throw new Error(error.message || 'Biometric authentication failed');
  }
};
