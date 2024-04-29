import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import colors from "../../utils/colors";

const ExecuteBtn = ({ execFunction, btnText }) => {
	return (
		<View style={styles.btnContainer}>
			<TouchableOpacity style={styles.btn} onPress={execFunction}>
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
		textAlign: "center",
		fontSize: 16,
		fontWeight: "bold",
		color: colors.WHITE,
	},
});

export default ExecuteBtn;
