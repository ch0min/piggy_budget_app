**_ TODO _**

- Categories Screen
  AddCategory Screen skal moduleres.
- ÆNDRE ALT MARGIN OSV TIL PERCENTAGE
- Change colors
- Change fonts
- Fix details on both iOS and Android so they look the same.
- Login with google or facebook?
- SVG
- Skift alt til dansk?
- Brugt CAPTCHA til BRUTEFORCE!!!!!
- SPLASH SCREEN
- Email redirection
- Hvorfor bruge expo router vs react native navigation?
- useContext for navigation?
- Tilføj loading indicator.
- ADD SHADOW ON ANDROID

MINOR BUGS:

- Sometimes when you login you will quickly see the CompleteProfile Screen.

**_ SECURITY TEST _**

- Signup:

  - Anonymous signin
  - Password mismatch
  - Password too short
  - User already exists

  - No email
  - No password
  - Invalid email

**_ DONE _**

- Landing Screen
- Signup Screen
- Login Screen
- VerifyEmail Screen
- Implementer UseContext for User
- AddCategory Screen

**_ EXTRA DEPENDENCIES _**

- react-navigation: used for navigation.
- react-native-linear-gradient: used for gradient colors.
- react-native-gesture-handler: used for gestures.
- react-native-reanimated: used for animations.
- react-native-svg: used for SVG's.
- react-native-pie-chart: pie chart.
- react-native-picker/picker: used for scroll wheel picker.

npm install react-native-keyboard-aware-scroll-view --save

**_ BUG HELPER _**

- AsyncStorage.clear().then(() => console.log('Local storage cleared!'));
