**_ TODO _**

-  ÆNDRE ALT MARGIN OSV TIL PERCENTAGE
-  CompleteProfile er et must, så derfor kan en user kun fortsætte efter udfyldelse.
-  Home Page
-  Sign Up Boarding Page with more options like profile picture and so on.
-  Change colors
-  Change fonts
-  Fix details on both iOS and Android so they look the same.
-  Login with google or facebook?
-  SVG
-  Skift alt til dansk?
-  Brugt CAPTCHA til BRUTEFORCE!!!!!
-  SPLASH SCREEN
-  Pass loading as a prop down from App.jsx to children

MINOR BUGS:
- Sometimes when you login you will quickly see the CompleteProfile Screen.

**_ SECURITY TEST _**

-  Signup:

   -  Anonymous signin
   -  Password mismatch
   -  Password too short
   -  User already exists

   -  No email
   -  No password
   -  Invalid email

**_ DONE _**

-  Landing Page
-  Signup Page
-  Login Page

**_ EXTRA DEPENDENCIES _**

-  react-navigation: used for navigation.
-  react-native-linear-gradient: used for gradient colors.
-  react-native-gesture-handler: used for gestures.
-  react-native-reanimated: used for animations.
-  react-native-svg: used for SVG's.

npm install react-native-keyboard-aware-scroll-view --save

**_ BUG HELPER _**

-  AsyncStorage.clear().then(() => console.log('Local storage cleared!'));
