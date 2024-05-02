import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../utils/colors";

const ExecuteBtn = ({ loading, execFunction, btnText }) => {
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
		alignSelf: "flex-end",
		width: "45%",
		marginRight: "2%",
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
