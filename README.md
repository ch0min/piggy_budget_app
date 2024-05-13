**_ TODO _**

NEXT: Rækkefølge
Mandag: 
-  Lav Piechart færdig
-  Lav Profil billede færdig
Tirsdag:
-  Lav valuta
-  Lav Overview Screen
Resten af ugen:
-  Lav Loading indicator for alle buttons.
-  Fix bug med CompleteProfile screen hurtig vises.
-  Lav splash screen.
-  Email redirection
-  CAPTCHA

-  Categories Screen AddCategory Screen skal moduleres.
-  ÆNDRE ALT MARGIN OSV TIL PERCENTAGE
-  Change colors
-  Change fonts
-  Fix details on both iOS and Android so they look the same.
-  Login with google or facebook?
-  SVG
-  Skift alt til dansk?
-  SPLASH SCREEN

Exam:

-  Hvorfor bruge expo router vs react native navigation?
-  useContext for navigation?
-  Tilføj loading indicator.
-  ADD SHADOW ON ANDROID
-  CHECK ALL RLS in SUPABASE
-  Fix information for expenses til max antal characters.
-  CHANGE DATES ON CREATED_ATS WHEN WE ADD MONTHS

MINOR BUGS:
-  If you edit an existing transaction and tap out, and then click New transaction, then it will placehold the existing one.
-  Sometimes when you login you will quickly see the CompleteProfile Screen.

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

**_ EXTRA DEPENDENCIES _**

-  react-navigation: used for navigation.
-  react-native-linear-gradient: used for gradient colors.
-  react-native-gesture-handler: used for gestures.
-  react-native-reanimated: used for animations.
-  react-native-svg: used for SVG's.
-  react-native-pie-chart: pie chart.
-  react-native-gifted-charts: graphs
-  react-native-picker/picker: used for scroll wheel picker.

npm install react-native-keyboard-aware-scroll-view --save

**_ BUG HELPER _**

-  AsyncStorage.clear().then(() => console.log('Local storage cleared!'));



DB: 
PUBLIC TABLES:
expense_areas: 
id, uuid
user_id (foreign key->profiles), uuid
name, text
total_budget, numeric

expenses: 
id, uuid
created_at, date
user_id (foreign key->profiles), uuid
name, text
icon, text
color, text
max_budget, numeric
expense_areas_id (foreign key->expense_areas), uuid

transactions:
id, uuid
created_at, date
user_id (foreign key->profiles), uuid
amount, numeric
note, text
expenses_id (foreign key->expenses), uuid

profiles:
id, uuid
updated_at, date
avatar, text
first_name, text
last_name, text
profile_completed, bool

AUTH TABLE:
users