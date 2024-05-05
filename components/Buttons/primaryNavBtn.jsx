import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import colors from "../../utils/colors";

const primaryNavBtn = ({ loading, navigation, navigateTo, btnText }) => {
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
	},
	btn: {
		padding: 20,
		borderRadius: 99,
		backgroundColor: colors.WHITE,
	},
	btnText: {
		textAlign: "center",
		fontSize: 18,
		fontWeight: "bold",
		color: colors.PRIMARY,
	},
});

export default primaryNavBtn;
