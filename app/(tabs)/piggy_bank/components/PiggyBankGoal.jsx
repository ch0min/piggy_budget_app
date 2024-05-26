import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import colors from "../../../../constants/colors";
import { useAuth } from "../../../../contexts/AuthContext";
import { useMonthly } from "../../../../contexts/MonthlyContext";

const PiggyBankGoal = () => {
	const { user } = useAuth;


	return (
		<View style={styles.container}>
		
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
		marginHorizontal: "5%",
		marginTop: "5%",
		padding: 20,
		borderRadius: 15,
		backgroundColor: colors.WHITE,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1,
	},
	heading: {
		marginLeft: "3%",
		marginBottom: "4%",
		fontSize: 20,
		fontWeight: "bold",
	},
});

export default PiggyBankGoal;
