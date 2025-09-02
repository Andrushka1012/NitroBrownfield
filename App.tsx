/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import type {Math} from './react-native-math/src/specs/Math.nitro';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  PanResponder,
  NativeModules,
  TextInput,
} from 'react-native';
import {Camera} from 'react-native-math/src';
import {NitroModules} from 'react-native-nitro-modules';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import isEmail from 'validator/lib/isEmail';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import SecondScreen from './SecondScreen';

// DevMenuTrigger component to show dev menu with 3-finger touch
const DevMenuTrigger: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {DevMenu} = NativeModules;
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => {
      if (gestureState.numberActiveTouches === 3) {
        DevMenu.show();
        return true;
      }
      return false;
    },
  });
  return <View style={{flex: 1}} {...panResponder.panHandlers}>{children}</View>;
};

type SectionProps = PropsWithChildren<{
  title: string;
}>;

// Define the stack navigator param list
type RootStackParamList = {
  Home: undefined;
  Second: undefined;
};

// Define navigation prop type
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen({navigation}: HomeScreenProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [_flashEnabled, _setFlashEnabled] = useState(false);
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState<boolean | null>(null);

  useEffect(() => {
    console.log('[HomeScreen] Screen mounted');
    return () => {
      console.log('[HomeScreen] Screen unmounted');
    };
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  /*
   * To keep the template simple and small we're adding padding to prevent view
   * from rendering under the System UI.
   * For bigger apps the recommendation is to use `react-native-safe-area-context`:
   * https://github.com/AppAndFlow/react-native-safe-area-context
   *
   * You can read more about it here:
   * https://github.com/react-native-community/discussions-and-proposals/discussions/827
   */
  const safePadding = '5%';

  const math = NitroModules.createHybridObject<Math>('Math');
  const value = math.add(10, 7);

  const openDevMenu = () => {
    if (NativeModules.DevMenu) {
      NativeModules.DevMenu.show();
    }
  };

  const validateEmail = () => {
    const result = isEmail(email);
    setIsValidEmail(result);
  };

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView style={backgroundStyle}>
        <View style={{paddingRight: safePadding}}>
          <Header />
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            paddingHorizontal: safePadding,
            paddingBottom: safePadding,
          }}>
          <Section title={`Calculation for native. result: ${value} and Pi is ${math.pi}`}>
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>

          <View style={styles.navigationButton}>
            <Button
              title="Go to Second Screen"
              onPress={() => navigation.navigate('Second')}
            />
          </View>
          
          <View style={styles.navigationButton}>
            <Button
              title="Open Dev Menu"
              onPress={openDevMenu}
            />
          </View>
          
          <View style={styles.validatorContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter email to validate"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Button
              title="Validate Email"
              onPress={validateEmail}
            />
            {isValidEmail !== null && (
              <Text style={[
                styles.validationResult,
                isValidEmail ? styles.validEmail : styles.invalidEmail
              ]}>
                {isValidEmail ? 'Valid email' : 'Invalid email'}
              </Text>
            )}
          </View>

          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </View>
  );
}

function App(): React.JSX.Element {
  return (
    <DevMenuTrigger>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'My Home Screen'}}
          />
          <Stack.Screen
            name="Second"
            component={SecondScreen}
            options={{title: 'Second Screen'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DevMenuTrigger>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  navigationButton: {
    marginVertical: 8,
  },
  validatorContainer: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  validationResult: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  validEmail: {
    color: 'green',
  },
  invalidEmail: {
    color: 'red',
  },
});

export default App;
