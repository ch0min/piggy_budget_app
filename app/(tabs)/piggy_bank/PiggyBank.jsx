import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import { useMonthly } from "../../../contexts/MonthlyContext";
import PiggyBankGoal from "./components/PiggyBankGoal";
import PiggyBankSavings from "./components/PiggyBankSavings";

const PiggyBank = () => {
	const { user } = useAuth;
	const { totalSavings, getTotalPiggyBankSavings } = useMonthly();

	useEffect(() => {
		getTotalPiggyBankSavings();
	}, [totalSavings]);

	console.log(totalSavings);

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<PiggyBankGoal />
			</View>
			<View style={styles.footerContainer}>
				<PiggyBankSavings totalSavings={totalSavings} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	headerContainer: {
		flex: 1,
	},
	footerContainer: {
		flex: 1,
	},
});

export default PiggyBank;
