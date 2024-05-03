import React, { createContext, useContext, useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import supabase from "../utils/supabase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState(null);

	useEffect(() => {
		checkUser();
		// return () => {};
	}, []);

	const checkUser = async () => {
		setLoading(true);
		const session = supabase.auth.session();
		setUser(session?.user ?? null);
		setLoading(false);
	};

	const signIn = async (email, password) => {
		setLoading(true);
		const { user, error } = await supabase.auth.signIn({ email, password });
		if (error) {
			console.error("Login error", error.message);
		} else {
			setUser(user);
		}
		setLoading(false);
	};

	const signOut = async () => {
		await supabase.auth.signOut();
		setUser(null);
	};

	return <UserContext.Provider value={{ loading, user, signIn, signOut, checkUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
