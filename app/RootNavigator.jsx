import "react-native-url-polyfill/auto";
import { StatusBar, StyleSheet, View, ActivityIndicator } from "react-native";
import { useUser } from "../context/UserContext";

import AsyncStorage from "@react-native-async-storage/async-storage";
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

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
	const { user, profileCompleted } = useUser();

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
					{user ? (
						profileCompleted ? (
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
										gestureEnabled: true,
									}}
								/>
							</>
						) : (
							<Stack.Screen name="CompleteProfile" component={CompleteProfile} />
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
