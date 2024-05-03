import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { useUser } from "../../../context/UserContext";

const Settings = () => {
	const { signOut } = useUser();

	return (
		<View>
			<View style={styles.verticallySpaced}>
				<Button title="Sign Out" onPress={signOut} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	verticallySpaced: {
		marginTop: 20,
		paddingTop: 4,
		paddingBottom: 4,
		alignSelf: "stretch",
	},
});

export default Settings;
