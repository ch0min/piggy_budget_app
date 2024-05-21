import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import colors from "../../constants/colors";

const SecondaryNavBtn = ({ loading, navigation, navigateTo, btnText }) => {
	return (
		<View style={styles.btnContainer}>
			<TouchableOpacity style={styles.btn} onPress={() => navigation.navigate(navigateTo)} disabled={loading}>
				<Text style={styles.btnText}>{btnText}</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	btnContainer: {
		width: "90%",
		marginTop: "5%",
	},
	btn: {
		padding: 20,
		borderRadius: 99,
		borderWidth: 1,
		borderColor: colors.WHITE,
		backgroundColor: "transparent",
	},
	btnText: {
		textAlign: "center",
		fontSize: 18,
		fontWeight: "bold",
		color: colors.WHITE,
	},
});

export default SecondaryNavBtn;
