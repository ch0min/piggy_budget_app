import React, { useState, useEffect } from "react";
import { StyleSheet, View, StatusBar, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useUser } from "../../../context/UserContext";
import colors from "../../../utils/colors";
import { Picker } from "@react-native-picker/picker";
import ColorPicker from "../../../utils/colorPicker";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

const AddCategory = () => {
	const { loading, session, mainCategoryList, getMainCategoryList, createCategory } = useUser();
	const [categoryName, setCategoryName] = useState("");
	const [selectedIcon, setSelectedIcon] = useState("");
	const [selectedColor, setSelectedColor] = useState(colors.CATEGORY_COLOR_LIST[0]);

	const [selectedMainCategory, setSelectedMainCategory] = useState("");
	// const [currentDisplayedMainCategory, setCurrentDisplayedMainCategory] = useState("");
	const [pickerVisible, setPickerVisible] = useState(false);

	useEffect(() => {
		getMainCategoryList();
		console.log("Fetching main category list..");
	}, []);

	useEffect(() => {
		if (mainCategoryList.length > 0) {
			const defaultMainCategory = mainCategoryList.find((cat) => cat.id === 0) || mainCategoryList[0];
			console.log(`Defaulting to first category in list: ${defaultMainCategory.id}-${defaultMainCategory.name}`);
			setSelectedMainCategory(defaultMainCategory.id);
		}
	}, [mainCategoryList]);

	const handleValueChange = (itemValue) => {
		console.log(`Picker scrolled to: ${itemValue}`);
		setSelectedMainCategory(itemValue);
	};

	const handleConfirmSelection = () => {
		// setSelectedMainCategory(selectedMainCategory);
		setPickerVisible(false);
		console.log(`Category selected: ${selectedMainCategory}`);
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
					<Text style={styles.pickerText}>
						{mainCategoryList.find((cat) => cat.id === selectedMainCategory)?.name}
					</Text>
				</TouchableOpacity>
				{pickerVisible && (
					<View style={styles.pickerContainer}>
						<Picker style={styles.picker} selectedValue={selectedMainCategory} onValueChange={handleValueChange}>
							{mainCategoryList.map((category) => (
								<Picker.Item key={category.id} label={category.name} value={category.id} />
							))}
						</Picker>
						<TouchableOpacity style={styles.closePickerIcon} onPress={handleConfirmSelection}>
							<AntDesign name="check" size={24} color="black" />
						</TouchableOpacity>
					</View>
				)}
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
	pickerContainer: {
		backgroundColor: colors.WHITE,
	},
	picker: {
		width: "100%",
	},
	pickerText: {
		flex: 1,
		fontSize: 24,
		color: colors.DARKGRAY,
	},
	closePickerIcon: {
		alignItems: "flex-end",
		marginRight: "10%",
		marginBottom: "5%",
	},
});

export default AddCategory;
