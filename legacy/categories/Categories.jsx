import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, FlatList } from "react-native";
import { useUser } from "../../../context/UserContext";
import colors from "../../../utils/colors";

import Icon from "react-native-vector-icons/FontAwesome";
import { FontAwesome6, AntDesign } from "@expo/vector-icons";

import { useFocusEffect } from "@react-navigation/native";

const Categories = ({ navigation }) => {
	const {
		expenseGroupsList,
		getExpenseGroupsList,
		categoriesByExpenseGroups,
		getCategoriesByExpenseGroups,
		setSelectedCategory,
	} = useUser();

	useEffect(() => {
		getExpenseGroupsList();
	}, []);

	useEffect(() => {
		getCategoriesByExpenseGroups();
	}, [expenseGroupsList]);

	useFocusEffect(
		useCallback(() => {
			const fetchCategoriesData = async () => {
				await getExpenseGroupsList();
				await getCategoriesByExpenseGroups();
			};
			fetchCategoriesData();
		}, [])
	);

	const handleSelectedCategory = (category) => {
		setSelectedCategory(category);
		navigation.goBack();
	};

	const renderItem = ({ item }) => (
		<View style={styles.iconContainer}>
			<TouchableOpacity
				style={[styles.icon, { backgroundColor: item.color }]}
				onPress={() => handleSelectedCategory(item)}
			>
				<Icon name={item.icon} size={24} color={colors.WHITE} />
			</TouchableOpacity>
			<Text style={styles.categoryText}>{item.name}</Text>
		</View>
	);

	return (
		<View style={styles.container}>
			<View style={styles.headingContainer}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<AntDesign name="close" size={24} color={colors.WHITE} />
				</TouchableOpacity>
				<Text style={styles.heading}>CATEGORIES</Text>
				<TouchableOpacity onPress={() => navigation.navigate("AddCategory")}>
					<FontAwesome6 name="add" size={24} color={colors.WHITE} />
				</TouchableOpacity>
			</View>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				{expenseGroupsList.map((group) => (
					<View key={group.id} style={styles.groupContainer}>
						<Text style={styles.groupHeading}>{group.name}</Text>
						<View style={styles.horizontalLine} />
						<FlatList
							keyExtractor={(item) => item.id.toString()}
							data={categoriesByExpenseGroups[group.id]}
							renderItem={renderItem}
							numColumns={4}
							style={styles.categoriesList}
							scrollEnabled={false}
						/>
					</View>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.LICORICE,
		opacity: 0.7,
	},
	headingContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginHorizontal: "5%",
		marginVertical: "15%",
	},
	heading: {
		textAlign: "center",
		fontSize: 18,
		color: colors.WHITE,
	},
	scrollContainer: {
		paddingBottom: "5%",
	},
	subContainer: {
		flex: 1,
	},
	groupContainer: {
		marginTop: 20,
		paddingHorizontal: 20,
	},
	groupHeading: {
		marginBottom: 20,
		fontSize: 22,
		color: colors.WHITE,
	},
	horizontalLine: {
		borderBottomWidth: 1,
		borderBottomColor: colors.WHITE,
		opacity: 0.2,
	},
	iconContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: "5%",
	},
	icon: {
		alignItems: "center",
		justifyContent: "center",
		width: 60,
		height: 60,
		margin: "4.5%",
		borderRadius: 37.5,
	},
	categoriesList: {
		marginBottom: "5%",
	},
	categoryText: {
		fontSize: 14,
		color: colors.WHITE,
	},
});

export default Categories;
