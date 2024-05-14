import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Alert, StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { useUser } from "../../../context/UserContext";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import colors from "../../../utils/colors";
// import { RefreshControl } from "react-native";
import OverviewHeader from "../../../components/headers/OverviewHeader";
import BarGraph from "../../../components/graphs/BarGraph";
import FormatNumber from "../../../utils/formatNumber";
import { FontAwesome, MaterialIcons, Feather, AntDesign, Entypo } from "@expo/vector-icons";

const Overview = ({ navigation }) => {
	const {
		session,
		userProfile,
		expenseAreas,
		getExpenseAreas,
		createExpenseArea,
		updateExpenseArea,
		deleteExpenseArea,
		expenses,
		getExpenses,
	} = useUser();

	return (
		<View style={styles.container}>
			<OverviewHeader session={session} />

			<View style={styles.graphContainer}>
				<BarGraph />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	graphContainer: {
		flex: 1,
	},
});

export default Overview;
