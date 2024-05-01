import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { supabase } from "./utils/supabase";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Landing from "./app/Landing/Landing";
import Login from "./app/Auth/login/Login";
import SignUp from "./app/Auth/signup/SignUp";
import Account from "./app/Auth/login/Account";
import Home from "./app/(tabs)/Home/Home";
import VerifyEmail from "./app/Auth/signup/VerifyEmail";
import CompleteProfile from "./app/Auth/signup/CompleteProfile";

const Stack = createNativeStackNavigator();

const App = () => {
	const [session, setSession] = useState(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	return (
		<View style={styles.container}>
			<NavigationContainer>
				{session && session.user ? (
					<Home key={session.user.id} session={session} />
				) : (
					<Stack.Navigator
						initialRouteName="Landing"
						screenOptions={{
							headerShown: false,
							gestureEnabled: true,
							gestureDirection: "horizontal",
						}}
					>
						<Stack.Screen name="Landing" component={Landing}></Stack.Screen>
						<Stack.Screen name="SignUp" component={SignUp}></Stack.Screen>
						<Stack.Screen name="Login" component={Login}></Stack.Screen>
						{/* <Stack.Screen name="Account" component={Account}></Stack.Screen> */}
						<Stack.Screen name="Home" component={Home}></Stack.Screen>
						<Stack.Screen name="VerifyEmail" component={VerifyEmail}></Stack.Screen>
						<Stack.Screen name="CompleteProfile" component={CompleteProfile}></Stack.Screen>
					</Stack.Navigator>
				)}
			</NavigationContainer>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
	},
});

export default App;
