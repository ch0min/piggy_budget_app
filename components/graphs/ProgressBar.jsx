import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useUser } from "../../context/UserContext";
import colors from "../../utils/colors";
import { LinearGradient } from "expo-linear-gradient";

const ProgressBar = ({ transactions, selectedExpense, maxBudget }) => {
	const [totalAmount, setTotalAmount] = useState();
	const [totalPercentage, setTotalPercentage] = useState(0);

	useEffect(() => {
		if (!selectedExpense) return;

		const filteredTransactions = transactions.filter((tr) => tr.expenses_id === selectedExpense.id);

		const total = filteredTransactions.reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);
		setTotalAmount(total);

		const percentage = (total / maxBudget) * 100;
		setTotalPercentage(percentage);
	}, [transactions, selectedExpense, maxBudget]);

	return (
		<View style={styles.container}>
			<View style={styles.textContainer}>
				<Text style={styles.progressTextAmount}>{totalAmount}</Text>
				<Text style={styles.progressTextPct}>{totalPercentage.toFixed(2)}%</Text>
				<Text style={styles.progressTextMax}>{maxBudget}</Text>
			</View>
			<View style={styles.progressBarContainer}>
				<View style={styles.progressBarBackground}>
					<LinearGradient
						colors={[colors.PRIMARY, colors.SECONDARY]}
						style={[styles.progressBarFill, { width: `${totalPercentage}%` }]}
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginBottom: "5%",
	},
	textContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginHorizontal: "5%",
	},
	progressBarContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	progressBarBackground: {
		width: "90%",
		height: "70%",
		borderRadius: 10,
		backgroundColor: colors.GRAY,
		overflow: "hidden",
	},
	progressBarFill: {
		height: "100%",
	},
	progressTextAmount: {
		fontSize: 14,
		fontWeight: "bold",
		color: colors.BLACK,
	},
	progressTextPct: {
		fontSize: 14,
		color: colors.DARKGRAY,
	},
	progressTextMax: {
		fontSize: 14,
		color: colors.BLACK,
	},
});

export default ProgressBar;
