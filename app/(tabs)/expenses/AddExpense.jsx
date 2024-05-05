import React, { useState, useEffect } from "react";
import { StyleSheet, View, Modal, Text, TextInput, TouchableOpacity } from "react-native";
import { useUser } from "../../../context/UserContext";
import colors from "../../../utils/colors";
import NumericKeypad from "../../../utils/modals/NumericKeypad";

import { FontAwesome } from "@expo/vector-icons";

const AddExpense = ({ navigation }) => {
	const { selectedCategory, setSelectedCategory } = useUser();
	const [keypadVisible, setKeypadVisible] = useState(false);

	const [amount, setAmount] = useState("");
	const [description, setDescription] = useState("");

	const handleKeyPress = (key) => {
		if (key === "C") {
			setAmount("");
		} else if (key === "⌫") {
			setAmount((prev) => prev.slice(0, -1));
		} else {
			setAmount((prev) => prev + key);
		}
	};

	const openCategories = () => {
		navigation.navigate("Categories");
	};

	return (
		<View style={styles.container}>
			<View style={styles.headingContainer}>
				<Text style={styles.heading}>Add Expense</Text>
			</View>
			<TouchableOpacity style={styles.inputContainer} onPress={() => setKeypadVisible(true)}>
				<Text style={styles.input}>{amount || 0}</Text>
			</TouchableOpacity>
			<NumericKeypad
				keypadVisible={keypadVisible}
				handleKeyPress={handleKeyPress}
				onClose={() => setKeypadVisible(false)}
			/>

			<TouchableOpacity style={styles.selectedCategoryContainer} onPress={openCategories}>
				{selectedCategory && (
					<View style={[styles.iconCircle, { backgroundColor: selectedCategory.color }]}>
						<FontAwesome name={selectedCategory.icon} size={22} color={colors.WHITE} />
					</View>
				)}
				<Text style={styles.categoryText}>Category: </Text>
				<Text style={styles.selectedCategoryText}>
					{selectedCategory ? selectedCategory.name : "Select Category"}
				</Text>
			</TouchableOpacity>

			<View style={styles.descriptionContainer}>
				<TextInput />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	headingContainer: {
		marginTop: "5%",
	},
	heading: {
		textAlign: "center",
		fontSize: 18,
		color: colors.DARKGRAY,
	},
	inputContainer: {
		alignItems: "center",
		justifyContent: "center",

		borderBottomWidth: 1,
		borderBottomColor: colors.GRAY,
	},
	input: {
		margin: "10%",
		fontSize: 58,
		fontWeight: "bold",
		color: colors.BLACK,
	},
	selectedCategoryContainer: {
		flexDirection: "row",
		padding: "10%",

		borderBottomWidth: 1,
		borderBottomColor: colors.GRAY,
	},
	iconCircle: {
		alignItems: "center",
		justifyContent: "center",
		width: 40,
		height: 40,
		marginRight: "5%",
		borderRadius: 35,
	},
	categoryText: {
		marginTop: "3%",
		fontSize: 18,
		color: colors.DARKGRAY,
	},
	selectedCategoryText: {
		marginTop: "3%",
		fontSize: 18,
		color: colors.BLACK,
	},
});

export default AddExpense;
