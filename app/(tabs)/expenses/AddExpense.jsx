import React, { useState, useEffect } from "react";
import { StyleSheet, View, Modal, Text, TextInput, TouchableOpacity } from "react-native";
import { useUser } from "../../../context/UserContext";
import colors from "../../../utils/colors";
import NumericKeypad from "../../../components/modals/NumericKeypad";
import PickerWheel from "../../../components/modals/PickerWheel";
import IconPicker from "../../../components/modals/IconPicker";
import ColorPicker from "../../../components/colorPicker";

import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import ICONS from "../../../utils/icons";
import DarkPrimaryExecBtn from "../../../components/buttons/darkPrimaryExecBtn";

const AddExpense = ({ navigation, route }) => {
	const { loading, expenseAreas, createExpense } = useUser();

	const [keypadVisible, setKeypadVisible] = useState(false);
	const [maxBudget, setMaxBudget] = useState("");
	const [name, setName] = useState("");
	const [expenseAreaPickerVisible, setExpenseAreaPickerVisible] = useState(false);

	const { selectedExpenseArea: selectedExpenseArea } = route.params;
	const [selectedExpenseAreaId, setSelectedExpenseAreaId] = useState(selectedExpenseArea.id);
	const [selectedExpenseAreaName, setSelectedExpenseAreaName] = useState(selectedExpenseArea.name);
	const [iconPickerVisible, setIconPickerVisible] = useState(false);
	const [selectedIcon, setSelectedIcon] = useState("archive");
	const [selectedColor, setSelectedColor] = useState(colors.CATEGORY_COLOR_LIST[0]);

	useEffect(() => {
		if (selectedExpenseAreaId) {
			const area = expenseAreas.find((area) => area.id === selectedExpenseAreaId);
			setSelectedExpenseAreaName(area ? area.name : "Select an area");
		}
	}, [expenseAreas, selectedExpenseAreaId]);

	const prepareMaxBudgetForDB = (displayValue) => {
		let normalized = displayValue.replace(/\./g, "").replace(/,/g, ".");
		return parseFloat(normalized);
	};

	const handleExpenseArea = (areaValue) => {
		const expenseArea = expenseAreas.find((area) => area.id === Number(areaValue));

		if (expenseArea) {
			setSelectedExpenseAreaId(expenseArea.id);
			setSelectedExpenseAreaName(expenseArea.name);
		}
	};

	const handleIconSelect = (icon) => {
		setSelectedIcon(icon);
		setIconPickerVisible(false);
	};

	const handleCreateExpense = async () => {
		if (selectedExpenseAreaId && name) {
			let maxBudgetForDB = prepareMaxBudgetForDB(maxBudget);
			await createExpense(name, maxBudgetForDB, selectedIcon, selectedColor, selectedExpenseAreaId);

			navigation.goBack();
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.headingContainer}>
				<Text style={styles.heading}>Add Expense</Text>
			</View>

			{/* MAX BUDGET */}
			<View style={styles.maxBudgetContainer}>
				<TouchableOpacity onPress={() => setKeypadVisible(true)}>
					<Text style={styles.maxBudgetText}>
						{maxBudget || <Text style={styles.maxBudgetTextPlaceholder}>Enter a budget limit..</Text>}
					</Text>
				</TouchableOpacity>
				<NumericKeypad
					keypadVisible={keypadVisible}
					amount={maxBudget}
					setAmount={setMaxBudget}
					onClose={() => setKeypadVisible(false)}
				/>
			</View>
			{/* END */}

			{/* NAME EXPENSE */}
			<View style={styles.nameExpenseContainer}>
				<Text style={styles.nameExpenseHeading}>Name</Text>
				<View style={styles.nameExpenseInput}>
					<TextInput
						style={styles.nameExpenseInputText}
						placeholder="Required"
						onChangeText={(text) => {
							if (text.length <= 35) {
								setName(text);
							} else {
								alert("Name cannot be longer than 35 characters.");
							}
						}}
						value={name}
					/>
					<MaterialIcons name="edit" size={24} color={colors.GRAY} />
				</View>
			</View>
			{/* END */}

			{/* EXPENSE AREA */}
			<View style={styles.expenseAreaContainer}>
				<Text style={styles.expenseAreaHeading}>Expense area</Text>
				<TouchableOpacity
					style={styles.expenseAreaInput}
					onPress={() => setExpenseAreaPickerVisible(!expenseAreaPickerVisible)}
				>
					<Text style={styles.expenseAreaInputText}>{selectedExpenseAreaName || "Select an area"}</Text>
				</TouchableOpacity>
				<PickerWheel
					pickerVisible={expenseAreaPickerVisible}
					items={expenseAreas}
					selectedValue={selectedExpenseAreaId}
					onValueChange={handleExpenseArea}
					onClose={() => setExpenseAreaPickerVisible(false)}
				/>
			</View>
			{/* END */}

			{/* APPEARANCE */}
			<View style={styles.appearanceContainer}>
				<Text style={styles.appearanceHeading}>Appearence</Text>
				<View style={styles.appearanceInput}>
					<TouchableOpacity
						style={[styles.iconPickerPreview, { backgroundColor: selectedColor }]}
						onPress={() => setIconPickerVisible(true)}
					>
						<FontAwesome name={selectedIcon} size={22} color={colors.WHITE} />
					</TouchableOpacity>
					<Text style={styles.appearanceText}>{name}</Text>

					<IconPicker
						iconPickerVisible={iconPickerVisible}
						icons={ICONS}
						handleIconSelect={handleIconSelect}
						onClose={() => setIconPickerVisible(false)}
					/>
				</View>
				<View style={styles.colorPickerContainer}>
					<ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} height={35} width={35} />
				</View>
			</View>
			{/* END */}

			<View style={styles.addExpenseBtn}>
				{!keypadVisible && <DarkPrimaryExecBtn btnText={"Add"} execFunction={handleCreateExpense} />}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.WHITE,
	},
	headingContainer: {
		marginTop: "5%",
	},
	heading: {
		textAlign: "center",
		fontSize: 16,
		textTransform: "uppercase",
		color: colors.DARKGRAY,
	},
	maxBudgetContainer: {
		alignItems: "center",
		justifyContent: "center",
		height: "15%",

		borderBottomWidth: 1,
		borderBottomColor: colors.GRAY,
	},
	maxBudgetText: {
		fontSize: 52,
		color: colors.BLACK,
	},
	maxBudgetTextPlaceholder: {
		fontSize: 26,
		color: colors.DARKGRAY,
	},
	nameExpenseContainer: {
		height: "12%",
		backgroundColor: colors.WHITE,
		borderBottomWidth: 1,
		borderBottomColor: colors.GRAY,
	},
	nameExpenseHeading: {
		marginTop: "7%",
		marginLeft: "7%",
		fontSize: 12,
		color: colors.DARKGRAY,
		textTransform: "uppercase",
	},
	nameExpenseInput: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: "1%",
		marginHorizontal: "7%",
	},
	nameExpenseInputText: {
		flex: 1,
		fontSize: 22,
		color: colors.BLACK,
	},

	expenseAreaContainer: {
		height: "12%",
		backgroundColor: colors.WHITE,
		borderBottomWidth: 1,
		borderBottomColor: colors.GRAY,
	},
	expenseAreaHeading: {
		marginTop: "7%",
		marginLeft: "7%",
		fontSize: 12,
		color: colors.DARKGRAY,
		textTransform: "uppercase",
	},
	expenseAreaInput: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: "1%",
		marginHorizontal: "7%",
	},
	expenseAreaInputText: {
		flex: 1,
		fontSize: 22,
		color: colors.BLACK,
	},

	appearanceContainer: {
		height: "20%",
		backgroundColor: colors.WHITE,
		borderBottomWidth: 1,
		borderBottomColor: colors.GRAY,
	},
	appearanceHeading: {
		marginTop: "7%",
		marginLeft: "7%",
		fontSize: 12,
		color: colors.DARKGRAY,
		textTransform: "uppercase",
	},
	appearanceInput: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: "1%",
		marginHorizontal: "7%",
	},
	appearanceText: {
		flex: 1,
		fontSize: 16,
		color: colors.BLACK,
		textDecorationLine: "underline",
	},
	iconPickerPreview: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: "3%",
		marginRight: "3%",
		width: 50,
		height: 50,
		borderRadius: 37.5,
	},
	colorPickerContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	addExpenseBtn: {
		marginTop: "25%",
		marginHorizontal: "5%",

		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 1,
	},
});

export default AddExpense;
