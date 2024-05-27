import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import colors from "../../../../constants/colors";

const PiggyBank = ({ totalSpentMonth, totalBudgetMonth }) => {
	const totalPercentage = totalBudgetMonth > 0 ? (totalSpentMonth / totalBudgetMonth) * 100 : 0;

	return (
		<View style={styles.container}>
			<Text style={styles.label}>Budget Progress:</Text>
			<View style={styles.progressBarContainer}>
				<View style={[styles.progressBar, { width: `${totalPercentage}%` }]}></View>
			</View>
			<Text style={styles.percentage}>{totalPercentage}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 10,
		backgroundColor: colors.WHITE,
		borderRadius: 5,
	},
	label: {
		fontSize: 16,
		color: colors.BLACK,
	},
	progressBarContainer: {
		height: 20,
		backgroundColor: colors.GRAY,
		borderRadius: 10,
		overflow: "hidden",
		marginVertical: 10,
	},
	progressBar: {
		height: "100%",
		backgroundColor: colors.PRIMARY,
	},
	percentage: {
		fontSize: 16,
		color: colors.DARKGRAY,
		textAlign: "right",
	},
});

export default PiggyBank;
