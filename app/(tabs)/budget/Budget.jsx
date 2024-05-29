import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {  StyleSheet, View } from "react-native";
import { useMonthly } from "../../../contexts/MonthlyContext";
import { useExpenseAreas } from "../../../contexts/ExpenseAreasContext";
import { useExpenses } from "../../../contexts/ExpensesContext";
import colors from "../../../constants/colors";
import BudgetExpenseAreasList from "./components/budgetExpenseAreasList";

const Budget = ({ navigation }) => {
	const { loading, setLoading, loadingData, setLoadingData, refresh, setRefresh, currentMonth, getMonthlyBudget } =
		useMonthly();
	const { expenseAreas, getExpenseAreas, updateExpenseArea, deleteExpenseArea } = useExpenseAreas();
	const { expenses, getExpenses } = useExpenses();

	const [expenseAreaName, setExpenseAreaName] = useState("");
	const [editableExpenseAreas, setEditableExpenseAreas] = useState([]);
	const [editableId, setEditableId] = useState(null);

	useFocusEffect(
		useCallback(() => {
			setLoading(true);
			setLoadingData(true);
			getExpenseAreas().finally(() => setLoadingData(false));
			getExpenses();
			getMonthlyBudget();
		}, [currentMonth])
	);

	useEffect(() => {
		setEditableExpenseAreas(expenseAreas.map((area) => ({ ...area, editableName: area.name })));
	}, [expenseAreas]);

	const onRefresh = useCallback(async () => {
		try {
			setRefresh(true);
			await getExpenseAreas().finally(() => setRefresh(false));
			await getExpenses();
		} catch (error) {
			console.error("Failed to refresh data.");
		}
	}, [getExpenseAreas, getExpenses]);

	const handleUpdateExpenseAreaName = (id, newName) => {
		setLoading(true);

		const updatedAreas = editableExpenseAreas.map((area) => {
			if (area.id === id) {
				return { ...area, editableName: newName };
			}
			return area;
		});
		setLoading(false);

		setEditableExpenseAreas(updatedAreas);
	};

	const saveUpdatedExpenseArea = async (id) => {
		const area = editableExpenseAreas.find((area) => area.id === id);
		if (area) {
			await updateExpenseArea(id, area.editableName);
			setEditableId(null);
			getExpenseAreas();
		}
	};

	const handleDeleteExpenseArea = async (id) => {
		try {
			await deleteExpenseArea(id);
			getExpenseAreas();
		} catch (error) {
			console.error("handleDeleteExpenseArea error", error);
		}
	};

	const handleExpense = (exp) => {
		navigation.navigate("Expenses", { selectedExpense: exp });
	};

	const handleAddExpense = (area) => {
		navigation.navigate("AddExpense", { selectedExpenseArea: area });
	};

	return (
		<View style={styles.container}>
			{/* { ? ( */}
			{/* <ActivityIndicator size="large" style={{ marginVertical: "50%" }} color={colors.DARKGRAY} /> */}
			<BudgetExpenseAreasList
				loading={loading}
				refresh={refresh}
				onRefresh={onRefresh}
				editableId={editableId}
				setEditableId={setEditableId}
				currentMonth={currentMonth}
				expenseAreaName={expenseAreaName}
				setExpenseAreaName={setExpenseAreaName}
				expenseAreas={expenseAreas}
				getExpenseAreas={getExpenseAreas}
				handleUpdateExpenseAreaName={handleUpdateExpenseAreaName}
				handleDeleteExpenseArea={handleDeleteExpenseArea}
				saveUpdatedExpenseArea={saveUpdatedExpenseArea}
				editableExpenseAreas={editableExpenseAreas}
				expenses={expenses}
				handleExpense={handleExpense}
				handleAddExpense={handleAddExpense}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	// Expenses
	expensesContainer: {
		flex: 1,

		borderBottomWidth: 0.5,
		borderBottomColor: colors.LIGHT,
	},
	expensesSubContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		marginHorizontal: "1.5%",
		padding: "1%",
	},
	expensesTextContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	expensesName: {
		flexShrink: 1,
		fontSize: 16,
	},
	expensesBudgetNameBox: {
		flexDirection: "row",
		marginVertical: "2%",
		padding: "3%",
		borderRadius: 5,
		backgroundColor: "#F4F4F4",
	},
	expensesTotalSpent: {
		flexShrink: 1,
		fontSize: 14,
		fontWeight: "bold",
		color: colors.RED,
	},
	expensesTotalBudgetExpenseName: {
		flexShrink: 1,
		fontSize: 16,
	},
	expensesIcon: {
		alignItems: "center",
		justifyContent: "center",
		marginRight: "3%",
		width: 30,
		height: 30,
		borderRadius: 37.5,
	},
});

export default Budget;
