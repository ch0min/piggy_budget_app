import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";
import { useMonthly } from "./MonthlyContext";

const ExpenseAreasContext = createContext();

export const ExpenseAreasProvider = ({ children }) => {
	const { user } = useAuth();
	const {
		currentMonth,
		getMonthlyBudgetId,
		updateMonthlySpent,
		updateMonthlyBudget,
		setBudgetExists,
		getMonthlyBudgetLineChart,
		updatePiggyBankSavings,
	} = useMonthly();

	const [loading, setLoading] = useState(false);
	const [refresh, setRefresh] = useState(false);

	/*** EXPENSE AREAS FUNCTIONALITY ***/
	const [expenseAreas, setExpenseAreas] = useState([]);

	const getExpenseAreas = async () => {
		setLoading(true);
		const userId = user?.id;
		const month = currentMonth.getMonth() + 1;
		const year = currentMonth.getFullYear();

		try {
			const { data: budgetData, error: budgetError } = await supabase
				.from("monthly_budgets")
				.select("id")
				.eq("user_id", userId)
				.eq("month", month)
				.eq("year", year)
				.maybeSingle();

			if (budgetError) {
				console.error("Error getExpenseAreas:", budgetError.message);
				setBudgetExists(false);
			}

			if (budgetData) {
				setBudgetExists(true);
				const { data: areasData, error: areasError } = await supabase
					.from("expense_areas")
					.select("*")
					.eq("monthly_budgets_id", budgetData.id)
					.order("id", { ascending: true });

				if (areasError) throw areasError;
				setExpenseAreas(areasData || []);
			} else {
				setExpenseAreas([]);
				setBudgetExists(false);
			}
		} catch (error) {
			console.error("Error getExpenseAreas:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const createExpenseArea = async (name) => {
		setLoading(true);
		const userId = user?.id;

		try {
			const monthlyBudgetId = await getMonthlyBudgetId();

			if (!monthlyBudgetId) {
				console.error("Failed to obtain a monthly budget ID.");
				throw new Error("Failed to obtain a monthly budget ID for a user.");
			}

			const { data, error } = await supabase.from("expense_areas").insert([
				{
					name: name,
					created_at: new Date(),
					monthly_budgets_id: monthlyBudgetId,
					user_id: userId,
				},
			]);
			if (error) throw error;

			getExpenseAreas();
		} catch (error) {
			console.error("Error createExpenseArea", error.message);
		} finally {
			setLoading(false);
		}
	};

	const updateExpenseArea = async (id, name) => {
		setLoading(true);
		try {
			const { data, error } = await supabase.from("expense_areas").update({ name }).match({ id });
			if (error) throw error;

			getExpenseAreas();
			setLoading(false);
			return data;
		} catch (error) {
			console.error("Error updateExpenseArea", error.message);
			setLoading(false);
			throw error;
		}
	};

	const deleteExpenseArea = async (areaId) => {
		setLoading(true);
		try {
			// Fetch the expense area to get the monthly budget ID
			const { data: area, error: fetchError } = await supabase
				.from("expense_areas")
				.select("monthly_budgets_id")
				.eq("id", areaId)
				.single();

			if (fetchError) throw fetchError;

			const { error: deleteError } = await supabase.from("expense_areas").delete().match({ id: areaId });
			if (deleteError) throw deleteError;

			// Update the monthly budget after removing the expense area
			await updateMonthlyBudget(area.monthly_budgets_id);
			await updateMonthlySpent(area.monthly_budgets_id);
			await getMonthlyBudgetLineChart();
			await updatePiggyBankSavings();
		} catch (error) {
			console.error("Error deleteExpenseArea:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const updateTotalBudgetForArea = async (expenseAreaId) => {
		setLoading(true);
		try {
			// Fetching all expenses for the given expense area:
			const { data: expenseData, error: expenseError } = await supabase
				.from("expenses")
				.select("total_budget_expense")
				.eq("expense_areas_id", expenseAreaId);

			if (expenseError) throw expenseError;

			// Calculate the total budget by summing all total_spent values:
			const totalBudgetArea = expenseData.reduce((acc, exp) => acc + parseFloat(exp.total_budget_expense || 0), 0);

			// Update the total_budget in the expense_areas table:
			const { error: updateError } = await supabase
				.from("expense_areas")
				.update({ total_budget_area: totalBudgetArea })
				.eq("id", expenseAreaId);

			if (updateError) throw updateError;

			getExpenseAreas();
		} catch (error) {
			console.error("Failed to update total budget for an expense area:", error.message);
		} finally {
			setLoading(false);
		}
	};

	/*** END ***/

	return (
		<ExpenseAreasContext.Provider
			value={{
				loading,
				refresh,
				setRefresh,

				// Expense Areas States
				expenseAreas,
				// Expense Areas Functions
				getExpenseAreas,
				createExpenseArea,
				updateExpenseArea,
				deleteExpenseArea,
				updateTotalBudgetForArea,
			}}
		>
			{children}
		</ExpenseAreasContext.Provider>
	);
};

export const useExpenseAreas = () => useContext(ExpenseAreasContext);
