import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import colors from "../../constants/colors";

const PrimaryExecBtn = ({ loading, execFunction, btnText }) => {
	return (
		<View style={styles.btnContainer}>
			<TouchableOpacity style={styles.btn} onPress={execFunction} disabled={loading}>
				<Text style={styles.btnText}>{btnText}</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	btnContainer: {
		width: "100%",
		marginTop: 30,
	},
	btn: {
		padding: 20,
		borderRadius: 99,
		backgroundColor: colors.SECONDARY,
	},
	btnText: {
		alignSelf: "center",
		textAlign: "center",
		fontSize: 16,
		fontWeight: "bold",
		color: colors.WHITE,
	},
});

export default PrimaryExecBtn;
