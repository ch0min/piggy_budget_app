import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
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
	const [loading, setLoading] = useState(false);
	const [session, setSession] = useState(null);
	const [profileCompleted, setProfileCompleted] = useState(false);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			fetchProfile(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			fetchProfile(session);
		});
	}, []);

	const fetchProfile = async (session) => {
		if (session && session.user) {
			const { data, error } = await supabase.from("profiles").select("profile_completed").eq("id", session.user.id).single();

			setLoading(true);
			if (error) {
				console.error("Error fetching profile:", error.message);
				return;
			}

			if (data) {
				setProfileCompleted(data.profile_completed);
			}
		}
	};

	return (
		<View style={styles.container}>
			<NavigationContainer>
				<Stack.Navigator
					initialRouteName="Landing"
					screenOptions={{
						headerShown: false,
						gestureEnabled: false,
					}}
				>
					{session && session.user ? (
						<>
							{profileCompleted ? (
								<Stack.Screen name="Home" children={() => <Home session={session} />} />
							) : (
								<Stack.Screen name="CompleteProfile" children={({ navigation }) => <CompleteProfile session={session} navigation={navigation} />} />
							)}
						</>
					) : (
						<>
							<Stack.Screen name="Landing" component={Landing} />
							<Stack.Screen name="Signup" component={Signup} />
							<Stack.Screen name="Login" component={Login} />
							<Stack.Screen name="VerifyEmail" component={VerifyEmail} />
						</>
					)}
				</Stack.Navigator>
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
