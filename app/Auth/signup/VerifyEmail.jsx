import React from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";

const VerifyEmail = ({ navigation }) => {
	const checkEmailVerification = async () => {
		const session = supabase.auth.session();

		// Refresh session to get the latest user info
		await supabase.auth.refreshSession();

		if (session && session.user.email_confirmed_at) {
			navigation.navigate("Login"); // Navigate only if email is verified
		} else {
			Alert.alert("Verification Pending", "Please verify your email before proceeding.");
		}
	};

	return (
		<View style={styles.container}>
			<Text>Thank you for signing up!</Text>
			<Text>Please verify your email by clicking the link we have sent you.</Text>
			<Button title="I've Verified My Email" onPress={checkEmailVerification} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 100,
	},
});

export default VerifyEmail;
