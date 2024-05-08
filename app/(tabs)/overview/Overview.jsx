import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Text, Button } from "react-native";
import { useUser } from "../../../context/UserContext";
import colors from "../../../utils/colors";
// import { RefreshControl } from "react-native";
import Header from "../../../components/headers/Header";
import PieGraph from "../../../components/graphs/PieGraph";

import { Ionicons } from "@expo/vector-icons";

const Overview = () => {
	const { loading, session, categoryList, getCategoryList } = useUser();

	return (
		<View style={styles.container}>
			<Text>Overview</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	// subContainer: {
	// 	flex: 1,
	// },
	graphContainer: {
		marginTop: -75,
		padding: 20,
	},
});

export default Overview;
