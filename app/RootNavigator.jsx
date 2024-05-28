import "react-native-url-polyfill/auto";
import React from "react";
import { StatusBar, StyleSheet, View, Text, Image } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../contexts/AuthContext";
import colors from "../constants/colors";
import logo from "../assets/images/logo.png";

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
	const { loading, user, profileCompleted } = useAuth();

	// Splash Loading:

	return (
		<View style={styles.container}>
			<StatusBar barStyle="light-content" />

			<NavigationContainer>
				<Stack.Navigator
					initialRouteName="Landing"
					screenOptions={{
						headerShown: false,
						gestureEnabled: false,
						unmountOnBlur: false,
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
					) : user && !profileCompleted ? (
						<Stack.Screen name="CompleteProfile" component={CompleteProfile} />
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
			{loading && (
				<LinearGradient colors={[colors.SECONDARY, colors.PRIMARY]} locations={[0.3, 1.0]} style={styles.overlay}>
					<View style={styles.loadingContainer}>
						<Text style={styles.heading}>Velkommen til Piggy</Text>
						<Image source={logo} style={styles.logo} />
						<Text style={styles.subheading}>Det tager lige et øjeblik...</Text>
					</View>
				</LinearGradient>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// alignItems: "center",
	},
	initialSetup: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	overlay: {
		position: "absolute",
		width: "100%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	loadingContainer: {
		alignItems: "center",
		width: "100%",
		height: "100%",
		marginTop: "60%",
	},
	heading: {
		alignSelf: "center",
		fontSize: 28,
		fontWeight: "bold",
		color: colors.WHITE,
	},
	subheading: {
		alignSelf: "center",
		marginLeft: "5%",
		fontSize: 22,
		color: colors.WHITE,
	},
	logo: {
		width: 250,
		height: 250,
		marginVertical: "12%",

		// Shadow for iOS
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		// Android
		elevation: 1,
	},
});

export default RootNavigator;
