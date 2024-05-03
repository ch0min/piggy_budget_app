import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import { supabase } from "../../../utils/supabase";
import colors from "../../../utils/colors";

const AddNewCategory = ({ session }) => {
	const [loading, setLoading] = useState(false);
	const [selectedIcon, setSelectedIcon] = useState("IC");
	const [selectedColor, setSelectedColor] = useState(colors.CATEGORY_COLOR_LIST[0]);
	const [categoryName, setCategoryName] = useState("");
	const [totalBudget, setTotalBudget] = useState(0);

	const onCreateCategory = async () => {
		setLoading(true);
		const userEmail = session?.user?.email; // Ensure you have user email from session

		if (!userEmail) {
			alert("No user email found");
			setLoading(false);
			return;
		}

		const { data, error } = await supabase.from("Category").insert([
			{
				name: categoryName,
				assigned_budget: totalBudget,
				icon: selectedIcon,
				color: selectedColor,
				created_by: userEmail,
			},
		]);

		if (data) {
			console.log(data);
			// Navigate to the details page for the newly created category
			navigation.navigate("CategoryDetails", { categoryId: data[0].id });
			setLoading(false);
			alert("Category Created!");
		}
		if (error) {
			console.error("Error creating category:", error.message);
			setLoading(false);
			alert("Failed to create category.");
		}
	};

	return (
		<View style={styles.container}>

		</View>
	
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		
	}
});

export default AddNewCategory;
