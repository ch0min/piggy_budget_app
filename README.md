**_ TODO _**

NEXT:

-  Fix so that a user can make a monthly goal on each month / or atleast the Piggy Bank screen show refresh as a whole.
-  Email redirection
-  Complete Profile "cannot find property "name" of null, pga. valuta.
-  CAPTCHA
-  ÆNDRE ALT MARGIN OSV TIL PERCENTAGE
-  Change fonts
-  Fix details on both iOS and Android so they look the same.

-  AFTER EXAM
   -  Fix multiple create monthly budget fast clicking.
   -  Fix: Activity Indicators buttons.
   -  Når du ændrer valuta vis det i budget og expense.
   -  Fix user_id i stedet for at have det i alle, så lav joins.

Exam:

-  Hvorfor bruge expo router vs react native navigation?
-  useContext for navigation?

MINOR BUGS:

-  If you edit an existing transaction and tap out, and then click New transaction, then it will placehold the existing one.
-  Sometimes when you login you will quickly see the CompleteProfile Screen.
-  Quickly clicking on the checkmark when creating a new transaction will create multiple.
-  Quickly deleting multiple transactions shouldnt be a thing. (Maybe just remove the alert)

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
-  react-native-svg: used for SVG'sk
-  react-native-pie-chart: pie chart.
-  react-native-gifted-charts: graphs
-  react-native-picker/picker: used for scroll wheel picker.
-  react-native-swiper: used for monthly swiper. npm install react-native-keyboard-aware-scroll-view --save
-  expo-image-picker: used for saving images from a user's library.
-  base64-arraybuffer: used for images.

**_ BUG HELPER _**

-  AsyncStorage.clear().then(() => console.log('Local storage cleared!'));

**_ DATABASE STRUCTURE _**

expense_areas - id: int, user_id (foreign key->profiles): uuid, name: text, total_budget: numeric

expenses - id: int, created_at: date, user_id (foreign key->profiles): uuid, name: text, icon: text, color: text, total_spent: numeric, max_budget: numeric, expense_areas_id (foreign key->expense_areas): int

transactions - id: int, created_at: date, user_id (foreign key->profiles): uuid, amount: numeric, note: text, expenses_id (foreign key->expenses): int

profiles - id: uuid, updated_at: date, avatar: text, first_name: text, last_name: text, profile_completed: bool, valuta_id: int (foreign key->valuta)

valuta - id: int, name: text

monthly_budgets - id: int, month: int, year: int, user_id: uuid (foreign key to profile), total_spent_month: numeric, total_budget_month: numeric

monthly_goals - id: int, name: text, savings_goal: numeric, image: text, monthly_budgets_id (foreign key->monthly_budgets), user_id(foreign key->profiles)

piggy_bank - id: int, created_at: date, name: text, user_id(foreign key->profiles)

AUTH TABLE: users
