import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { supabase } from "./utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Landing from "./app/landing/Landing";
import Login from "./app/auth/login/Login";
import Signup from "./app/auth/signup/Signup";
import Account from "./app/auth/login/Account";
import Home from "./app/tabs/home/Home";
import VerifyEmail from "./app/auth/signup/VerifyEmail";
import CompleteProfile from "./app/auth/login/CompleteProfile";

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
					<CompleteProfile key={session.user.id} session={session} />
				) : (
					<Stack.Navigator
						initialRouteName="Landing"
						screenOptions={{
							headerShown: false,
							gestureEnabled: false,
							// gestureDirection: "horizontal",
						}}
					>
						<Stack.Screen name="Landing" component={Landing}></Stack.Screen>
						<Stack.Screen name="Signup" component={Signup}></Stack.Screen>
						<Stack.Screen name="Login" component={Login}></Stack.Screen>
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
