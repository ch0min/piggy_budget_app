import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import colors from "../../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import logo from "../../../assets/images/logo2.png";

const VerifyEmail = ({ navigation }) => {
	const [countdown, setCountdown] = useState(10);

	useEffect(() => {
		const timer = setTimeout(() => {
			navigation.navigate("Landing");
		}, 11000);

		const countdownTimer = setInterval(() => {
			setCountdown((currentCountdown) => {
				if (currentCountdown <= 1) {
					clearInterval(countdownTimer);
					return 0;
				}
				return currentCountdown - 1;
			});
		}, 1000);

		return () => {
			clearTimeout(timer);
			clearInterval(countdownTimer);
		};
	}, []);

	return (
		<LinearGradient colors={[colors.SECONDARY, colors.PRIMARY]} locations={[0.3, 1.0]} style={styles.container}>
			<View style={styles.subContainer}>
				<Text style={styles.heading}>Tak for din oprettelse!</Text>
				<Text style={styles.subheading}>Venligst tjek din email for at verificere din bruger.</Text>
				<Image source={logo} style={styles.logo} />

				<Text style={styles.redirectedHeading}>Du vil blive omdirigeret om lidt.</Text>
				<Text style={styles.countdown}>Omdirigerer om {countdown}...</Text>
			</View>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: colors.WHITE,
	},
	subContainer: {
		alignItems: "center",
		width: "100%",
		height: "100%",
		marginTop: 150,
	},
	heading: {
		fontSize: 26,
		fontWeight: "bold",
		color: colors.WHITE,
	},
	subheading: {
		marginTop: "2%",
		fontSize: 16,
		color: colors.GRAY,
	},
	logo: {
		marginTop: "15%",
		width: 200,
		height: 200,
	},
	redirectedHeading: {
		marginTop: "25%",
		fontSize: 16,
		color: colors.GRAY,
	},
	countdown: {
		marginTop: 20,
		fontSize: 20,
		fontWeight: "bold",
		color: colors.WHITE,
	},
});

export default VerifyEmail;
