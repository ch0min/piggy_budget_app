import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import { useAuth } from "../../../../contexts/AuthContext";
import colors from "../../../../constants/colors";
import { FontAwesome } from "@expo/vector-icons";
import FormatNumber from "../../../../utils/formatNumber";
import ProgressBarMini from "./ProgressBarMini";

const ExpensesList = ({ item, expenses, handleExpense }) => {
	const { userProfile } = useAuth();
	
	const renderExpenses = ({ item }) => (
		<TouchableOpacity style={styles.expensesContainer} onPress={() => handleExpense(item)}>
			<View style={styles.expensesSubContainer}>
				<View style={[styles.expensesIcon, { backgroundColor: item.color }]}>
					<FontAwesome name={item.icon} size={14} color={colors.WHITE} />
				</View>

				<View style={styles.expensesTextContainer}>
					<Text style={styles.expensesName}>{item.name}</Text>
					<View style={styles.expensesBudgetNameBox}>
						<Text style={styles.expensesTotalSpent}>
							-{FormatNumber(item.total_spent_expense)} {userProfile.valuta.name}
						</Text>
					</View>
				</View>
			</View>
			<ProgressBarMini totalSpentExpense={item.total_spent_expense} totalBudgetExpense={item.total_budget_expense} />
		</TouchableOpacity>
	);

	return (
		<FlatList
			data={expenses.filter((exp) => exp.expense_areas_id === item.id)}
			renderItem={renderExpenses}
			keyExtractor={(exp) => `${exp.id}`}
			ListEmptyComponent={
				<Text style={{ marginTop: "5%", marginLeft: "4%" }}>Ingen udgifter fundet for dette område.</Text>
			}
		/>
	);
};

const styles = StyleSheet.create({
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

export default ExpensesList;
