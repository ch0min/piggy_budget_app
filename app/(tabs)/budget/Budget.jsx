import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, FlatList } from "react-native";
import { useUser } from "../../../context/UserContext";
import colors from "../../../utils/colors";
// import { RefreshControl } from "react-native";
import OverviewHeader from "../../../components/headers/OverviewHeader";
import PieGraph from "../../../components/graphs/PieGraph";

import { Ionicons } from "@expo/vector-icons";

const Budget = () => {
	const {
		loading,
		session,
		categoryList,
		getCategoryList,
		expenseGroupsList,
		getExpenseGroupsList,
		categoriesByExpenseGroups,
		getCategoriesByExpenseGroups,

		categoriesByExpenseGroupsForUser,
		getCategoriesByExpenseGroupsForUser,
	} = useUser();

	useEffect(() => {
		if (session?.user) {
			getExpenseGroupsList();
		}
	}, [session]);

	// useEffect(() => {
	// 	getExpenseGroupsList();
	// }, []);

	useEffect(() => {
		if (expenseGroupsList.length > 0 && session?.user) getCategoriesByExpenseGroupsForUser();
	}, [expenseGroupsList, session]);

	const renderItem = ({ item }) => (
		<View>
			<TouchableOpacity style={{ backgroundColor: colors.RED }}></TouchableOpacity>
			<Text style={{ color: "red" }}>
				{item.name} - {item.amount}
			</Text>
		</View>
	);

	return (
		<View style={styles.container}>
			<OverviewHeader session={session} />
			<View style={styles.graphContainer}>
				<PieGraph />
			</View>

			<View>
				{expenseGroupsList.map((group) => (
					<View key={group.id}>
						<Text>{group.name}</Text>

						<FlatList
							keyExtractor={(item) => item.id.toString()}
							data={categoriesByExpenseGroupsForUser[group.id]}
							renderItem={renderItem}
						/>
					</View>
				))}
			</View>
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

export default Budget;
