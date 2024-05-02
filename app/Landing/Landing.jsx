import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import colors from "../../utils/colors";
import { LinearGradient } from "expo-linear-gradient";
import logo from "../../assets/images/logo.png";

import PrimaryNavBtn from "../../components/Buttons/primaryNavBtn";
import SecondaryNavBtn from "../../components/Buttons/secondaryNavBtn";

const Landing = ({ navigation }) => {
	return (
		<LinearGradient colors={[colors.SECONDARY, colors.PRIMARY]} locations={[0.3, 1.0]} style={styles.container}>
			<View style={styles.subContainer}>
				<Text style={styles.heading}>Welcome to Piggy</Text>
				<Text style={styles.subheading}>Let's get control of your economy!</Text>
				<Image source={logo} style={styles.logo} />

				<PrimaryNavBtn navigation={navigation} navigateTo={"Signup"} btnText={"Get Started"} />
				<SecondaryNavBtn navigation={navigation} navigateTo={"Login"} btnText={"Login"} />
			</View>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	subContainer: {
		alignItems: "center",
		width: "100%",
		height: "100%",
		marginTop: 350,
	},
	heading: {
		alignSelf: "flex-start",
		marginBottom: 10,
		marginLeft: 30,
		fontSize: 20,
		color: colors.GRAY,
	},
	subheading: {
		alignSelf: "flex-start",
		marginLeft: 30,
		fontSize: 32,
		fontWeight: "bold",
		color: colors.WHITE,
	},
	logoContainer: {
		alignItems: "center",
		justifyContent: "center",
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
	},
});

export default Landing;
