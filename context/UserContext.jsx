import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { supabase } from "../utils/supabase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [loading, setLoading] = useState(false);

	// const [categoryList, setCategoryList] = useState([]);
	// const [expenseGroupsList, setExpenseGroupsList] = useState([]);
	// const [categoriesByExpenseGroups, setCategoriesByExpenseGroups] = useState({});
	// const [categoriesByExpenseGroupsForUser, setCategoriesByExpenseGroupsForUser] = useState({});

	useEffect(() => {
		if (!user && !session) {
			fetchInitialSession();
		}
	}, []);

	/*** AUTH FUNCTIONS ***/
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

	/*** EXPENSES FUNCTIONS ***/
	const [expenseAreas, setExpenseAreas] = useState([]);
	const [expenses, setExpenses] = useState([]);

	const getExpenseAreas = async () => {
		setLoading(true);
		try {
			const userId = user?.id;
			const { data, error } = await supabase.from("expense_areas").select(`*`).eq("user_id", userId);

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

		if (!userId) {
			console.error("No user id found");
			setLoading(false);
			return;
		}

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

	const getExpenses = async () => {
		setLoading(true);
		try {
			const userId = user?.id;
			const { data, error } = await supabase.from("expenses").select(`*`).eq("user_id", userId);

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

		if (!userId) {
			alert("No user id found");
			setLoading(false);
			return;
		}

		const { data, error } = await supabase.from("expenses").insert([
			{
				created_at: new Date(),
				name: name,
				max_budget: maxBudget,
				icon: icon,
				color: color,
				expense_areas_id: expenseAreasId,
				user_id: userId,
			},
		]);

		if (data) {
			// console.log(data);
			setLoading(false);
		}
		if (error) {
			console.error("Error creating expense:", error.message);
			setLoading(false);
			alert("Failed to create expense");
		}
	};

	const deleteExpense = async (expenseId) => {
		Alert.alert("Are you sure?", "Do you really want to delete this expense?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Yes",
				style: "destructive",
				onPress: async () => {
					const { error } = await supabase.from("expenses").delete().eq("id", expenseId);

					alert("Expense deleted");
				},
			},
		]);
	};
	/*** END ***/

	/*** TRANSACTIONS FUNCTIONS ***/
	const [transactions, setTransactions] = useState([]);

	const getTransactions = async () => {
		setLoading(true);
		try {
			const userId = user?.id;
			const { data, error } = await supabase.from("transactions").select(`*`).eq("user_id", userId);

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
		const userId = session?.user?.id;

		if (!userId) {
			console.error("No user id found");
			setLoading(false);
			return;
		}

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

		if (data) {
			setLoading(false);
		}
		if (error) {
			console.error("Error creating transaction:", error.message);
			setLoading(false);
			alert("Failed to create transaction");
		}
	};

	const deleteTransaction = async (transactionId) => {
		Alert.alert("Are you sure?", "Do you really want to delete this transaction?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Yes",
				style: "destructive",
				onPress: async () => {
					const { error } = await supabase.from("transactions").delete().eq("id", transactionId);

					alert("Transaction deleted");
				},
			},
		]);
	};

	// const updateProfile = async (updates) => {
	// 	setLoading(true);
	// 	try {
	// 		const { data, error } = await supabase.from("profiles").upsert({
	// 			id: session.user.id,
	// 			...updates,
	// 			updated_at: new Date(),
	// 		});

	// 		if (error) throw error;

	// 		setUserProfile(data);
	// 		setProfileCompleted(true);
	// 	} catch (error) {
	// 		console.error("Error updating profile", error.message);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	// const getExpenseAreas = async () => {
	// 	setLoading(true);
	// 	try {
	// 		const { data, error } = await supabase.from("expense_areas").select("*");

	// 		if (error) throw error;

	// 		setExpenseGroupsList(data);
	// 		// console.log("Main Categories fetched:", data);
	// 	} catch (error) {
	// 		console.error("Error fetching Main Categories:", error.message);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	// const getCategoriesByExpenseGroups = async () => {
	// 	if (expenseGroupsList.length === 0) return;
	// 	let categoriesObj = {};
	// 	setLoading(true);

	// 	try {
	// 		for (let group of expenseGroupsList) {
	// 			const categories = await getCategoriesByExpenseGroupsId(group.id);
	// 			categoriesObj[group.id] = categories;
	// 		}
	// 		setCategoriesByExpenseGroups(categoriesObj);
	// 	} catch (error) {
	// 		console.error("Error fetching Categories by Expense Groups:", error.message);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	// const getCategoriesByExpenseGroupsId = async (expenseGroupsId) => {
	// 	setLoading(true);
	// 	try {
	// 		const { data, error } = await supabase.from("categories").select("*").eq("expense_groups_id", expenseGroupsId);

	// 		if (error) throw error;

	// 		return data;
	// 	} catch (error) {
	// 		console.error("Error fetching Categories by Expense Groups ID:", error.message);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	// const getCategoriesByExpenseGroupsForUser = async () => {
	// 	if (expenseGroupsList.length === 0) return;
	// 	let categoriesObj = {};
	// 	setLoading(true);

	// 	try {
	// 		for (let group of expenseGroupsList) {
	// 			const userId = session?.user?.id;

	// 			const categories = await getCategoriesByExpenseGroupsIdForUser(group.id, userId);
	// 			categoriesObj[group.id] = categories;
	// 		}
	// 		setCategoriesByExpenseGroupsForUser(categoriesObj);
	// 	} catch (error) {
	// 		console.error("Error fetching Categories by Expense Groups for User:", error.message);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	// const getCategoriesByExpenseGroupsIdForUser = async (expenseGroupsId, createdById) => {
	// 	setLoading(true);

	// 	try {
	// 		const { data, error } = await supabase
	// 			.from("categories")
	// 			.select("*")
	// 			.eq("expense_groups_id", expenseGroupsId)
	// 			.eq("created_by", createdById);

	// 		if (error) throw error;

	// 		return data;
	// 	} catch (error) {
	// 		console.error("Error fetching Categories by Expense Groups ID for User:", error.message);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	// const createCategory = async (name, icon, color, expense_groups_id) => {
	// 	setLoading(true);
	// 	const userId = session?.user?.id;

	// 	if (!userId) {
	// 		alert("No user id found");
	// 		setLoading(false);
	// 		return;
	// 	}

	// 	const { data, error } = await supabase.from("categories").insert([
	// 		{
	// 			created_by: userId,
	// 			name: name,
	// 			icon: icon,
	// 			color: color,
	// 			// assigned_budget: assigned_budget,
	// 			expense_groups_id: expense_groups_id,
	// 		},
	// 	]);

	// 	if (data) {
	// 		console.log(data);
	// 		setLoading(false);
	// 	}
	// 	if (error) {
	// 		console.error("Error creating category:", error.message);
	// 		setLoading(false);
	// 		alert("Failed to create Category");
	// 	}
	// };

	// const createExpense = async ({ amount, details, categoriesId }) => {
	// 	setLoading(true);
	// 	const userId = session?.user?.id;

	// 	if (!userId) {
	// 		alert("No user id found");
	// 		setLoading(false);
	// 		return;
	// 	}

	// 	if (!amount || !details || !categoriesId) {
	// 		alert("All fields are required.");
	// 		setLoading(false);
	// 		return;
	// 	}

	// 	try {
	// 		const { data, error } = await supabase.from("expenses").insert([
	// 			{
	// 				created_at: new Date(),
	// 				created_by: userId,
	// 				amount: amount,
	// 				details: details,
	// 				categories_id: categoriesId,
	// 			},
	// 		]);

	// 		if (error) throw error;
	// 	} catch (error) {
	// 		console.error("Error creating expense:", error.message);
	// 		alert("Failed to create expense");
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
				expenses,
				// Expense Areas Functions
				getExpenseAreas,
				createExpenseArea,
				getExpenses,
				createExpense,
				deleteExpense,

				// Transactions States
				transactions,
				// Transactions Functions
				getTransactions,
				createTransaction,
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
