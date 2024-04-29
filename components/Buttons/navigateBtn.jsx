import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import colors from "../../utils/colors";

const NavigateBtn = ({ navigation, navigateTo, btnText }) => {
	return (
		<View style={styles.btnContainer}>
			<TouchableOpacity style={styles.btn} onPress={() => navigation.navigate(navigateTo)}>
				<Text style={styles.btnText}>{btnText}</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	btnContainer: {
		width: "90%",
		marginTop: 50,
	},
	btn: {
		padding: 20,
		borderRadius: 99,
		backgroundColor: colors.SECONDARY,
	},
	btnText: {
		textAlign: "center",
		fontSize: 16,
		fontWeight: "bold",
		color: colors.WHITE,
	},
});

export default NavigateBtn;
