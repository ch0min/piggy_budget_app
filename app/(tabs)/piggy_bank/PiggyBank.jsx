import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../../constants/colors";
import { useAuth } from "../../../contexts/AuthContext";
import { useMonthly } from "../../../contexts/MonthlyContext";
import PiggyBankGoal from "./components/PiggyBankGoal";
import PiggyBankSavings from "./components/PiggyBankSavings";

const PiggyBank = () => {
	const isFocused = useIsFocused();
	const { user, userProfile } = useAuth();
	const { totalSavings, getTotalPiggyBankSavings, currentMonth, getMonthlyBudget, getMonthlyGoal } = useMonthly();

	useEffect(() => {
		if (isFocused) {
			const fetchData = async () => {
				await getMonthlyBudget();
				await getMonthlyGoal();
				await getTotalPiggyBankSavings();
			};

			fetchData();
		}
	}, [isFocused]);

	return (
		<LinearGradient colors={[colors.SECONDARY, colors.PRIMARY]} locations={[0.3, 1.0]} style={styles.container}>
			<View style={styles.headerContainer}>
				<PiggyBankGoal />
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
		marginTop: "15%",
	},
	footerContainer: {
		flex: 2,
	},
	heading: {
		fontSize: 22,
		fontWeight: "bold",
		color: colors.WHITE,
	},
});

export default PiggyBank;
