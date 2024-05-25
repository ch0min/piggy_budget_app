import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useUser } from "../../../context/UserContext";
import colors from "../../../constants/colors";
import Bubble from "./components/Bubble";
import ProfileAvatar from "./components/ProfileAvatar";
import ProfileDetails from "./components/ProfileDetails";

const Profile = () => {
	const { user, userProfile } = useUser();

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Bubble />
			</View>

			<View style={styles.centerContainer}>
				<ProfileAvatar />

				<View style={styles.nameContainer}>
					<Text style={styles.firstName}>{userProfile.first_name}</Text>
					<Text style={styles.lastName}>{userProfile.last_name}</Text>
				</View>
				<Text style={styles.email}>{user?.email}</Text>
				<TouchableOpacity style={styles.editProfileBtn}>
					<Text style={styles.editProfileText}>Ændre din profil</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.footerContainer}>
				<ProfileDetails />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F3F2F5",
	},
	headerContainer: {
		flex: 0.5,
		alignItems: "center",
		justifyContent: "center",
	},
	centerContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	nameContainer: {
		flexDirection: "row",
		gap: "5%",
	},
	firstName: {
		fontSize: 22,
		fontWeight: "bold",
		color: colors.BLACK,
	},
	lastName: {
		fontSize: 22,
		fontWeight: "bold",
		color: colors.BLACK,
	},
	email: {
		marginTop: "1%",
		fontSize: 16,
		color: colors.BLACK,
	},
	editProfileBtn: {
		marginTop: "3%",
		marginBottom: "10%",
		paddingHorizontal: "5%",
		paddingVertical: "2%",
		borderWidth: 1,
		borderRadius: 10,
	},
	editProfileText: {
		fontSize: 16,
		fontWeight: "bold",
		color: colors.BLACK,
	},
	footerContainer: {
		flex: 1.5,
		marginBottom: "1%",
	},
});

export default Profile;
