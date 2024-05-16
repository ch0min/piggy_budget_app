import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { supabase } from "../utils/supabase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [loading, setLoading] = useState(false);

	/*** AUTH FUNCTIONALITY ***/
	useEffect(() => {
		if (!user && !session) {
			fetchInitialSession();
		}
	}, []);

	const [session, setSession] = useState(null);
	const [user, setUser] = useState(null);
	const [userProfile, setUserProfile] = useState(null);
	const [profileCompleted, setProfileCompleted] = useState(false);

	const fetchInitialSession = async () => {
		setLoading(true);
		try {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setSession(session);
			setUser(session?.user);
			if (session?.user) {
				await getProfile(session.user.id);
			}
		} catch (error) {
			console.error("Error initializing session and profile", error.message);
		} finally {
			setLoading(false);
		}
	};

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
	// const [monthlyBudgetId, setMonthlyBudgetId] = useState(null);
	const [budgetExists, setBudgetExists] = useState(false);

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
			console.error("Error ensuring monthly budget for a user:", error.message);
			throw error;
		} finally {
			setLoading(false);
		}
	};
	/*** END ***/

	/*** EXPENSE AREAS FUNCTIONS ***/
	const [expenseAreas, setExpenseAreas] = useState([]);

	// const getExpenseAreas = async () => {
	// 	setLoading(true);
	// 	try {
	// 		const userId = user?.id;
	// 		const { data, error } = await supabase
	// 			.from("expense_areas")
	// 			.select(`*`)
	// 			.eq("user_id", userId)
	// 			.order("id", { ascending: true });
	// 		if (error) throw error;

	// 		setExpenseAreas(data);
	// 		// console.log("Expense Areas fetched:", data);
	// 	} catch (error) {
	// 		console.error("Error fetching expense_areas:", error.message);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

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
					.order("id", { ascending: true });

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

	const deleteExpenseArea = (id) => {
		return new Promise((resolve, reject) => {
			Alert.alert(
				"Confirm removal",
				"Do you really want to remove this area?",
				[
					{
						text: "Cancel",
						style: "cancel",
					},
					{
						text: "Delete",
						onPress: async () => {
							try {
								await supabase.from("expense_areas").delete().match({ id: id });
								resolve("Removal of the area was successful.");
							} catch (error) {
								reject("Removal of area failed.");
							}
						},
						style: "destructive",
					},
				],
				{ cancelable: false }
			);
		});
	};

	const updateTotalBudgetForArea = async (expenseAreasId) => {
		setLoading(true);
		try {
			// Fetching all expen ses for the given expense area:
			const { data: expenses, error: expensesError } = await supabase
				.from("expenses")
				.select("total_spent")
				.eq("expense_areas_id", expenseAreasId);

			if (expensesError) throw expensesError;

			// Calculate the total budget by summing all total_spent values:
			const totalBudget = expenses.reduce((acc, expense) => acc + parseFloat(expense.total_spent || 0), 0);

			// Update the total_budget in the expense_areas table:
			const { error: updateError } = await supabase
				.from("expense_areas")
				.update({ total_budget: totalBudget })
				.eq("id", expenseAreasId);

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

	const createExpense = async (name, maxBudget, icon, color, expenseAreasId) => {
		setLoading(true);
		const userId = session?.user?.id;
		try {
			const { data: expenseData, error } = await supabase
				.from("expenses")
				.insert([
					{
						created_at: new Date(),
						name: name,
						total_spent: 0,
						max_budget: maxBudget,
						icon: icon,
						color: color,
						expense_areas_id: expenseAreasId,
						user_id: userId,
					},
				])
				.single();

			if (error) throw error;

			await updateMonthlyBudget(maxBudget);

			await updateTotalBudgetForArea(expenseAreasId);
		} catch (error) {
			console.error("Error creating expense", error.message);
		} finally {
			setLoading(false);
		}
	};

	// const createExpense = async (name, maxBudget, icon, color, expenseAreasId) => {
	// 	setLoading(true);
	// 	const userId = session?.user?.id;
	// 	try {
	// 		const { data, error } = await supabase.from("expenses").insert([
	// 			{
	// 				created_at: new Date(),
	// 				name: name,
	// 				total_spent: 0,
	// 				max_budget: maxBudget,
	// 				icon: icon,
	// 				color: color,
	// 				expense_areas_id: expenseAreasId,
	// 				user_id: userId,
	// 			},
	// 		]);

	// 		if (error) throw error;

	// 		await updateTotalBudgetForArea(expenseAreasId);
	// 	} catch (error) {
	// 		console.error("Error creating expense", error.message);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	const updateExpense = async (id, name, maxBudget, icon, color) => {
		setLoading(true);
		try {
			const { data, error } = await supabase
				.from("expenses")
				.update({ name, max_budget: maxBudget, icon, color })
				.match({ id });

			if (error) throw error;

			if (data) {
				const expenseAreaId = data[0].expense_areas_id;
				await updateTotalBudgetForArea(expenseAreaId);
			}
		} catch (error) {
			console.error("Error updating expense:", error.message);
			setLoading(false);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const deleteExpense = async (id) => {
		setLoading(true);
		try {
			const { data: expenseData, error: expenseError } = await supabase
				.from("expenses")
				.select("expense_areas_id")
				.eq("id", id)
				.single();

			if (expenseError) throw expenseError;

			const { error } = await supabase.from("expenses").delete().match({ id });
			if (error) throw error;

			await updateTotalBudgetForArea(expenseData.expense_areas_id);
		} catch (error) {
			console.error("Error deleting expense:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const updateExpenseTotalSpent = async (expenseId) => {
		setLoading(true);
		try {
			const { data: transactions, error } = await supabase
				.from("transactions")
				.select("amount")
				.eq("expenses_id", expenseId);

			if (error) throw error;

			const totalSpent = transactions.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
			await supabase.from("expenses").update({ total_spent: totalSpent }).eq("id", expenseId);
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
		try {
			const userId = user?.id;
			const { data, error } = await supabase
				.from("transactions")
				.select(`*`)
				.eq("user_id", userId)
				.order("id", { ascending: true });

			if (error) throw error;

			setTransactions(data);
			// console.log("Expense Areas fetched:", data);
		} catch (error) {
			console.error("Error fetching expense_areas:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const createTransaction = async (name, amount, note, expensesId) => {
		setLoading(true);
		try {
			const userId = session?.user?.id;

			const { data, error } = await supabase.from("transactions").insert([
				{
					created_at: new Date(),
					name: name,
					amount: amount,
					note: note,
					expenses_id: expensesId,
					user_id: userId,
				},
			]);

			if (error) throw error;

			const { data: expenseData, error: expenseError } = await supabase
				.from("expenses")
				.select("expense_areas_id")
				.eq("id", expensesId)
				.single();

			if (expenseError) throw expenseError;

			await updateExpenseTotalSpent(expensesId);
			await updateTotalBudgetForArea(expenseData.expense_areas_id);
		} catch (error) {
			console.error("Error creating transaction:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const updateTransaction = async (id, name, amount, note) => {
		setLoading(true);
		try {
			const { data, error } = await supabase.from("transactions").update({ name, amount, note }).match({ id });
			if (error) throw error;

			if (data.length > 0) {
				const expenseId = data[0].expenses_id;

				// Update total_spent on the specific expense:
				await updateExpenseTotalSpent(expenseId);

				// Fetching the expense_area_id for the expense:
				const { data: expenseData, error: expenseError } = await supabase
					.from("expenses")
					.select("expense_areas_id")
					.eq("id", expenseId)
					.single();

				if (expenseError) throw expenseError;

				await updateExpenseTotalSpent(expenseData.expense_areas_id);
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

			await updateTotalBudgetForArea(expenseData.expense_areas_id);
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
				// Monthly Budget Functions
				createMonthlyBudget,

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
