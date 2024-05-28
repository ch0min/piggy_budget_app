import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [loading, setLoading] = useState(false);
	const [refresh, setRefresh] = useState(false);

	const [session, setSession] = useState(null);
	const [user, setUser] = useState(null);
	const [userProfile, setUserProfile] = useState(null);
	const [profileCompleted, setProfileCompleted] = useState(null);

	/*** AUTH FUNCTIONALITY ***/
	// AsyncStorage.clear().then(() => console.log("Local storage cleared!"));

	useEffect(() => {
		const loadingInitialState = async () => {
			setLoading(true);
			try {
				// Get user as profile completion status from AsyncStorage:
				const storedUser = await AsyncStorage.getItem("user");
				const storedProfileCompleted = await AsyncStorage.getItem("profile_completed");

				if (storedUser) {
					setUser(JSON.parse(storedUser));
				}
				if (storedProfileCompleted !== null) {
					setProfileCompleted(JSON.parse(storedProfileCompleted));
				}
			} catch (error) {
				console.error("Failed to load user data from storage:", error);
			}
			fetchSessionAndProfile();
		};
		loadingInitialState();
	}, []);

	const fetchSessionAndProfile = async () => {
		try {
			const sessionResponse = await supabase.auth.getSession();
			if (sessionResponse.data && sessionResponse.data.session) {
				setSession(sessionResponse.data.session);
				setUser(sessionResponse.data.session.user);
				setProfileCompleted(true);

				// Save to AsyncStorage
				AsyncStorage.setItem("user", JSON.stringify(sessionResponse.data.session.user));
				AsyncStorage.setItem("profile_completed", JSON.stringify(true));
				await getProfile(sessionResponse.data.session.user?.id);
			} else {
				setUser(null);
				setProfileCompleted(null);
				AsyncStorage.setItem("user", JSON.stringify(null));
				AsyncStorage.setItem("profile_completed", JSON.stringify(false));
			}
		} catch (error) {
			console.error("Error initializing session and profile", error.message);
		} finally {
			setLoading(false);
		}
	};

	// useEffect(() => {
	// 	const fetchSessionAndProfile = async () => {
	// 		setLoading(true);
	// 		try {
	// 			const sessionResponse = await supabase.auth.getSession();
	// 			if (sessionResponse.data.session) {
	// 				setSession(sessionResponse.data.session);
	// 				setUser(sessionResponse.data.session.user);
	// 				await getProfile(sessionResponse.data.session.user?.id);
	// 				console.log("fetchSessionAndProfile executed true");
	// 			} else {
	// 				setUser(null);
	// 				setProfileCompleted(null);
	// 				await getProfile(user.id);
	// 				console.log("fetchSessionAndProfile executed false");
	// 			}
	// 		} catch (error) {
	// 			console.error("Error initializing session and profile", error.message);
	// 		} finally {
	// 			setLoading(false);
	// 		}
	// 	};

	// 	fetchSessionAndProfile();
	// }, []);

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
				.select(`profile_completed, avatar_url, first_name, last_name, valuta_id, valuta:valuta_id (name)`)
				.eq("id", userId)
				.single();

			if (error) throw error;

			if (data) {
				setUserProfile({
					...data,
					valutaName: data.valuta?.name,
				});
				setProfileCompleted(data.profile_completed);
			}
			console.log("getProfile executed true");
		} catch (error) {
			console.error("Error fetching profile", error.message);
		} finally {
			setLoading(false);
		}
	};

	const updateProfile = async (updates) => {
		setLoading(true);
		try {
			const fullProfileUpdates = { ...userProfile, ...updates };

			const { data, error } = await supabase.from("profiles").upsert({
				id: session.user.id,
				avatar_url: updates.avatar_url,
				first_name: updates.first_name,
				last_name: updates.last_name,
				valuta_id: updates.valuta_id,
				profile_completed: updates.profile_completed,
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

	const updateValuta = async (valutaId) => {
		setLoading(true);
		try {
			const numericValutaId = Number(valutaId);
			const { data, error } = await supabase.from("profiles").upsert({
				id: session.user.id,
				valuta_id: numericValutaId,
				updated_at: new Date(),
			});
		} catch (error) {
			console.error("Error updating valuta:", error.message);
		} finally {
			setLoading(false);
		}
	};

	/*** END ***/

	return (
		<AuthContext.Provider
			value={{
				// Auth States
				loading,
				setLoading,
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

				// Valuta States
				valutas,
				// Valuta Functions
				getValutas,
				updateValuta,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
