import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../../../constants/colors";

const ProgressBarGoal = ({ totalPercentage, backgroundColor }) => {
	return (
		<View style={styles.container}>
			<View style={styles.progressBarContainer}>
				<View style={styles.progressBarBackground}>
					<View style={[styles.progressBarFill, { width: `${totalPercentage}%`, backgroundColor }]} />
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	progressBarContainer: {
		flexDirection: "column",
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

export default ProgressBarGoal;
