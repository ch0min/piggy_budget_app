import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";
import { useMonthly } from "./MonthlyContext";
import { useExpenseAreas } from "./ExpenseAreasContext";
import { useExpenses } from "./ExpensesContext";

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
	const { user } = useAuth();
	const { updateMonthlySpent, updateMonthlyBudget, getMonthlyBudgetLineChart, updatePiggyBankSavings } = useMonthly();
	const { updateTotalBudgetForArea } = useExpenseAreas();
	const { updateExpenseTotalSpent } = useExpenses();

	const [loading, setLoading] = useState(true);
	const [refresh, setRefresh] = useState(false);

	/*** TRANSACTIONS FUNCTIONS ***/
	const [transactions, setTransactions] = useState([]);

	const getTransactions = async () => {
		setLoading(true);
		const userId = user?.id;

		try {
			const { data, error } = await supabase
				.from("transactions")
				.select(`*`)
				.eq("user_id", userId)
				.order("id", { ascending: true });

			if (error) throw error;

			setTransactions(data);
		} catch (error) {
			console.error("Error fetching transactions:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const createTransaction = async (name, amount, note, expensesId) => {
		setLoading(true);
		const userId = user?.id;

		try {
			const { data: transactionData, error: transactionError } = await supabase
				.from("transactions")
				.insert([
					{
						created_at: new Date(),
						name: name,
						amount: amount,
						note: note,
						expenses_id: expensesId,
						user_id: userId,
					},
				])
				.single();

			if (transactionError) throw transactionError;

			await updateExpenseTotalSpent(expensesId);
			await triggerCreateUpdates(expensesId);
			await updatePiggyBankSavings();
		} catch (error) {
			console.error("Error creating transaction:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const triggerCreateUpdates = async (expensesId) => {
		const { data: expenseData } = await supabase
			.from("expenses")
			.select("expense_areas_id")
			.eq("id", expensesId)
			.single();
		await updateTotalBudgetForArea(expenseData.expense_areas_id);

		const { data: areaData } = await supabase
			.from("expense_areas")
			.select("monthly_budgets_id")
			.eq("id", expenseData.expense_areas_id)
			.single();
		await updateMonthlySpent(areaData.monthly_budgets_id);
		await updateMonthlyBudget(areaData.monthly_budgets_id);
	};

	const updateTransaction = async (id, name, amount, note, expensesId) => {
		setLoading(true);

		try {
			const { data: transactionData, error: transactionError } = await supabase
				.from("transactions")
				.update({ name, amount, note })
				.match({ id });

			if (transactionError) throw transactionError;

			// Ensuring that the expense total spent is updated before moving on:
			await updateExpenseTotalSpent(expensesId);
			const { data: expenseData, error: expenseError } = await supabase
				.from("expenses")
				.select("expense_areas_id")
				.eq("id", expensesId)
				.single();

			if (expenseError) throw expenseError;

			// Update the total budgets and spent after confirming expense total spent is updated:
			if (expenseData && expenseData.expense_areas_id) {
				await updateTotalBudgetForArea(expenseData.expense_areas_id);
				const { data: areaData, error: areaError } = await supabase
					.from("expense_areas")
					.select("monthly_budgets_id")
					.eq("id", expenseData.expense_areas_id)
					.single();

				if (areaError) throw areaError;

				if (areaData && areaData.monthly_budgets_id) {
					await updateMonthlySpent(areaData.monthly_budgets_id);
					await updateMonthlyBudget(areaData.monthly_budgets_id);
				}
			}
			await updatePiggyBankSavings();
		} catch (error) {
			console.error("Error creating transaction:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const deleteTransaction = async (id) => {
		setLoading(true);
		try {
			const { data: transactionData, error: transactionError } = await supabase
				.from("transactions")
				.select("expenses_id")
				.eq("id", id)
				.single();

			if (transactionError) throw transactionError;

			const { error: deleteError } = await supabase.from("transactions").delete().match({ id });
			if (deleteError) throw deleteError;

			await updateExpenseTotalSpent(transactionData.expenses_id);

			// Fetch expense to update its expense area:
			const { data: expenseData, error: expenseError } = await supabase
				.from("expenses")
				.select("expense_areas_id")
				.eq("id", transactionData.expenses_id)
				.single();

			if (expenseError) throw expenseError;

			// Fetching the monthly_budgets_id from expense areas:
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

			await updateTotalBudgetForArea(expenseData.expense_areas_id);
			await getMonthlyBudgetLineChart();
			await updatePiggyBankSavings();
		} catch (error) {
			console.error("Error deleting transaction", error.message);
		} finally {
			setLoading(false);
		}
	};
	/*** END ***/

	return (
		<TransactionsContext.Provider
			value={{
				loading,
				setLoading,
				refresh,
				setRefresh,

				// Transactions States
				transactions,
				// Transactions Functions
				getTransactions,
				createTransaction,
				updateTransaction,
				deleteTransaction,
			}}
		>
			{children}
		</TransactionsContext.Provider>
	);
};

export const useTransactions = () => useContext(TransactionsContext);
