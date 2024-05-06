import React, { useState, useEffect } from "react";
import { StyleSheet, View, StatusBar, Modal, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useUser } from "../../../context/UserContext";
import colors from "../../../utils/colors";
import ColorPicker from "../../../utils/colorPicker";
import PickerWheel from "../../../utils/modals/PickerWheel";
import { FontAwesome, MaterialIcons, AntDesign } from "@expo/vector-icons";
import icons from "../../../utils/icons";

import IconPicker from "../../../utils/modals/IconPicker";

const AddCategory = ({ navigation }) => {
	const { loading, expenseGroupsList, getExpenseGroupsList, createCategory } = useUser();
	const [pickerVisible, setPickerVisible] = useState(false);
	const [iconPickerVisible, setIconPickerVisible] = useState(false);

	const [categoryName, setCategoryName] = useState("");
	const [selectedIcon, setSelectedIcon] = useState("archive");
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

	const handleIconSelect = (icon) => {
		setSelectedIcon(icon);
		setIconPickerVisible(false);
		
		createCategory(categoryName, selectedIcon, selectedColor, selectedExpenseGroup);
		navigation.goBack();
	};

	return (
		<View style={styles.container}>
			<StatusBar hidden={true} />
			<View style={styles.headingContainer}>
				<View style={styles.headingItems}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<AntDesign name="close" size={32} color={colors.BLACK} />
					</TouchableOpacity>
					<Text style={styles.heading}>New Category</Text>
					<TouchableOpacity onPress={handleCreationCategory}>
						<AntDesign name="check" size={32} color={colors.BLACK} />
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.cardContainer}>
				<Text style={styles.cardHeading}>Name</Text>
				<View style={styles.cardInput}>
					<TextInput
						style={{ flex: 1, fontSize: 24, color: colors.DARKGRAY }}
						placeholder="Required"
						onChangeText={setCategoryName}
						value={categoryName}
					/>
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

			<View style={styles.cardAppearanceContainer}>
				<Text style={styles.cardHeading}>Appearence</Text>
				<View style={styles.cardAppearanceInput}>
					<TouchableOpacity
						style={[styles.iconReview, { backgroundColor: selectedColor }]}
						onPress={() => setIconPickerVisible(true)}
					>
						<FontAwesome name={selectedIcon} size={32} color={colors.WHITE} />
					</TouchableOpacity>
					<Text style={styles.iconPickerText}>{selectedExpenseGroupName}</Text>

					<ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />

					<IconPicker
						iconPickerVisible={iconPickerVisible}
						icons={icons}
						handleIconSelect={handleIconSelect}
						onClose={() => setIconPickerVisible(false)}
					/>
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
	headingItems: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginHorizontal: "10%",
		marginVertical: "5%",
	},
	heading: {
		textAlign: "center",
		marginTop: "10%",
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

	cardAppearanceContainer: {
		height: "25%",
		backgroundColor: colors.WHITE,

		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1
	},
	cardAppearanceInput: {
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: "10%",
	},
	iconReview: {
		alignItems: "center",
		justifyContent: "center",
		width: 70,
		height: 70,
		borderRadius: 35,
	},
	pickerText: {
		flex: 1,
		fontSize: 24,
		color: colors.DARKGRAY,
	},
	iconPickerText: {
		marginTop: "2%",
		marginBottom: "3%",
		fontSize: 16,
		color: colors.DARKGRAY,
	},
});

export default AddCategory;
