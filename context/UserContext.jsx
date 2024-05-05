import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [loading, setLoading] = useState(false);
	const [session, setSession] = useState(null);
	const [user, setUser] = useState(null);
	const [userProfile, setUserProfile] = useState(null);
	const [profileCompleted, setProfileCompleted] = useState(false);
	const [categoryList, setCategoryList] = useState([]);
	const [expenseGroupsList, setExpenseGroupsList] = useState([]);
	const [categoriesByExpenseGroups, setCategoriesByExpenseGroups] = useState({});
	const [categoriesByExpenseGroupsForUser, setCategoriesByExpenseGroupsForUser] = useState({});

	const [selectedCategory, setSelectedCategory] = useState(null);

	useEffect(() => {
		if (!user && !session) {
			fetchInitialSession();
		}
	}, []);

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

	const getCategoryList = async () => {
		setLoading(true);
		try {
			const userEmail = session.user.email;
			const { data, error } = await supabase.from("categories").select(`*`).eq("created_by", userEmail);

			if (error) throw error;

			setCategoryList(data);
			// console.log("CategoryList fetched:", data);
		} catch (error) {
			console.error("Error fetching CategoryList:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const getExpenseGroupsList = async () => {
		setLoading(true);
		try {
			const { data, error } = await supabase.from("expense_groups").select("*");

			if (error) throw error;

			setExpenseGroupsList(data);
			// console.log("Main Categories fetched:", data);
		} catch (error) {
			console.error("Error fetching Main Categories:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const getCategoriesByExpenseGroups = async () => {
		if (expenseGroupsList.length === 0) return;
		let categoriesObj = {};
		setLoading(true);

		try {
			for (let group of expenseGroupsList) {
				const categories = await getCategoriesByExpenseGroupsId(group.id);
				categoriesObj[group.id] = categories;
			}
			setCategoriesByExpenseGroups(categoriesObj);
		} catch (error) {
			console.error("Error fetching Categories by Expense Groups:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const getCategoriesByExpenseGroupsId = async (expenseGroupsId) => {
		setLoading(true);
		try {
			const { data, error } = await supabase.from("categories").select("*").eq("expense_groups_id", expenseGroupsId);

			if (error) throw error;

			return data;
		} catch (error) {
			console.error("Error fetching Categories by Expense Groups ID:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const getCategoriesByExpenseGroupsForUser = async () => {
		if (expenseGroupsList.length === 0) return;
		let categoriesObj = {};
		setLoading(true);

		try {
			for (let group of expenseGroupsList) {
				const userId = session?.user?.id;

				const categories = await getCategoriesByExpenseGroupsIdForUser(group.id, userId);
				categoriesObj[group.id] = categories;
			}
			setCategoriesByExpenseGroupsForUser(categoriesObj);
		} catch (error) {
			console.error("Error fetching Categories by Expense Groups for User:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const getCategoriesByExpenseGroupsIdForUser = async (expenseGroupsId, createdById) => {
		setLoading(true);

		try {
			const { data, error } = await supabase
				.from("categories")
				.select("*")
				.eq("expense_groups_id", expenseGroupsId)
				.eq("created_by", createdById);

			if (error) throw error;

			return data;
		} catch (error) {
			console.error("Error fetching Categories by Expense Groups ID for User:", error.message);
		} finally {
			setLoading(false);
		}
	};

	const createCategory = async (name, icon, color, expense_groups_id) => {
		setLoading(true);
		const userId = session?.user?.id;

		if (!userId) {
			alert("No user id found");
			setLoading(false);
			return;
		}

		const { data, error } = await supabase.from("categories").insert([
			{
				created_by: userId,
				name: name,
				icon: icon,
				color: color,
				// assigned_budget: assigned_budget,
				expense_groups_id: expense_groups_id,
			},
		]);

		if (data) {
			console.log(data);
			setLoading(false);
		}
		if (error) {
			console.error("Error creating category:", error.message);
			setLoading(false);
			alert("Failed to create Category");
		}
	};

	const createExpense = async ({ amount, details, categoriesId }) => {
		setLoading(true);
		const userId = session?.user?.id;

		if (!userId) {
			alert("No user id found");
			setLoading(false);
			return;
		}

		if (!amount || !details || !categoriesId) {
			alert("All fields are required.");
			setLoading(false);
			return;
		}

		try {
			const { data, error } = await supabase.from("expenses").insert([
				{
					created_at: new Date(),
					created_by: userId,
					amount: amount,
					details: details,
					categories_id: categoriesId,
				},
			]);

			if (error) throw error;
		} catch (error) {
			console.error("Error creating expense:", error.message);
			alert("Failed to create expense");
		} finally {
			setLoading(false);
		}
	};

	return (
		<UserContext.Provider
			value={{
				loading,
				user,
				userProfile,
				session,
				profileCompleted,
				setProfileCompleted,
				categoryList,
				categoriesByExpenseGroups,
				expenseGroupsList,
				selectedCategory,
				setSelectedCategory,

				signIn,
				signUp,
				signOut,
				getProfile,
				updateProfile,
				getCategoryList,
				getExpenseGroupsList,
				getCategoriesByExpenseGroups,
				getCategoriesByExpenseGroupsId,
				createCategory,
				createExpense,

				categoriesByExpenseGroupsForUser,
				getCategoriesByExpenseGroupsForUser,
				getCategoriesByExpenseGroupsIdForUser,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
