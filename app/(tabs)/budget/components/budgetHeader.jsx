import React, { useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet, View, Text, TextInput, TouchableOpacity, Keyboard } from "react-native";
import { useMonthly } from "../../../../contexts/MonthlyContext";
import { useExpenseAreas } from "../../../../contexts/ExpenseAreasContext";
import colors from "../../../../constants/colors";
import { AntDesign } from "@expo/vector-icons";

import PieGraph from "./PieGraph";
import MonthlyBudgetSwiper from "../months/MonthlyBudgetSwiper";

const BudgetHeader = ({
	loading,
	currentMonth,
	expenseAreaName,
	setExpenseAreaName,
	expenseAreas,
	getExpenseAreas,
	expenses,
}) => {
	const { setCurrentMonth, createMonthlyBudget, budgetExists, setBudgetExists } = useMonthly();
	const { createExpenseArea } = useExpenseAreas();
	const inputRef = useRef(null);
	const [creating, setCreating] = useState(false);
	const [showCheckmark, setShowCheckmark] = useState(false);

	const handleCreateExpenseArea = async () => {
		if (!expenseAreaName.trim()) {
			alert("Area name can't be empty.");
			return;
		}
		await createExpenseArea(expenseAreaName);
		Keyboard.dismiss();
		setExpenseAreaName("");
		setShowCheckmark(false);
		getExpenseAreas();
	};

	const handleCreateMonthlyBudget = async () => {
		if (creating) return;

		setCreating(true);
		try {
			const budgetId = await createMonthlyBudget(currentMonth);
			if (budgetId) {
				setBudgetExists(true);
			}
		} catch (error) {
			console.error("Error handleCreateMonthlyBudget", error.message);
		} finally {
			getExpenseAreas();
			setCreating(false);
		}
	};

	return (
		<View style={styles.graphContainer}>
			<MonthlyBudgetSwiper currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />

			{budgetExists && expenseAreas === 0 && (
				<View style={styles.noExpenseAreas}>
					<Text style={styles.noExpenseAreasText}>Ingen udgiftsområder fundet for denne måned.</Text>
				</View>
			)}

			{expenseAreas.length > 0 && <PieGraph expenseAreas={expenseAreas || []} expenses={expenses || []} />}

			<>
				{!budgetExists ? (
					<View style={styles.createBudgetContainer}>
						<Text style={styles.createBudgetHeading}>Kom igang med det samme!</Text>
						<Text style={styles.createBudgetSubheading}>Sæt op et nyt månedligt budget</Text>
						<TouchableOpacity
							style={styles.createBudgetButton}
							onPress={() => handleCreateMonthlyBudget()}
							disabled={creating}
						>
							{creating ? (
								<ActivityIndicator size="small" color={colors.DARKGRAY} />
							) : (
								<Text style={styles.createBudgetBtnText}>Opret Budget</Text>
							)}
						</TouchableOpacity>
					</View>
				) : (
					<View style={styles.createExpenseAreaContainer}>
						<TextInput
							ref={inputRef}
							style={styles.createExpenseAreaInput}
							placeholder="Nyt udgiftsområde"
							onChangeText={setExpenseAreaName}
							value={expenseAreaName}
							onFocus={() => {
								setShowCheckmark(true);
							}}
						/>
						{showCheckmark && expenseAreaName.length > 0 && (
							<TouchableOpacity onPress={handleCreateExpenseArea} disabled={loading}>
								{loading ? (
									<ActivityIndicator size="small" style={{ marginVertical: "2%" }} color={colors.DARKGRAY} />
								) : (
									<AntDesign name="check" size={26} color={colors.BLACK} />
								)}
							</TouchableOpacity>
						)}
					</View>
				)}
			</>
		</View>
	);
};

const styles = StyleSheet.create({
	graphContainer: {
		flex: 1,
		marginTop: "10%",
	},
	createBudgetContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		marginTop: "35%",
	},
	createBudgetHeading: {
		fontSize: 18,
		color: colors.DARKGRAY,
	},
	createBudgetSubheading: {
		fontSize: 22,
		color: colors.DARKGRAY,
	},
	createBudgetButton: {
		alignItems: "center",
		justifyContent: "center",
		width: "50%",
		marginTop: "5%",
		padding: "5%",
		borderRadius: 99,
		backgroundColor: colors.SECONDARY,
	},
	createBudgetBtnText: {
		fontSize: 14,
		textTransform: "uppercase",
		fontWeight: "bold",
		color: colors.WHITE,
	},
	noExpenseAreas: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: "10%",
	},
	noExpenseAreasText: {
		fontSize: 16,
		color: colors.BLACK,
	},

	createExpenseAreaContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginHorizontal: "5%",
		marginTop: "5%",

		padding: 20,
		borderRadius: 15,
		backgroundColor: colors.WHITE,

		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1,
	},
	createExpenseAreaInput: {
		width: "90%",
		fontSize: 22,
		fontWeight: "bold",
		color: colors.DARKGRAY,
	},
});

export default BudgetHeader;
