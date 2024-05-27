import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [loading, setLoading] = useState(true);
	const [refresh, setRefresh] = useState(false);

	const [session, setSession] = useState(null);
	const [user, setUser] = useState(null);
	const [userProfile, setUserProfile] = useState(null);
	const [profileCompleted, setProfileCompleted] = useState(false);

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
			const fullProfileUpdates = { ...userProfile, ...updates };

			const { data, error } = await supabase.from("profiles").upsert({
				id: session.user.id,
				...fullProfileUpdates,
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
