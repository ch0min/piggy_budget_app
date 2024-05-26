import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Button } from "react-native";

const Settings = () => {
	return (
		<View>
			<View style={styles.verticallySpaced}></View>
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
