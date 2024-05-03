import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { supabase } from "./utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";

import Landing from "./app/landing/Landing";
import Login from "./app/auth/login/Login";
import Signup from "./app/auth/signup/Signup";
import VerifyEmail from "./app/auth/signup/VerifyEmail";
import CompleteProfile from "./app/auth/login/CompleteProfile";
import HomeTabs from "./app/(tabs)/HomeTabs";
import AddNewCategory from "./app/(tabs)/add_budget/AddNewCategory";

const Stack = createNativeStackNavigator();

const App = () => {
	const [loading, setLoading] = useState(false);
	const [session, setSession] = useState(null);
	const [profileCompleted, setProfileCompleted] = useState(false);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			checkProfile(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			checkProfile(session);
		});
	}, []);

	const checkProfile = async (session) => {
		if (session && session.user) {
			const { data, error } = await supabase
				.from("profiles")
				.select("profile_completed")
				.eq("id", session?.user.id)
				.single();

			setLoading(true);
			if (error) {
				console.error("Error fetching profile:", error.message);
				return;
			}

			if (data) {
				setProfileCompleted(data.profile_completed);
			}
		}
		setLoading(false);
	};
	// AsyncStorage.clear().then(() => console.log("Local storage cleared!"));

	return (
		<View style={styles.container}>
			<StatusBar barStyle="light-content" />

			<NavigationContainer>
				<Stack.Navigator
					initialRouteName="Landing"
					screenOptions={{
						headerShown: false,
						gestureEnabled: false,
					}}
				>
					{session && session.user ? (
						profileCompleted ? (
							<>
								<Stack.Screen
									name="HomeTabs"
									children={({ navigation }) => <HomeTabs session={session} navigation={navigation} />}
								/>
								<Stack.Screen
									name="AddNewCategory"
									component={AddNewCategory}
									options={{ presentation: "modal", gestureEnabled: true, gestureDirection: "vertical" }}
								/>
							</>
						) : (
							<Stack.Screen
								name="CompleteProfile"
								children={({ navigation }) => (
									<CompleteProfile
										session={session}
										navigation={navigation}
										setProfileCompleted={setProfileCompleted}
									/>
								)}
							/>
						)
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
		flex: 1,
	},
});

export default App;
