import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  useColorScheme,
  Image,
  View,
  Platform,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
  ImagePickerResponse,
  CameraOptions,
  ImageLibraryOptions,
  MediaType
} from 'react-native-image-picker';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Share from 'react-native-share';
import Geolocation from '@react-native-community/geolocation';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';

// Define the stack navigator param list
type RootStackParamList = {
  Home: undefined;
  Second: undefined;
};

type SecondScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Second'
>;

type SecondScreenProps = {
  navigation: SecondScreenNavigationProp;
};

const SecondScreen = ({navigation}: SecondScreenProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [photo, setPhoto] = useState<Asset | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [biometricStatus, setBiometricStatus] = useState<string>('Not checked');

  useEffect(() => {
    console.log('[SecondScreen] Screen mounted');
    checkBiometricAvailability();
    return () => {
      console.log('[SecondScreen] Screen unmounted');
    };
  }, []);

  const requestCameraPermission = async () => {
    console.log('[SecondScreen] Requesting camera permission');
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA;

      const result = await request(permission);

      if (result === RESULTS.GRANTED) {
        console.log('[SecondScreen] Camera permission granted');
        openCamera();
      } else {
        console.log('[SecondScreen] Camera permission denied:', result);
        Alert.alert(
          'Permission Required',
          'Camera permission is required to take photos',
          [{text: 'OK'}],
        );
      }
    } catch (error) {
      console.error(
        '[SecondScreen] Error requesting camera permission:',
        error,
      );
      Alert.alert('Error', 'Failed to request camera permission');
    }
  };

  const openCamera = () => {
    console.log('[SecondScreen] Opening camera');
    setLoading(true);

    const options: CameraOptions = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      saveToPhotos: true,
    };

    try {
      launchCamera(options, handleImagePickerResponse);
    } catch (error) {
      console.error('[SecondScreen] Error launching camera:', error);
      Alert.alert('Error', 'Failed to launch camera');
      setLoading(false);
    }
  };

  const openGallery = () => {
    console.log('[SecondScreen] Opening gallery');
    setLoading(true);

    const options: ImageLibraryOptions = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    try {
      launchImageLibrary(options, handleImagePickerResponse);
    } catch (error) {
      console.error('[SecondScreen] Error opening gallery:', error);
      Alert.alert('Error', 'Failed to open gallery');
      setLoading(false);
    }
  };

  const handleImagePickerResponse = (response: ImagePickerResponse) => {
    console.log('[SecondScreen] Image picker response received');
    
    try {
      if (response.didCancel) {
        console.log('[SecondScreen] User cancelled image picker');
      } else if (response.errorCode) {
        console.log('[SecondScreen] Image picker error:', response.errorCode, response.errorMessage);
        Alert.alert(
          'Error',
          response.errorMessage || 'Unknown error occurred',
        );
      } else if (response.assets && response.assets.length > 0) {
        const selectedAsset = response.assets[0];
        console.log(
          '[SecondScreen] Image selected:',
          selectedAsset.fileName,
          'URI:', selectedAsset.uri,
        );
        setPhoto(selectedAsset);
      } else {
        console.log('[SecondScreen] No image data found');
        Alert.alert('Error', 'No image data found');
      }
    } catch (error) {
      console.error('[SecondScreen] Error processing image response:', error);
      Alert.alert('Error', 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  const shareText = async () => {
    console.log('[SecondScreen] Sharing text');
    try {
      const shareOptions = {
        title: 'Share via',
        message: 'Hello from React Native',
        subject: 'React Native Share Test',
      };
      
      console.log('[SecondScreen] Calling Share.open with options:', shareOptions);
      const result = await Share.open(shareOptions);
      console.log('[SecondScreen] Share result:', result);
      
      if (result.success) {
        console.log('[SecondScreen] Share completed successfully');
      }
    } catch (error) {
      console.error('[SecondScreen] Error sharing:', error);
      Alert.alert('Error', 'Failed to share content');
    }
  };

  const shareImage = async () => {
    if (!photo || !photo.uri) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    console.log('[SecondScreen] Sharing image:', photo.uri);
    try {
      const shareOptions = {
        title: 'Share Image',
        url: photo.uri,
        type: photo.type || 'image/jpeg',
      };
      
      console.log('[SecondScreen] Calling Share.open with options:', shareOptions);
      const result = await Share.open(shareOptions);
      console.log('[SecondScreen] Share result:', result);
      
      if (result.success) {
        console.log('[SecondScreen] Share completed successfully');
      }
    } catch (error) {
      console.error('[SecondScreen] Error sharing image:', error);
      Alert.alert('Error', 'Failed to share image');
    }
  };

  // Geolocation functions
  const requestLocationPermission = async () => {
    console.log('[SecondScreen] Requesting location permission');
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      const result = await request(permission);

      if (result === RESULTS.GRANTED) {
        console.log('[SecondScreen] Location permission granted');
        getCurrentLocation();
      } else {
        console.log('[SecondScreen] Location permission denied:', result);
        Alert.alert(
          'Permission Required',
          'Location permission is required to get your position',
          [{text: 'OK'}],
        );
      }
    } catch (error) {
      console.error('[SecondScreen] Error requesting location permission:', error);
      Alert.alert('Error', 'Failed to request location permission');
    }
  };

  const getCurrentLocation = () => {
    console.log('[SecondScreen] Getting current location');
    setLoading(true);

    try {
      Geolocation.getCurrentPosition(
        position => {
          console.log('[SecondScreen] Location received:', position);
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
        },
        error => {
          console.error('[SecondScreen] Error getting location:', error);
          Alert.alert('Error', 'Failed to get location: ' + error.message);
          setLoading(false);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (error) {
      console.error('[SecondScreen] Exception getting location:', error);
      Alert.alert('Error', 'Failed to get location');
      setLoading(false);
    }
  };

  // Biometrics functions
  const checkBiometricAvailability = async () => {
    console.log('[SecondScreen] Checking biometric availability');
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const {available, biometryType} = await rnBiometrics.isSensorAvailable();

      if (available) {
        let biometryName = 'Unknown';
        switch (biometryType) {
          case BiometryTypes.TouchID:
            biometryName = 'Touch ID';
            break;
          case BiometryTypes.FaceID:
            biometryName = 'Face ID';
            break;
          case BiometryTypes.Biometrics:
            biometryName = 'Fingerprint';
            break;
        }
        console.log('[SecondScreen] Biometrics available:', biometryType);
        setBiometricStatus(`Available (${biometryName})`);
      } else {
        console.log('[SecondScreen] Biometrics not available');
        setBiometricStatus('Not available');
      }
    } catch (error) {
      console.error('[SecondScreen] Error checking biometrics:', error);
      setBiometricStatus('Error checking');
    }
  };

  const authenticateWithBiometrics = async () => {
    console.log('[SecondScreen] Authenticating with biometrics');
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const {available} = await rnBiometrics.isSensorAvailable();

      if (!available) {
        Alert.alert('Error', 'Biometric authentication is not available on this device');
        return;
      }

      const {success} = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate with biometrics',
        cancelButtonText: 'Cancel',
      });

      if (success) {
        console.log('[SecondScreen] Biometric authentication successful');
        Alert.alert('Success', 'Biometric authentication successful');
      } else {
        console.log('[SecondScreen] Biometric authentication failed or cancelled');
        Alert.alert('Failed', 'Biometric authentication failed or was cancelled');
      }
    } catch (error) {
      console.error('[SecondScreen] Error during biometric authentication:', error);
      Alert.alert('Error', 'Failed to authenticate with biometrics');
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        },
      ]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}>
        <Text
          style={[
            styles.title,
            {
              color: isDarkMode ? Colors.white : Colors.black,
            },
          ]}>
          Second Screen
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <>
            {photo ? (
              <View style={styles.photoContainer}>
                <Image
                  source={{uri: photo.uri}}
                  style={styles.photo}
                  resizeMode="cover"
                />
                <Text style={styles.photoInfo}>
                  {photo.fileName || 'Selected image'}
                </Text>
                <TouchableOpacity 
                  style={styles.shareButton} 
                  onPress={shareImage}>
                  <Text style={styles.shareButtonText}>Share This Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text
                style={[
                  styles.description,
                  {
                    color: isDarkMode ? Colors.light : Colors.dark,
                  },
                ]}>
                Select an image from your device
              </Text>
            )}

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Camera & Gallery</Text>
              <View style={styles.buttonContainer}>
                <Button title="Open Camera" onPress={requestCameraPermission} />
                <View style={styles.buttonSpacer} />
                <Button title="Open Gallery" onPress={openGallery} />
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Sharing</Text>
              <View style={styles.buttonContainer}>
                <Button title="Share Text Message" onPress={shareText} />
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Location</Text>
              {location ? (
                <View style={styles.infoContainer}>
                  <Text style={styles.infoText}>
                    Latitude: {location.latitude.toFixed(6)}
                  </Text>
                  <Text style={styles.infoText}>
                    Longitude: {location.longitude.toFixed(6)}
                  </Text>
                </View>
              ) : (
                <Text style={styles.infoText}>Location not available</Text>
              )}
              <View style={styles.buttonContainer}>
                <Button 
                  title="Get Current Location" 
                  onPress={requestLocationPermission} 
                />
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Biometrics</Text>
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  Status: {biometricStatus}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <Button 
                  title="Authenticate" 
                  onPress={authenticateWithBiometrics} 
                />
              </View>
            </View>

            <View style={styles.navigationButton}>
              <Button title="Go Back" onPress={() => navigation.goBack()} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  photoContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  photo: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  photoInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
  },
  buttonSpacer: {
    height: 10,
  },
  navigationButton: {
    marginTop: 20,
  },
  loadingContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  shareButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default SecondScreen;
