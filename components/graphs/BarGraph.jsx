import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useUser } from "../../context/UserContext";
import colors from "../../utils/colors";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import FormatNumber from "../../utils/formatNumber";

const BarGraph = ({}) => {
	const { session } = useUser();

	return (
		<View style={styles.container}>
	
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,

	},
});

export default BarGraph;
