import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import colors from "../../utils/colors";

const TextBtn = ({ loading, navigation, navigateTo, text, colorText, btnText }) => {
	return (
		<View style={styles.btnLogin}>
			<Text style={[styles.btnLoginText, { color: colorText }]}>{text}</Text>
			<TouchableOpacity onPress={() => navigation.navigate(navigateTo)} disabled={loading}>
				<Text style={styles.btnSignInText}> {btnText}</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	btnLogin: {
		flexDirection: "row",
		justifyContent: "center",
		padding: 20,
	},
	btnLoginText: {
		textAlign: "center",
		fontSize: 14,
		fontWeight: "bold",
	},
	btnSignInText: {
		fontWeight: "bold",
		color: colors.SECONDARY,
	},
});

export default TextBtn;
