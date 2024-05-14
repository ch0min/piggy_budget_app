import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useUser } from "../../context/UserContext";
import colors from "../../utils/colors";
import { LinearGradient } from "expo-linear-gradient";

const Header = () => {
	const { user, userProfile, getProfile } = useUser();

	useEffect(() => {
		if (!userProfile) {
			getProfile(user?.id);
		}
	}, []);

	return (
		<LinearGradient
			colors={[colors.PRIMARY, colors.SECONDARY]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			locations={[0.1, 1.0]}
			style={styles.container}
		>
			<Text style={styles.text}>{userProfile?.avatar_url}</Text>

			<View style={styles.header}>
				<View>
					<Text style={styles.userText}>{userProfile?.first_name}</Text>
					<Text style={styles.text}>{userProfile?.last_name}</Text>
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

export default Header;
