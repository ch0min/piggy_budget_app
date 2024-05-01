import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { supabase } from "../../../utils/supabase";

const Home = () => {
	return (
		<View style={styles.container}>
			<Text>Home</Text>

			<View style={styles.verticallySpaced}>
				<Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
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
