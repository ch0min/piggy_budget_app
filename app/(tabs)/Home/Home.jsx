import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { supabase } from "../../../utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {

	useEffect(() => {
		const completeProfile = async () => {
			if (session?.user) {
				const tempProfileString = await AsyncStorage.getItem('tempProfile');
				if (tempProfileString) {
					const tempProfile = JSON.parse(tempProfileString);
					// Ensure we match the correct user session
					if (tempProfile.userId === session.user.id) {
						const { error } = await supabase.from('profiles').upsert({
							id: session.user.id,
							username: tempProfile.username,
							first_name: tempProfile.firstName,
							last_name: tempProfile.lastName,
							avatar_url: tempProfile.avatarUrl,
						});
	
						if (error) throw error;
	
						await AsyncStorage.removeItem('tempProfile'); // Clean up
						Alert.alert("Profile Update", "Your profile has been updated successfully.");
					}
				}
			}
		};
	
		completeProfile().catch(error => {
			Alert.alert("Profile Update Error", error.message);
		});
	}, [session?.user]);
	


	// useEffect(() => {
	// 	const completeProfile = async () => {


	// 		const tempProfile = await AsyncStorage.getItem("tempProfile");
	// 		if (tempProfile) {
	// 			const profileData = JSON.parse(tempProfile);
	// 			if (session && session.user && session.user.id === profileData.userId) {
	// 				await supabase.from("profiles").upsert({
	// 					id: session.user.id,
	// 					username: profileData.username,
	// 					first_name: profileData.firstName,
	// 					last_name: profileData.lastName,
	// 					avatar_url: profileData.avatarUrl,
	// 				});
	// 				await AsyncStorage.removeItem("tempProfile"); // Clean up
	// 				Alert(alert("Profile Update", "Your profile has been updated successfully"))

	// 			}
	// 		}
	// 	};
	// 		completeProfile().catch(error => {
	// 			Alert(alert("Profile Update Error", error.message))
	// 		})
	// }, [session?.user]);

	// useEffect(() => {
	// 	const validateSession = async () => {
	// 		try {
	// 			const user = supabase.auth.user();
	// 			if (!user) {
	// 				console.log("No user found, forcing sign out...");
	// 				handleForceSignOut();
	// 			}
	// 		} catch (error) {
	// 			console.error("Error validating session:", error);
	// 			handleForceSignOut();
	// 		}
	// 	};

	// 	validateSession();
	// }, [session]);

	return (
		<View style={styles.container}>
			<Text>Home</Text>

			<View style={styles.verticallySpaced}>
				<Button title="Sign Out" onPress={handleForceSignOut} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 100,
	},
	verticallySpaced: {
		marginTop: 20,
		paddingTop: 4,
		paddingBottom: 4,
		alignSelf: "stretch",
	},
});

export default Home;
