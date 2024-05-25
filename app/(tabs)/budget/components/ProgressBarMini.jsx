import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../../../constants/colors";

const ProgressBarMini = ({ totalSpentExpense, totalBudgetExpense }) => {
	const totalPercentage = totalBudgetExpense > 0 ? (totalSpentExpense / totalBudgetExpense) * 100 : 0;

	const gradientColors = (percentage) => {
		if (percentage < 50) {
			// Interpolate between green and yellow
			const mix = percentage / 50;
			return [interpolateColor(colors.GREEN, colors.YELLOW, mix), colors.YELLOW];
		} else {
			// Interpolate between yellow and red
			const mix = (percentage - 50) / 50;
			return [colors.YELLOW, interpolateColor(colors.YELLOW, colors.RED, mix)];
		}
	};

	return (
		<View style={styles.container}>
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
		justifyContent: "center",
		marginBottom: "2%",
	},
	progressBarContainer: {
		alignItems: "center",
		justifyContent: "center",
		height: 12,
		width: "100%",
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
});

export default ProgressBarMini;
