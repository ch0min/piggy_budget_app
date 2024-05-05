import React, { useState, useEffect } from "react";
import { StyleSheet, View, StatusBar, Modal, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useUser } from "../../../context/UserContext";
import colors from "../../../utils/colors";
import ColorPicker from "../../../utils/colorPicker";
import PickerWheel from "../../../utils/modals/PickerWheel";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const AddCategory = () => {
	const { loading, session, expenseGroupsList, getExpenseGroupsList, createCategory } = useUser();
	const [pickerVisible, setPickerVisible] = useState(false);

	const [categoryName, setCategoryName] = useState("");
	const [selectedIcon, setSelectedIcon] = useState("");
	const [selectedColor, setSelectedColor] = useState(colors.CATEGORY_COLOR_LIST[0]);

	const [selectedExpenseGroup, setSelectedExpenseGroup] = useState(1);
	const [selectedExpenseGroupName, setSelectedExpenseGroupName] = useState("Diverse");

	useEffect(() => {
		getExpenseGroupsList();
	}, []);

	useEffect(() => {
		if (expenseGroupsList.length > 0) {
			const initialMainCategory = expenseGroupsList[0];
			setSelectedExpenseGroup(initialMainCategory.id);
		}
	}, [expenseGroupsList]);

	const handleValueChange = (itemValue) => {
		const expenseGroup = expenseGroupsList.find((eg) => eg.id === Number(itemValue));

		if (expenseGroup) {
			setSelectedExpenseGroup(itemValue);
			setSelectedExpenseGroupName(expenseGroup.name);
		}
	};

	return (
		<View style={styles.container}>
			<StatusBar hidden={true} />
			<View style={styles.headingContainer}>
				<Text style={styles.heading}>New Category</Text>
			</View>

			<View style={styles.cardContainer}>
				<Text style={styles.cardHeading}>Name</Text>
				<View style={styles.cardInput}>
					<TextInput style={{ flex: 1, fontSize: 24 }} placeholder="Required" />
					<MaterialIcons name="edit" size={24} color={colors.GRAY} />
				</View>
			</View>

			<View style={styles.cardContainer}>
				<Text style={styles.cardHeading}>Main Category</Text>
				<TouchableOpacity style={styles.cardInput} onPress={() => setPickerVisible(!pickerVisible)}>
					<Text style={styles.pickerText}>{selectedExpenseGroupName}</Text>
				</TouchableOpacity>
				<PickerWheel
					pickerVisible={pickerVisible}
					items={expenseGroupsList}
					selectedValue={selectedExpenseGroup}
					onValueChange={handleValueChange}
					onClose={() => setPickerVisible(false)}
				/>
			</View>

			<View style={styles.cardContainer}>
				<Text style={styles.cardHeading}>Appearence</Text>
				<View style={styles.cardInput}>
					<ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: "20%",
		backgroundColor: colors.GRAYBLUE,
	},
	headingContainer: {
		height: "11%",
		backgroundColor: colors.WHITE,

		// Shadow for Android
		elevation: 1,

		// Shadow for iOS
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
	},
	heading: {
		textAlign: "center",
		marginTop: "15%",
		fontSize: 16,
		color: colors.BLACK,
		textTransform: "uppercase",
	},
	cardContainer: {
		height: "12%",
		backgroundColor: colors.WHITE,

		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
	},
	cardHeading: {
		marginTop: "7%",
		marginLeft: "7%",
		fontSize: 12,
		color: colors.DARKGRAY,
		textTransform: "uppercase",
	},
	cardInput: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: "1%",
		marginHorizontal: "7%",
	},
	pickerText: {
		flex: 1,
		fontSize: 24,
		color: colors.DARKGRAY,
	},
});

export default AddCategory;
