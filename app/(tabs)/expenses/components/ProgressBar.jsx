import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useUser } from "../../../../context/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../../../constants/colors";
import FormatNumber from "../../../../utils/formatNumber";

const ProgressBar = ({ totalSpentExpense, totalBudgetExpense }) => {
	const { userProfile } = useUser();

	const totalPercentage = totalBudgetExpense > 0 ? (totalSpentExpense / totalBudgetExpense) * 100 : 0;

	return (
		<View style={styles.container}>
			<View style={styles.textContainer}>
				<Text style={styles.progressTextAmount}>
					{FormatNumber(totalSpentExpense)} {userProfile.valutaName}
				</Text>
				<Text style={styles.progressTextPct}>{totalPercentage.toFixed(2)}%</Text>
				<Text style={styles.progressTextMax}>
					{FormatNumber(totalBudgetExpense)} {userProfile.valutaName}
				</Text>
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
