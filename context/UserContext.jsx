import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import colors from "../constants/colors";
import MONTH_NAMES from "../constants/months";

const UserContext = createContext();

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

export const UserProvider = ({ children }) => {
	const [loading, setLoading] = useState(true);
	const [loadingData, setLoadingData] = useState(true);
	const [refresh, setRefresh] = useState(false);

	/*** AUTH FUNCTIONALITY ***/
	useEffect(() => {
		const fetchSession = async () => {
			setLoading(true);
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession();
				if (session) {
					setSession(session);
					setUser(session?.user);
					console.log("Fetching profile...");
					await getProfile(session.user.id);
				} else {
					console.log("No user in session...");
				}
			} catch (error) {
				console.error("Error initializing session and profile", error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchSession();
	}, []);

	const [session, setSession] = useState(null);
	const [user, setUser] = useState(null);
	const [userProfile, setUserProfile] = useState(null);
	const [profileCompleted, setProfileCompleted] = useState(false);

	const signIn = async (email, password) => {
		setLoading(true);
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: email,
				password: password,
			});

			if (error) throw error;

			const { session, user } = data;
			setSession(session);
			setUser(user);

			if (user) {
				await getProfile(user.id);
			}
		} catch (error) {
			console.error("Exception during login", error.message);
		} finally {
			setLoading(false);
		}
	};

	const signUp = async (email, password) => {
		setLoading(true);
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		let authError = null;

		// User exists, but is fake. See https://supabase.com/docs/reference/javascript/auth-signup
		if (data.user && data.user.identities && data.user.identities.length === 0) {
			authError = {
				name: "AuthApiError",
				message: "User already exists",
			};
		} else if (error) {
			authError = {
				name: error.name,
				message: error.message,
			};
		}
		setLoading(false);
		return { auth: data, error: authError };
	};

	const signOut = async () => {
		try {
			await supabase.auth.signOut();
			setSession(null);
			setUser(null);
		} catch (error) {
			console.error("Error signing out", error.message);
		}
	};

	const getProfile = async (userId) => {
		setLoading(true);
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("profile_completed, avatar_url, first_name, last_name, valuta_id, valuta:valuta_id (name)")
				.eq("id", userId)
				.single();

			if (error) throw error;

			if (data) {
				setUserProfile({
					...data,
					valutaName: data.valuta.name,
				});
				setProfileCompleted(data.profile_completed);
			}
		} catch (error) {
			console.error("Error fetching profile", error.message);
		} finally {
			setLoading(false);
		}
	};

	const updateProfile = async (updates) => {
		setLoading(true);
		try {
			const { data, error } = await supabase.from("profiles").upsert({
				id: session.user.id,
				...updates,
				updated_at: new Date(),
			});

			if (error) throw error;

			setUserProfile(data);
			setProfileCompleted(true);
		} catch (error) {
			console.error("Error updating profile", error.message);
		} finally {
			setLoading(false);
		}
	};

	/*** END ***/

	/*** MONTHLY BUDGET FUNCTIONALITY ***/
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [monthlyBudgetId, setMonthlyBudgetId] = useState(null);
	const [budgetExists, setBudgetExists] = useState(false);
	const [totalMonthlyBudget, setTotalMonthlyBudget] = useState(0);

	const getMonthlyBudgetId = async () => {
		setLoading(true);
		const userId = session?.user?.id;
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
		const userId = session?.user?.id;
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
				setTotalMonthlyBudget(data.total_budget_month);
				setBudgetExists(true);
			} else {
				setMonthlyBudgetId(null);
				setTotalMonthlyBudget(0);
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
		const userId = session?.user?.id;
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
			getExpenseAreas();
		} catch (error) {
			console.error("Error creating monthly budget for a user:", error.message);
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

			for (const area of expenseAreas) {
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

				if (expenseError) {
					console.error("Expense error:", expenseError.message);
					continue;
				}

				const areaTotal = expenseData.reduce((acc, curr) => acc + parseFloat(curr.total_spent_expense || 0), 0);
				totalSpentMonth += areaTotal;
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
		const userId = session?.user?.id;
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
	// LINE CHART END

	/*** END ***/

	/*** EXPENSE AREAS FUNCTIONS ***/
	const [expenseAreas, setExpenseAreas] = useState([]);

	const getExpenseAreas = async () => {
		setLoading(true);
		const userId = session?.user?.id;
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
				console.error("Error fetching monthly budget:", budgetError.message);
				setBudgetExists(False);
			}

			if (budgetData) {
				setBudgetExists(true);
				const { data: areasData, error: areasError } = await supabase
					.from("expense_areas")
					.select("*")
					.eq("monthly_budgets_id", budgetData.id)
					.order("id", { ascending: false });

				if (areasError) throw areasError;
				setExpenseAreas(areasData || []);
			} else {
				setExpenseAreas([]);
				setBudgetExists(false);
			}
		} catch (error) {
			console.error("Error fetching expense_areas:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const createExpenseArea = async (name) => {
		setLoading(true);
		const userId = session?.user?.id;

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
			console.error("Error creating expense area", error.message);
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
			console.error("Error updating expense area", error.message);
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
		} catch (error) {
			console.error("Error deleting expense area:", error.message);
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
			const totalBudgetArea = expenseData.reduce(
				(acc, { total_budget_expense }) => acc + parseFloat(total_budget_expense || 0),
				0
			);

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
		const userId = session?.user?.id;

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
				await updateMonthlyBudget(areaData.monthly_budgets_id);
				await updateMonthlySpent(areaData.monthly_budgets_id);
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
			const { data: expenseData, error: expenseError } = await supabase
				.from("expenses")
				.update({ name, total_budget_expense: totalBudgetExpense, icon, color })
				.match({ id });

			if (expenseError) throw expenseError;

			if (expenseData && expenseData.length > 0) {
				const expenseAreaId = expenseData[0].expense_areas_id;

				await updateExpenseTotalSpent(id);

				if (expenseAreaId) {
					await updateTotalBudgetForArea(expenseAreaId);

					// Fetch the expense area to get the monthly budget id:
					const { data: areaData, error: areaError } = await supabase
						.from("expense_areas")
						.select("monthly_budgets_id")
						.eq("id", expenseAreaId)
						.single();

					if (areaError) throw areaError;

					if (areaData && areaData.monthly_budgets_id) {
						await updateMonthlyBudget(areaData.monthly_budgets_id);
						await updateMonthlySpent(areaData.monthly_budgets_id);
					}
				}
				await getMonthlyBudgetLineChart();
				await updateExpenseTotalSpent(expenseData.expense_areas_id);
			}
		} catch (error) {
			console.error("Error updating expense:", error.message);
			throw error;
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

			if (transactionError) throw transactionError;

			const totalSpentExpense = transactionData.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

			const { data: expenseData, error: updateError } = await supabase
				.from("expenses")
				.update({ total_spent_expense: totalSpentExpense })
				.eq("id", expenseId);

			if (updateError) throw updateError;
			//
			//   await supabase.from("expenses").update({ total_spent_expense: totalSpentExpense }).eq("id", expenseId);
		} catch (error) {
			console.error("Failed to update expense total spent:", error.message);
		} finally {
			setLoading(false);
		}
	};
	/*** END ***/

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
		const userId = session?.user?.id;

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
					await updateMonthlyBudget(areaData.monthly_budgets_id);
					await updateMonthlySpent(areaData.monthly_budgets_id);
				}
			}
		} catch (error) {
			console.error("Error creating transaction:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const updateTransaction = async (id, name, amount, note) => {
		setLoading(true);
		try {
			const { data: transactionData, error: transactionError } = await supabase
				.from("transactions")
				.update({ name, amount, note })
				.match({ id });

			if (transactionError) throw transactionError;

			if (transactionData) {
				const expenseId = transactionData[0].expenses_id;

				// Update total_spent on the specific expense:
				await updateExpenseTotalSpent(expenseId);

				// Fetching the expense_area_id for the expense:
				const { data: expenseData, error: expenseError } = await supabase
					.from("expenses")
					.select("expense_areas_id")
					.eq("id", expenseId)
					.single();

				if (expenseError) throw expenseError;

				// Fetching the monthly_budgets_id from expense areas:
				if (expenseData) {
					const areaId = expenseData.expense_areas_id;

					await updateTotalBudgetForArea(areaId);

					const { data: areaData, error: areaError } = await supabase
						.from("expense_areas")
						.select("monthly_budgets_id")
						.eq("id", areaId)
						.single();

					if (areaError) throw areaError;

					if (areaData && areaData.monthly_budgets_id) {
						await updateMonthlyBudget(areaData.monthly_budgets_id);
						await updateMonthlySpent(areaData.monthly_budgets_id);
						await updateExpenseTotalSpent(expenseData.expense_areas_id);
					}
				}
			}
		} catch (error) {
			console.error("Error updating transaction", error.message);
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
		} catch (error) {
			console.error("Error deleting transaction", error.message);
		} finally {
			setLoading(false);
		}
	};
	/*** END ***/

	/*** VALUTA FUNCTIONS ***/
	const [valutas, setValutas] = useState([]);

	const getValutas = async () => {
		setLoading(true);
		try {
			const { data, error } = await supabase.from("valuta").select(`id, name`);

			if (error) throw error;

			setValutas(data);
			// console.log(data);
		} catch (error) {
			console.error("Error fetching valutas:", error.message);
		} finally {
			setLoading(false);
		}
	};
	/*** END ***/

	return (
		<UserContext.Provider
			value={{
				// Auth States
				loading,
				setLoading,
				loadingData,
				setLoadingData,
				refresh,
				setRefresh,
				user,
				userProfile,
				session,
				profileCompleted,
				setProfileCompleted,
				// Auth Functions
				signIn,
				signUp,
				signOut,
				getProfile,
				updateProfile,

				// Monthly Budget States
				currentMonth,
				setCurrentMonth,
				budgetExists,
				totalMonthlyBudget,
				chartData,
				savings,
				setTotalMonthlyBudget,
				// Monthly Budget Functions
				getMonthlyBudget,
				createMonthlyBudget,
				getMonthlyBudgetLineChart,
				// Expense Areas States
				expenseAreas,
				// Expense Areas Functions
				getExpenseAreas,
				createExpenseArea,
				updateExpenseArea,
				deleteExpenseArea,

				// Expenses States
				expenses,
				// Expenses Functions
				getExpenses,
				getLatestExpenses,
				createExpense,
				updateExpense,
				deleteExpense,
				updateExpenseTotalSpent,

				// Transactions States
				transactions,
				// Transactions Functions
				getTransactions,
				createTransaction,
				updateTransaction,
				deleteTransaction,

				// Valuta States
				valutas,
				// Valuta Functions
				getValutas,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
