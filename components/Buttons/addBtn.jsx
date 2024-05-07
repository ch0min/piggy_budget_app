import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import colors from "../../utils/colors";
import { Entypo } from "@expo/vector-icons";

const AddBtn = ({ onPress }) => {
	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.btn} onPress={onPress}>
				<Entypo name="plus" size={20} color="black" />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	btn: {
		alignItems: "center",
		justifyContent: "center",
		width: 30,
		height: 30,
		borderRadius: 37.5,
		backgroundColor: colors.LIGHT,
	},
});

export default AddBtn;
