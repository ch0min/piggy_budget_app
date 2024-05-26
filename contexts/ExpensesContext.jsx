import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";
import { useMonthly } from "./MonthlyContext";

const ExpensesContext = createContext();

export const ExpensesProvider = ({ children }) => {
	const { user } = useAuth();
	const { updateMonthlySpent, updateMonthlyBudget, getMonthlyBudgetLineChart } = useMonthly();

	const [loading, setLoading] = useState(true);
	const [refresh, setRefresh] = useState(false);

	/*** EXPENSES FUNCTIONS ***/
	const [expenses, setExpenses] = useState([]);

	const getExpenses = async () => {
		setLoading(true);
		try {
			const userId = user?.id;
			const { data, error } = await supabase
				.from("expenses")
				.select(`*`)
				.eq("user_id", userId)
				.order("id", { ascending: true });
			if (error) throw error;

			setExpenses(data);
			// console.log("Expense fetched:", data);
		} catch (error) {
			console.error("Error fetching expenses for user:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const getLatestExpenses = async () => {
		setLoading(true);
		const userId = user?.id;

		try {
			const { data, error } = await supabase
				.from("expenses")
				.select(`*`)
				.eq("user_id", userId)
				.order("id", { ascending: false })
				.limit(5);

			if (error) throw error;

			setExpenses(data);
		} catch (error) {
			console.error("Error fetching expenses:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const createExpense = async (name, totalBudgetExpense, icon, color, expenseAreasId) => {
		setLoading(true);
		const userId = user?.id;

		try {
			const { data: expenseData, error: expenseError } = await supabase
				.from("expenses")
				.insert([
					{
						created_at: new Date(),
						name: name,
						total_spent_expense: 0,
						total_budget_expense: totalBudgetExpense,
						icon: icon,
						color: color,
						expense_areas_id: expenseAreasId,
						user_id: userId,
					},
				])
				.single();

			if (expenseError) throw expenseError;

			await updateTotalBudgetForArea(expenseAreasId);

			// Fetch the monthly budget id from the expense area:
			const { data: areaData, error: areaError } = await supabase
				.from("expense_areas")
				.select("monthly_budgets_id")
				.eq("id", expenseAreasId)
				.single();

			if (areaError) throw areaError;

			// Update the total budget for the monthly budget id found:
			if (areaData && areaData.monthly_budgets_id) {
				await updateMonthlySpent(areaData.monthly_budgets_id);
				await updateMonthlyBudget(areaData.monthly_budgets_id);
			}
		} catch (error) {
			console.error("Error creating expense", error.message);
		} finally {
			setLoading(false);
		}
	};

	const updateExpense = async (id, name, totalBudgetExpense, icon, color) => {
		setLoading(true);
		try {
			// First fetch the current expense to ensure it exists and to get the correct expense_area_id:
			const { data: currentExpense, error: currentExpenseError } = await supabase
				.from("expenses")
				.select("expense_areas_id")
				.eq("id", id)
				.single();

			if (currentExpenseError) {
				console.error("Failed to fetch current expense:", currentExpenseError);
				throw currentExpenseError;
			}

			const expenseAreaId = currentExpense.expense_areas_id;

			// Update the expense with new values:
			const { data: updatedExpense, error: updateError } = await supabase
				.from("expenses")
				.update({ name, total_budget_expense: totalBudgetExpense, icon, color })
				.eq("id", id);

			if (updateError) {
				console.error("Failed to update current expense:", updateError);
				throw updateError;
			}

			await updateExpenseTotalSpent(id);
			await updateTotalBudgetForArea(expenseAreaId);

			const { data: areaData, error: areaError } = await supabase
				.from("expense_areas")
				.select("monthly_budgets_id")
				.eq("id", expenseAreaId)
				.single();

			if (areaError) throw areaError;

			if (areaData && areaData.monthly_budgets_id) {
				await updateMonthlyBudget(areaData.monthly_budgets_id);
			}

			console.log("Expense updated successfully", updatedExpense);
		} catch (error) {
			console.error("Error updating expense:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const deleteExpense = async (id) => {
		setLoading(true);
		try {
			// Fetch the expense to get expense area id and determine monthly budget id:
			const { data: expenseData, error: expenseError } = await supabase
				.from("expenses")
				.select("expense_areas_id")
				.eq("id", id)
				.single();

			if (expenseError) throw expenseError;

			const { error: deleteError } = await supabase.from("expenses").delete().match({ id });
			if (deleteError) throw deleteError;

			if (expenseData && expenseData.expense_areas_id) {
				await updateTotalBudgetForArea(expenseData.expense_areas_id);

				// Fetch the expense area to get the monthly budget id:
				const { data: areaData, error: areaError } = await supabase
					.from("expense_areas")
					.select("monthly_budgets_id")
					.eq("id", expenseData.expense_areas_id)
					.single();

				if (areaError) throw areaError;

				if (areaData && areaData.monthly_budgets_id) {
					await updateMonthlyBudget(areaData.monthly_budgets_id);
					await updateMonthlySpent(areaData.monthly_budgets_id);
				}
				await getMonthlyBudgetLineChart();
			}
		} catch (error) {
			console.error("Error deleting expense:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const updateExpenseTotalSpent = async (expenseId) => {
		setLoading(true);
		try {
			const { data: transactionData, error: transactionError } = await supabase
				.from("transactions")
				.select("amount")
				.eq("expenses_id", expenseId);

			if (transactionError) {
				console.error("Error fetching transactions:", transactionError.message);
				throw transactionError;
			}

			const totalSpentExpense = transactionData.reduce((acc, { amount }) => acc + parseFloat(amount || 0), 0);

			const { data: updateData, error: updateError } = await supabase
				.from("expenses")
				.update({ total_spent_expense: totalSpentExpense })
				.eq("id", expenseId);

			if (updateError) {
				console.error("Error updating total spent expense:", updateError.message);
				throw updateError;
			}
		} catch (error) {
			console.error("Failed to update expense total spent:", error.message);
		} finally {
			setLoading(false);
		}
	};
	/*** END ***/

	return (
		<ExpensesContext.Provider
			value={{
				loading,
				refresh,
				setRefresh,

				// Expenses States
				expenses,
				// Expenses Functions
				getExpenses,
				getLatestExpenses,
				createExpense,
				updateExpense,
				deleteExpense,
				updateExpenseTotalSpent,
			}}
		>
			{children}
		</ExpensesContext.Provider>
	);
};

export const useExpenses = () => useContext(ExpensesContext);
