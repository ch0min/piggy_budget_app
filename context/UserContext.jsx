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
				.select("profile_completed, avatar_url, first_name, last_name")
				.eq("id", userId)
				.single();

			if (error) throw error;

			if (data) {
				setUserProfile(data);
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

	/*** EXPENSE AREAS FUNCTIONS ***/
	const [expenseAreas, setExpenseAreas] = useState([]);

	const getExpenseAreas = async () => {
		setLoading(true);
		try {
			const userId = user?.id;
			const { data, error } = await supabase
				.from("expense_areas")
				.select(`*`)
				.eq("user_id", userId)
				.order("id", { ascending: true });
			if (error) throw error;

			setExpenseAreas(data);
			// console.log("Expense Areas fetched:", data);
		} catch (error) {
			console.error("Error fetching expense_areas:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const createExpenseArea = async (name) => {
		setLoading(true);
		const userId = session?.user?.id;

		const { data, error } = await supabase.from("expense_areas").insert([
			{
				name: name,
				user_id: userId,
			},
		]);

		if (data) {
			setLoading(false);
		}
		if (error) {
			console.error("Error creating expense area:", error.message);
			setLoading(false);
			alert("Failed to create expense area");
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
			const { data: expenses, error: expensesError } = await supabase
				.from("expenses")
				.select("id")
				.eq("expense_areas_id", expenseAreasId);

			if (expensesError) throw expensesError;

			let totalBudget = 0;
			for (let expense of expenses) {
				const { data: transactions, error: transactionsError } = await supabase
					.from("transactions")
					.select("amount")
					.eq("expenses_id", expense.id);

				if (transactionsError) throw transactionsError;

				const expenseTotal = transactions.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
				totalBudget += expenseTotal;
			}

			const { error } = await supabase
				.from("expense_areas")
				.update({ total_budget: totalBudget })
				.eq("id", expenseAreasId);

			if (error) throw error;
		} catch (error) {
			console.error("Failed to update total budget for expense area:", error.message);
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
			const { data, error } = await supabase.from("expenses").insert([
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
			]);

			if (error) throw error;

			// await updateTotalBudgetForArea(expenseAreasId);
		} catch (error) {
			console.error("Error creating expense", error.message);
		} finally {
			setLoading(false);
		}
	};

	const updateExpense = async (id, name, maxBudget, icon, color) => {
		setLoading(true);
		try {
			const { data, error } = await supabase
				.from("expenses")
				.update({ name, max_budget: maxBudget, icon, color })
				.match({ id });

			if (error) throw error;

			// getExpenses();
			// return data;
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
			// const { data: expenseData, error: expenseError } = await supabase
			// 	.from("expenses")
			// 	.select("expense_areas_id")
			// 	.eq("id", id)
			// 	.single();

			// if (expenseError) throw expenseError;

			const { error } = await supabase.from("expenses").delete().match({ id });
			if (error) throw error;

			// await updateTotalBudgetForArea(expenseData.expense_areas_id);
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

			const { error } = await supabase.from("transactions").insert([
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

			await updateExpenseTotalSpent(expensesId);
		} catch (error) {
			console.error("Error creating transaction:", error.message);
		} finally {
			setLoading(false);
		}
	};

	// const createTransaction = async (name, amount, note, expensesId) => {
	// 	setLoading(true);
	// 	try {
	// 		const userId = session?.user?.id;

	// 		const { data, error } = await supabase.from("transactions").insert([
	// 			{
	// 				created_at: new Date(),
	// 				name: name,
	// 				amount: amount,
	// 				note: note,
	// 				expenses_id: expensesId,
	// 				user_id: userId,
	// 			},
	// 		]);

	// 		if (error) throw error;

	// 		const { data: expenseData, error: expenseError } = await supabase
	// 			.from("expenses")
	// 			.select("expense_areas_id")
	// 			.eq("id", expensesId)
	// 			.single();

	// 		if (expenseError) throw expenseError;

	// 		await updateTotalBudgetForArea(expenseData.expense_areas_id);
	// 	} catch (error) {
	// 		console.error("Error creating transaction:", error.message);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	const updateTransaction = async (id, name, amount, note) => {
		setLoading(true);
		try {
			const { data, error } = await supabase.from("transactions").update({ name, amount, note }).match({ id });
			if (error) throw error;

			if (data) {
				await updateExpenseTotalSpent(data[0].expenses_id);
			}
		} catch (error) {
			console.error("Error updating transaction", error.message);
		} finally {
			setLoading(false);
		}
	};

	// const updateTransaction = async (id, name, amount, note) => {
	// 	setLoading(true);
	// 	try {
	// 		const { data, error } = await supabase.from("transactions").update({ name, amount, note }).match({ id });
	// 		if (error) throw error;

	// 		const { data: transactionData, error: transactionError } = await supabase
	// 			.from("transactions")
	// 			.select("expenses_id")
	// 			.eq("id", id)
	// 			.single();

	// 		if (transactionError) throw transactionError;

	// 		const { data: expenseData, error: expenseError } = await supabase
	// 			.from("expenses")
	// 			.select("expense_areas_id")
	// 			.eq("id", transactionData.expenses_id)
	// 			.single();

	// 		if (expenseError) throw expenseError;

	// 		await updateTotalBudgetForArea(expenseData.expense_areas_id);

	// 		// getTransactions();
	// 		// setLoading(false);
	// 		// return data;
	// 	} catch (error) {
	// 		console.error("Error updating transaction", error.message);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	const deleteTransaction = async (id) => {
		setLoading(true);
		try {
			const { data: transaction, error } = await supabase
				.from("transactions")
				.select("expenses_id")
				.eq("id", id)
				.single();

			if (error) throw error;

			const { error: deleteError } = await supabase.from("transactions").delete().match({ id });
			if (deleteError) throw error;

			await updateExpenseTotalSpent(transaction.expenses_id);
		} catch (error) {
			console.error("Error deleting transaction", error.message);
		} finally {
			setLoading(false);
		}
	};

	// const deleteTransaction = async (id) => {
	// 	setLoading(true);
	// 	try {
	// 		const { data: transactionData, error: transactionError } = await supabase
	// 			.from("transactions")
	// 			.select("expenses_id")
	// 			.eq("id", id)
	// 			.single();

	// 		if (transactionError) throw transactionError;

	// 		const { data: expenseData, error: expenseError } = await supabase
	// 			.from("expenses")
	// 			.select("expense_areas_id")
	// 			.eq("id", transactionData.expenses_id)
	// 			.single();

	// 		if (expenseError) throw expenseError;

	// 		const { error } = await supabase.from("transactions").delete().match({ id });
	// 		if (error) throw error;

	// 		await updateTotalBudgetForArea(expenseData.expense_areas_id);
	// 	} catch (error) {
	// 		console.error("Error deleting transaction", error.message);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

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

				// categoryList,
				// categoriesByExpenseGroups,
				// expenseGroupsList,
				// selectedCategory,
				// setSelectedCategory,

				// getCategoryList,
				// getExpenseGroupsList,
				// getCategoriesByExpenseGroups,
				// getCategoriesByExpenseGroupsId,
				// createCategory,
				// createExpense,

				// categoriesByExpenseGroupsForUser,
				// getCategoriesByExpenseGroupsForUser,
				// getCategoriesByExpenseGroupsIdForUser,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
