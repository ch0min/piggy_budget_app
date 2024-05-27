import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../../constants/colors";
import { useAuth } from "../../../contexts/AuthContext";
import { useMonthly } from "../../../contexts/MonthlyContext";
import PiggyBankGoal from "./components/PiggyBankGoal";
import PiggyBankSavings from "./components/PiggyBankSavings";
import GoalProgressBar from "./components/GoalProgressBar";

const PiggyBank = () => {
	const { user } = useAuth;
	const { totalSpentMonth, totalBudgetMonth, totalSavings, getTotalPiggyBankSavings } = useMonthly();



	return (
		<LinearGradient colors={[colors.SECONDARY, colors.PRIMARY]} locations={[0.3, 1.0]} style={styles.container}>
			<View style={styles.headerContainer}>
				<PiggyBankGoal />
				{/* <GoalProgressBar totalSpentMonth={totalSpentMonth} totalBudgetMonth={totalBudgetMonth} /> */}
			</View>
			<View style={styles.footerContainer}>
				<PiggyBankSavings totalSavings={totalSavings} getTotalPiggyBankSavings={getTotalPiggyBankSavings} />
			</View>
		</LinearGradient>
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
		flex: 2,
	},
});

export default PiggyBank;
