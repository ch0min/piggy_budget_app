import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import colors from "../../utils/colors";
import { AntDesign } from "@expo/vector-icons";

const CenterAddBtn = ({ onPress }) => {
	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.btn} onPress={onPress}>
				<AntDesign name="pluscircle" size={60} color={colors.SECONDARY} />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	btn: {
		height: "150%",
		borderWidth: 5,
		borderRadius: 37.5,
		borderColor: "#FFF",
	},
});

export default CenterAddBtn;
