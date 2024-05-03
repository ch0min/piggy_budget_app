import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { useUser } from "../context/UserContext";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";

import Landing from "./landing/Landing/";
import Login from "./auth/login/Login";
import Signup from "./auth/signup/Signup";
import VerifyEmail from "./auth/signup/VerifyEmail";
import CompleteProfile from "./auth/login/CompleteProfile";
import HomeTabs from "./(tabs)/HomeTabs";
import AddNewCategory from "./(tabs)/add_budget/AddNewCategory";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
	const { session, profileCompleted } = useUser();

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

export default RootNavigator;
