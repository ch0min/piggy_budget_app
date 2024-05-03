import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { supabase } from "../utils/supabase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState(null);
	const [session, setSession] = useState(null);
	const [profileCompleted, setProfileCompleted] = useState(false);

	useEffect(() => {
		checkSessionAndProfile();
	}, []);

	const checkSessionAndProfile = async () => {
		setLoading(true);
		try {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setSession(session);
			setUser(session?.user);
			if (session && session.user) {
				await checkProfile(session.user.id);
			}
		} catch (error) {
			console.error("Error checking session", error.message);
		} finally {
			setLoading(false);
		}
	};

	const checkProfile = async (userId) => {
		try {
			const { data, error } = await supabase.from("profiles").select("profile_completed").eq("id", userId).single();

			if (error) {
				throw new Error(error.message);
			}
			if (data) {
				setProfileCompleted(data.profile_completed);
			}
		} catch (error) {
			Alert.alert("Error checking profile");
		}
	};

	const getProfile = async (userId) => {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("profile_completed, avatar_url, first_name, last_name")
				.eq("id", userId)
				.single();

			if (error) {
				throw new Error(error.message);
			}

			if (data) {
				setProfileCompleted(data.profile_completed);
			}
		} catch (error) {
			Alert.alert("Error fetching profile", error.message);
		}
	};

	const updateProfile = async (updates) => {
		try {
			const { error } = await supabase.from("profiles").upsert({
				id: session.user.id,
				...updates,
				updated_at: new Date(),
			});

			if (error) throw error;

			setProfileCompleted(true);
		} catch (error) {
			Alert.alert("Error updating profile", error.message);
		} finally {
			setLoading(false);
		}
	};

	const signIn = async (email, password) => {
		setLoading(true);
		const { user, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			console.error("Login error", error.message);
			return { error };
		} else {
			setUser(user);
			setSession(session);
			setLoading(false);

			return { user, session };
		}
	};

	// const signIn = async (email, password) => {
	// 	setLoading(true);
	// 	try {
	// 		const { user, session, error } = await supabase.auth.signInWithPassword({
	// 			email: email,
	// 			password: password,
	// 		});
	// 		setLoading(false);
	// 		if (error) {
	// 			console.error("Login error", error.message);
	// 			return { error }; // Ensuring that an object with error is returned
	// 		}

	// 		setUser(user);
	// 		setSession(session);
	// 		if (user) {
	// 			await getProfile(user.id);
	// 		}
	// 		return { user, session, error: null }; // Explicitly returning error as null when there's no error
	// 	} catch (error) {
	// 		console.error("Login error", error.message);
	// 		return { error }; // Ensuring that an object with error is returned
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	// const signIn = async (email, password) => {
	// 	setLoading(true);
	// 	try {
	// 		const { user, session, error } = await supabase.auth.signInWithPassword({
	// 			email: email,
	// 			password: password,
	// 		});
	// 		if (error) {
	// 			console.error("Login error", error.message);
	// 			return { error };
	// 		}

	// 		setUser(user);
	// 		setSession(session);
	// 		if (user) {
	// 			await getProfile(user.id);
	// 		}
	// 		return { error: null };
	// 	} catch (error) {
	// 		console.error("Exception during login", error.message);
	// 		return { error };
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

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
			setUser(null);
			setSession(null);
		} catch (error) {
			console.error("Error signing out", error.message);
		}
	};

	return (
		<UserContext.Provider
			value={{
				loading,
				user,
				session,
				profileCompleted,
				setProfileCompleted,
				checkProfile,
				getProfile,
				updateProfile,
				signIn,
				signUp,
				signOut,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
