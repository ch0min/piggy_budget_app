import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import { useMonthly } from "../../../contexts/MonthlyContext";
import { useExpenseAreas } from "../../../contexts/ExpenseAreasContext";
import { useExpenses } from "../../../contexts/ExpensesContext";

import colors from "../../../constants/colors";
import NumericKeypad from "../../../components/modals/NumericKeypad";
import PickerWheel from "../../../components/modals/PickerWheel";
import IconPicker from "../../../components/modals/IconPicker";
import ColorPicker from "../../../components/colorPicker";

import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import ICONS from "../../../constants/icons";
import DarkPrimaryExecBtn from "../../../components/buttons/darkPrimaryExecBtn";

const AddExpense = ({ navigation, route }) => {
	const { userProfile } = useAuth();
	const { expenseAreas } = useExpenseAreas();
	const { loading, setLoading, createExpense } = useExpenses();
	// const [creating, setCreating] = useState(false);

	const [keypadVisible, setKeypadVisible] = useState(false);
	const [totalBudgetExpense, setTotalBudgetExpense] = useState("");
	const [name, setName] = useState("");
	const [expenseAreaPickerVisible, setExpenseAreaPickerVisible] = useState(false);

	const { selectedExpenseArea: selectedExpenseArea } = route.params;
	const [selectedExpenseAreaId, setSelectedExpenseAreaId] = useState(selectedExpenseArea.id);
	const [selectedExpenseAreaName, setSelectedExpenseAreaName] = useState(selectedExpenseArea.name);
	const [iconPickerVisible, setIconPickerVisible] = useState(false);
	const [selectedIcon, setSelectedIcon] = useState("archive");
	const [selectedColor, setSelectedColor] = useState(colors.COLOR_LIST[0]);

	useEffect(() => {
		if (selectedExpenseAreaId) {
			const area = expenseAreas.find((area) => area.id === selectedExpenseAreaId);
			setSelectedExpenseAreaName(area ? area.name : "Select an area");
		}
	}, [expenseAreas, selectedExpenseAreaId]);

	const prepareTotalBudgetExpenseForDB = (displayValue) => {
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
			setLoading(true);

			try {
				let totalBudgetExpenseForDB = prepareTotalBudgetExpenseForDB(totalBudgetExpense);
				await createExpense(name, totalBudgetExpenseForDB, selectedIcon, selectedColor, selectedExpenseAreaId);

				navigation.goBack();
			} catch (error) {
				console.error("Failed to create expense:", error);
			}
			setLoading(false);
		}
	};

	const isFormComplete = () => {
		if (totalBudgetExpense !== "" && name !== "" && selectedExpenseAreaId !== "") {
			console.log("Korrekt ");
		} else {
			alert("Venligst udfyld alle felter.");
		}
	};

	return (
		<View style={styles.container}>
			{loading ? (
				<View style={styles.overlayCreatingActivityIndicator}>
					<ActivityIndicator size="large" style={{ marginVertical: "75%" }} color={colors.DARKGRAY} />
				</View>
			) : (
				<>
					<View style={styles.headingContainer}>
						<Text style={styles.heading}>Tilføj en udgift</Text>
					</View>

					{/* MAX BUDGET */}
					<View style={styles.totalBudgetExpenseContainer}>
						<TouchableOpacity onPress={() => setKeypadVisible(true)}>
							{totalBudgetExpense ? (
								<Text style={styles.totalBudgetExpenseText}>
									{totalBudgetExpense} {userProfile.valutaName}
								</Text>
							) : (
								<Text style={styles.totalBudgetExpenseTextPlaceholder}>Indtast en budget grænse..</Text>
							)}
						</TouchableOpacity>
						<NumericKeypad
							keypadVisible={keypadVisible}
							amount={totalBudgetExpense}
							setAmount={setTotalBudgetExpense}
							onClose={() => setKeypadVisible(false)}
						/>
					</View>
					{/* END */}

					{/* NAME EXPENSE */}
					<View style={styles.nameExpenseContainer}>
						<Text style={styles.nameExpenseHeading}>Navn</Text>
						<View style={styles.nameExpenseInput}>
							<TextInput
								style={styles.nameExpenseInputText}
								placeholder="Påkrævet"
								onChangeText={(text) => {
									if (text.length <= 35) {
										setName(text);
									} else {
										alert("Navn kan ikke være længere end 35 tegn.");
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
						<Text style={styles.expenseAreaHeading}>Udgiftsområde</Text>
						<TouchableOpacity
							style={styles.expenseAreaInput}
							onPress={() => setExpenseAreaPickerVisible(!expenseAreaPickerVisible)}
							disabled={loading}
						>
							<Text style={styles.expenseAreaInputText}>{selectedExpenseAreaName || "Vælg et område"}</Text>
						</TouchableOpacity>
						<PickerWheel
							pickerVisible={expenseAreaPickerVisible}
							items={expenseAreas}
							selectedValue={selectedExpenseAreaId}
							onValueChange={handleExpenseArea}
							onClose={() => setExpenseAreaPickerVisible(false)}
							loading={loading}
						/>
					</View>
					{/* END */}

					{/* APPEARANCE */}
					<View style={styles.appearanceContainer}>
						<Text style={styles.appearanceHeading}>Udseende</Text>
						<View style={styles.appearanceInput}>
							<TouchableOpacity
								style={[styles.iconPickerPreview, { backgroundColor: selectedColor }]}
								onPress={() => setIconPickerVisible(true)}
								disabled={loading}
							>
								<FontAwesome name={selectedIcon} size={22} color={colors.WHITE} />
							</TouchableOpacity>
							<Text style={styles.appearanceText}>{name}</Text>

							<IconPicker
								iconPickerVisible={iconPickerVisible}
								icons={ICONS}
								handleIconSelect={handleIconSelect}
								onClose={() => setIconPickerVisible(false)}
								loading={loading}
							/>
						</View>
						<View style={styles.colorPickerContainer}>
							<ColorPicker
								selectedColor={selectedColor}
								setSelectedColor={setSelectedColor}
								height={35}
								width={35}
								loading={loading}
							/>
						</View>
					</View>
					{/* END */}

					<View style={styles.addExpenseBtn}>
						{!keypadVisible && totalBudgetExpense !== "" && name !== "" && selectedExpenseAreaId !== "" && (
							<DarkPrimaryExecBtn loading={loading} btnText={"Tilføj"} execFunction={handleCreateExpense} />
						)}
					</View>
				</>
			)}
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
	totalBudgetExpenseContainer: {
		alignItems: "center",
		justifyContent: "center",
		height: "15%",

		borderBottomWidth: 1,
		borderBottomColor: colors.GRAY,
	},
	totalBudgetExpenseText: {
		fontSize: 52,
		color: colors.BLACK,
	},
	totalBudgetExpenseTextPlaceholder: {
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
