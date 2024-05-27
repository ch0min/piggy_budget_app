import "react-native-url-polyfill/auto";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useExpenses } from "../contexts/ExpensesContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import Landing from "./landing/Landing";
import Login from "./auth/login/Login";
import Signup from "./auth/signup/Signup";
import VerifyEmail from "./auth/signup/VerifyEmail";
import CompleteProfile from "./auth/login/CompleteProfile";
import HomeTabs from "./(tabs)/HomeTabs";

import AddExpense from "./(tabs)/expenses/AddExpense";
import Expenses from "./(tabs)/expenses/Expenses";
import Settings from "./(tabs)/settings/Settings";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
	const { user, profileCompleted } = useAuth();
	const { loading } = useExpenses();

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
					{user && profileCompleted ? (
						<>
							<Stack.Screen name="HomeTabs" component={HomeTabs} />
							<Stack.Screen
								name="Expenses"
								component={Expenses}
								options={{
									gestureEnabled: true,
								}}
							/>
							<Stack.Screen
								name="AddExpense"
								component={AddExpense}
								options={{
									presentation: "modal",
									gestureEnabled: !loading,
								}}
							/>
							<Stack.Screen
								name="Settings"
								component={Settings}
								options={{
									presentation: "modal",
									gestureEnabled: true,
								}}
							/>
						</>
					) : (
						<Stack.Screen name="CompleteProfile" component={CompleteProfile} />
					)}
					{!user && (
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
	initialSetup: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default RootNavigator;
