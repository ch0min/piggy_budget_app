import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { supabase } from "../../utils/supabase";
import colors from "../../utils/colors";
import { LinearGradient } from "expo-linear-gradient";

const OverviewHeader = ({ session }) => {
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState();

	useEffect(() => {
		getUserProfile();
	}, [session]);

	const getUserProfile = async () => {
		setLoading(true);
		if (!session?.user) throw new Error("No user on the session!");

		const { data, error } = await supabase.from("profiles").select(`*`).eq("id", session?.user.id).single();

		if (error) {
			console.log("Error fetching profile name:", error.message);
			setLoading(false);
			return;
		}

		console.log("Data", data);
		setUser(data);
		setLoading(false);
	};

	return (
		<LinearGradient
			colors={[colors.PRIMARY, colors.SECONDARY]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			locations={[0.1, 1.0]}
			style={styles.container}
		>
			<Text style={styles.text}>{user?.avatar_url}</Text>

			<View style={styles.header}>
				<View>
					<Text style={styles.text}>Welcome,</Text>
					<Text style={styles.userText}>{user?.first_name}</Text>
				</View>
			</View>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		height: "20%",
		padding: "5%",
		gap: "10%",
	},
	header: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "85%",
	},
	text: {
		fontSize: 16,
		color: colors.WHITE,
	},
	userText: {
		fontSize: 18,
		fontWeight: "bold",
		color: colors.WHITE,
	},
});

export default OverviewHeader;
