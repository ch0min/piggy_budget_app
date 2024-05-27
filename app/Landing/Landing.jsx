import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import colors from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import logo from "../../assets/images/logo.png";

import PrimaryNavBtn from "../../components/buttons/primaryNavBtn";
import SecondaryNavBtn from "../../components/buttons/secondaryNavBtn";

const Landing = ({ navigation }) => {
	return (
		<LinearGradient
			colors={[colors.SECONDARY, colors.TERTIARY, colors.PRIMARY]}
			locations={[0.2, 0.4, 1.0]}
			style={styles.container}
		>
			<View style={styles.subContainer}>
				<Text style={styles.heading}>Velkommen til Piggy</Text>
				<Text style={styles.subheading}>Lad os få kontrol over din økonomi!</Text>
				<Image source={logo} style={styles.logo} />

				<PrimaryNavBtn navigation={navigation} navigateTo={"Signup"} btnText={"Kom igang"} />
				<SecondaryNavBtn navigation={navigation} navigateTo={"Login"} btnText={"Log ind"} />
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
		marginTop: "60%",
	},
	heading: {
		alignSelf: "flex-start",
		marginBottom: "2%",
		marginLeft: "5%",
		fontSize: 20,
		color: colors.GRAY,
	},
	subheading: {
		alignSelf: "flex-start",
		marginLeft: "5%",
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
		// Android
		elevation: 1,
	},
});

export default Landing;
