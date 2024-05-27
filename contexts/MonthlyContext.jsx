import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";
import colors from "../constants/colors";
import MONTH_NAMES from "../constants/months";

const MonthlyContext = createContext();

const calculateMonths = () => {
	const currentMonth = new Date().getMonth() + 1;
	const currentYear = new Date().getFullYear();
	let monthsToFetch = [];
	for (let i = -4; i <= 0; i++) {
		let month = currentMonth + i;
		let year = currentYear;
		if (month < 1) {
			month += 12;
			year--;
		} else if (month > 12) {
			month -= 12;
			year++;
		}
		monthsToFetch.push({ month, year });
	}
	return monthsToFetch;
};

export const MonthlyProvider = ({ children }) => {
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [loadingData, setLoadingData] = useState(true);
	const [refresh, setRefresh] = useState(false);

	/*** MONTHLY BUDGET FUNCTIONALITY ***/
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [monthlyBudgetId, setMonthlyBudgetId] = useState(null);
	const [budgetExists, setBudgetExists] = useState(false);
	const [totalSpentMonth, setTotalSpentMonth] = useState(0);
	const [totalBudgetMonth, setTotalBudgetMonth] = useState(0);

	const getMonthlyBudgetId = async () => {
		setLoading(true);
		const userId = user?.id;
		const month = currentMonth.getMonth() + 1;
		const year = currentMonth.getFullYear();

		try {
			const { data, error } = await supabase
				.from("monthly_budgets")
				.select("id")
				.eq("user_id", userId)
				.eq("month", month)
				.eq("year", year)
				.maybeSingle();

			if (error) throw error;

			if (data) {
				return data.id;
			} else {
				return null;
			}
		} catch (error) {
			console.error("Error fetching monthly budget id:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const getMonthlyBudget = async () => {
		setLoading(true);
		const userId = user?.id;
		const month = currentMonth.getMonth() + 1;
		const year = currentMonth.getFullYear();

		try {
			const { data, error } = await supabase
				.from("monthly_budgets")
				.select("*")
				.eq("user_id", userId)
				.eq("month", month)
				.eq("year", year)
				.order("id", { ascending: true })
				.maybeSingle();

			if (error) throw error;

			if (data) {
				setMonthlyBudgetId(data.id);
				setTotalSpentMonth(data.total_spent_month);
				setTotalBudgetMonth(data.total_budget_month);
				setBudgetExists(true);
			} else {
				setMonthlyBudgetId(null);
				setTotalSpentMonth(0);
				setTotalBudgetMonth(0);
				setBudgetExists(false);
			}

			return data;
		} catch (error) {
			console.error("Error fetching monthly budget:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const createMonthlyBudget = async (currentMonth) => {
		setLoading(true);
		const userId = user?.id;
		const month = currentMonth.getMonth() + 1;
		const year = currentMonth.getFullYear();

		try {
			const { data, error } = await supabase
				.from("monthly_budgets")
				.insert([
					{
						user_id: userId,
						month: month,
						year: year,
						total_spent_month: 0,
						total_budget_month: 0,
					},
				])
				.single();

			if (error) {
				console.error("Error creating monthly budget.", createError);
				return new Error(error.message);
			}
			// getExpenseAreas();
		} catch (error) {
			console.error("Error creating monthly budget for a user:", error.message);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const updateMonthlySpent = async (monthlyBudgetId) => {
		setLoading(true);
		try {
			// Fetch all expense areas for the specific monthly budget id:
			const { data: areaData, error: areaError } = await supabase
				.from("expense_areas")
				.select("id")
				.eq("monthly_budgets_id", monthlyBudgetId);

			if (areaError) throw areaError;

			let totalSpentMonth = 0;

			for (const area of areaData) {
				const { data: expenseData, error: expenseError } = await supabase
					.from("expenses")
					.select("total_spent_expense")
					.eq("expense_areas_id", area.id);

				if (expenseError) throw expenseError;

				const total = expenseData.reduce((total, exp) => total + parseFloat(exp.total_spent_expense || 0), 0);
				totalSpentMonth += total;
			}

			const { error: updateError } = await supabase
				.from("monthly_budgets")
				.update({ total_spent_month: totalSpentMonth })
				.eq("id", monthlyBudgetId);

			if (updateError) throw updateError;
		} catch (error) {
			console.error("Error updating monthly spent for a user:", error.message);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const updateMonthlyBudget = async (monthlyBudgetId) => {
		setLoading(true);
		try {
			// Fetch all expense areas for the specific monthly budget id:
			const { data: areaData, error: areaError } = await supabase
				.from("expense_areas")
				.select("id")
				.eq("monthly_budgets_id", monthlyBudgetId);

			if (areaError) throw areaError;

			let totalBudgetMonth = 0;

			for (const area of areaData) {
				const { data: expenseData, error: expenseError } = await supabase
					.from("expenses")
					.select("total_budget_expense")
					.eq("expense_areas_id", area.id);

				if (expenseError) {
					console.error("Error fetching expenses for area", expenseError.message);
					continue;
				}

				totalBudgetMonth += expenseData.reduce((acc, curr) => acc + parseFloat(curr.total_budget_expense), 0);
			}

			const { error: updateError } = await supabase
				.from("monthly_budgets")
				.update({ total_budget_month: totalBudgetMonth })
				.eq("id", monthlyBudgetId);

			if (updateError) throw updateError;
		} catch (error) {
			console.error("Error updating monthly budget for a user:", error.message);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	// LINE CHART
	const initialLineChartData = () => {
		const monthsToFetch = calculateMonths();
		return {
			// Shortening the month names;
			labels: monthsToFetch.map(({ month }) => MONTH_NAMES[month - 1].substring(0, 3)),
			datasets: [
				{
					// Fill with zeros based on number of months:
					data: Array(monthsToFetch.length).fill(0),
					label: "Forbrug",
					color: () => colors.COLOR_LIST[4],
				},
				{
					data: Array(monthsToFetch.length).fill(0),
					label: "Planlagte udgifter",
					color: () => colors.COLOR_LIST[4],
				},
			],
			legend: ["Forbrug", "Planlagte udgifter"],
		};
	};

	const [chartData, setChartData] = useState(initialLineChartData);
	const [savings, setSavings] = useState(initialLineChartData);

	const getMonthlyBudgetLineChart = async () => {
		setLoading(true);
		const userId = user?.id;
		const monthsToFetch = calculateMonths();

		try {
			const results = await Promise.all(
				monthsToFetch.map(({ month, year }) =>
					supabase
						.from("monthly_budgets")
						.select("total_spent_month, total_budget_month")
						.eq("user_id", userId)
						.eq("month", month)
						.eq("year", year)
						.maybeSingle()
				)
			);

			const labels = monthsToFetch.map(({ month, year }) => {
				// Shortening month and year in the graph:
				const monthName = MONTH_NAMES[month - 1].substring(0, 3);
				const yearShort = year.toString().substring(2);
				return `${monthName} ${yearShort}`;
			});

			const dataSpent = results.map((result) => (result.data ? parseFloat(result.data.total_spent_month) : 0));
			const dataBudget = results.map((result) => (result.data ? parseFloat(result.data.total_budget_month) : 0));

			let totalSavings = 0;
			results.forEach((result) => {
				if (result.data) {
					totalSavings += result.data.total_budget_month - result.data.total_spent_month;
				}
			});
			setSavings(totalSavings);

			setChartData({
				labels,
				datasets: [
					{ data: dataSpent, label: "Forbrug", color: () => colors.COLOR_LIST[4] },

					{ data: dataBudget, label: "Planlagte udgifter", color: () => colors.COLOR_LIST[1] },
				],
				legend: ["Forbrug", "Planlagte udgifter"],
			});
		} catch (error) {
			console.error("Error fetching monthly budgets:", error.message);
		} finally {
			setLoading(true);
		}
	};
	/*** LINE CHART END ***/

	/*** END ***/

	/*** PIGGY BANK FUNCTIONALITY ***/
	const [totalSavings, setTotalSavings] = useState(0);

	const getTotalPiggyBankSavings = async () => {
		setLoading(true);
		const userId = user?.id;
		try {
			const { data, error } = await supabase
				.from("piggy_bank")
				.select(`total_savings`)
				.eq("user_id", userId)
				.order("id", { ascending: true });

			if (error) {
				console.error("Error fetching monthly_budgets for piggy bank savings:", error.message);
			}

			await updatePiggyBankSavings();
			return data;
		} catch (error) {
			console.error("Error getTotalSavings:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const updatePiggyBankSavings = async () => {
		const userId = user?.id;

		try {
			const { data, error } = await supabase
				.from("monthly_budgets")
				.select("total_spent_month, total_budget_month")
				.eq("user_id", userId);

			if (error) {
				console.error("Error getting monthly budgets for piggy bank:", error.message);
				return;
			}

			const totalSavings = data.reduce(
				(acc, month) => acc + (month.total_budget_month - month.total_spent_month),
				0
			);

			const { data: savingsData, error: savingsError } = await supabase.from("piggy_bank").upsert(
				{
					user_id: userId,
					total_savings: totalSavings,
				},
				{
					onConflict: "user_id",
				}
			);

			if (savingsError) {
				console.error("Error updating piggy bank savings:", savingsError.message);
			} else {
				// console.log("Piggy bank savings updated successfully", savingsData);
			}
			setTotalSavings(totalSavings);
		} catch (error) {
			console.error("Error updatePiggyBankSavings:", error.message);
		}
	};
	/*** END ***/

	/*** MONTHLY GOAL FUNCTIONALITY ***/
	const createOrUpdateMonthlyGoal = async ({ goalName, savingsGoal, image }) => {
		setLoading(true);
		const userId = user?.id;
		const month = currentMonth.getMonth() + 1;
		const year = currentMonth.getFullYear();

		try {
			// Check if there's an existing monthly budget for user:
			const { data: budgetData, error: budgetError } = await supabase
				.from("monthly_budgets")
				.select("id")
				.eq("user_id", userId)
				.eq("month", month)
				.eq("year", year)
				.single();

			if (budgetError) {
				console.error("Error fetching monthly budgets for goal:", budgetError);
				throw new Error(`Failed to fetch budget: ${budgetError.message}`);
			}

			if (!budgetData) {
				// If no monthly budget exists, create new:
				const { data: newBudgetData, error: newBudgetError } = await supabase
					.from("monthly_budgets")
					.insert({
						user_id: userId,
						month,
						year,
						total_spent_month: 0,
						totalBudgetMonth: 0,
					})
					.single();

				if (newBudgetError) {
					console.error("Error creating monthly budget for goal:", newBudgetError);
					throw new Error(`Failed to create budget: ${newBudgetError.message}`);
				}
				budgetData = newBudgetData;
			}

			// Create or update the monthly goal linked to the budget:
			const { data, error } = await supabase.from("monthly_goal").upsert(
				{
					name: goalName,
					savings_goal: savingsGoal,
					image,
					monthly_budgets_id: budgetData.id,
					user_id: userId,
				},
				{
					onConflict: "monthly_budgets_id, user_id",
				}
			);

			if (error) {
				console.error("Error upserting goal:", error);
				throw new Error(`Failed to upsert goal: ${error.message}`);
			}
			return data;
		} catch (error) {
			console.error("Error createOrUpdateMonthlyGoal", error);
		} finally {
			setLoading(false);
		}
	};

	/*** END ***/

	return (
		<MonthlyContext.Provider
			value={{
				loading,
				setLoading,
				loadingData,
				setLoadingData,
				refresh,
				setRefresh,

				// Monthly Budget States
				currentMonth,
				setCurrentMonth,
				budgetExists,
				setBudgetExists,
				totalSpentMonth,
				totalBudgetMonth,
				// expenseAreasForMonth,
				// setExpenseAreasForMonth,

				chartData,
				savings,
				setTotalSpentMonth,
				setTotalBudgetMonth,
				// Monthly Budget Functions
				getMonthlyBudget,
				getMonthlyBudgetId,
				createMonthlyBudget,
				updateMonthlySpent,
				updateMonthlyBudget,
				getMonthlyBudgetLineChart,

				// Piggy Bank States
				totalSavings,
				setTotalSavings,
				// Piggy Bank Functions
				getTotalPiggyBankSavings,
				updatePiggyBankSavings,

				// Monthly Goal States

				// Monthly Goal Functions
				createOrUpdateMonthlyGoal,
			}}
		>
			{children}
		</MonthlyContext.Provider>
	);
};

export const useMonthly = () => useContext(MonthlyContext);
