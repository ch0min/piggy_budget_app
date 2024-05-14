import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useUser } from "../../context/UserContext";
import { BarChart } from "react-native-gifted-charts";
import colors from "../../utils/colors";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import FormatNumber from "../../utils/formatNumber";

const BarGraph = ({}) => {
	const { userProfile } = useUser();

	const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }];

	return (
		<TouchableOpacity style={styles.container}>
			<View style={styles.subContainer}>
				<BarChart
					data={data}
					width={350} // Set the width of the chart
					height={220} // Set the height of the chart
					barWidth={30}
					yAxisThickness={0}
					xAxisThickness={0}
					noOfSections={5}
					barBorderRadius={5}
					frontColor={colors.PRIMARY}
					dataPointsColor={colors.DARK}
					yAxisLabelTexts={["0", "20", "40", "60", "80", "100"]}
				/>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		marginHorizontal: "3%",
		marginTop: "5%",
		padding: "4%",
		borderRadius: 15,
		backgroundColor: colors.WHITE,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1,
	},
	barChart: {
		marginBottom: "3%",
	},
	heading: {
		fontSize: 20,
	},
	subContainer: {
		flex: 1,
		flexDirection: "row",
		gap: "25%",
	},
});

export default BarGraph;
