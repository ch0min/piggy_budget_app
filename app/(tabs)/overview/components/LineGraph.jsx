import React, { useState, useEffect } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, View, Text } from "react-native";
import { useAuth } from "../../../../contexts/AuthContext";
import { useMonthly } from "../../../../contexts/MonthlyContext";
import { useExpenses } from "../../../../contexts/ExpensesContext";

import colors from "../../../../constants/colors";
import { LineChart } from "react-native-chart-kit";
import FormatNumber from "../../../../utils/formatNumber";

const LineGraph = ({}) => {
	const { userProfile } = useAuth();
	const { chartData, savings, getMonthlyBudgetLineChart } = useMonthly();

	const [currentDate, setCurrentDate] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date();

			if (now.getMonth() !== currentDate.getMonth()) {
				setCurrentDate(now);
			}
		}, 1000 * 60 * 60 * 24);
		return () => clearInterval(interval);
	}, [currentDate]);

	useEffect(() => {
		if (userProfile && userProfile.valuta) {
			const fetchData = async () => {
				try {
					await getMonthlyBudgetLineChart();
				} catch (error) {
					console.error("Failed to fetch data for LineGraph:", error);
				}
			};
			fetchData();
		}
	}, [userProfile]);

	const formatNumberYGraph = (num) => {
		num = parseFloat(num);
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + "M";
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + "k";
		} else {
			return num.toString();
		}
	};

	if (!userProfile || !userProfile.valuta) {
		return (
			<ActivityIndicator size="large" style={{ marginTop: "30%", marginBottom: "40%" }} color={colors.DARKGRAY} />
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.graphContainer}>
				<View style={styles.legendContainer}>
					<Text style={styles.legendSubheading}>Sidste 5 måneder</Text>
					<Text style={styles.legendHeading}>
						Du har sparet: {FormatNumber(savings)}{" "}
						{userProfile && userProfile.valuta ? userProfile.valuta.name : ""}
					</Text>
				</View>

				<LineChart
					data={chartData}
					width={Dimensions.get("window").width - 40}
					height={220}
					formatYLabel={formatNumberYGraph}
					withInnerLines={false}
					fromZero={true}
					withShadow={true}
					chartConfig={{
						backgroundColor: colors.WHITE,
						backgroundGradientFrom: colors.WHITE,
						backgroundGradientTo: colors.WHITE,
						decimalPlaces: 0,
						color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
						style: {
							borderRadius: 16,
						},
						propsForBackgroundLines: {
							strokeWidth: 0.5,
							stroke: colors.DARKGRAY,
						},
						propsForDots: {
							r: "4",
							strokeWidth: 1,
							stroke: colors.WHITE,
						},
					}}
					bezier
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	graphContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: "5%",
		marginTop: "-10%",
		padding: 20,
		borderRadius: 15,
		backgroundColor: colors.WHITE,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1,
	},
	legendContainer: {
		alignSelf: "flex-start",
		marginBottom: "5%",
		marginLeft: "3%",
	},
	legendHeading: {
		fontSize: 20,
		color: colors.BLACK,
	},
	legendSubheading: {
		fontSize: 16,
		color: colors.DARKGRAY,
	},
});

export default LineGraph;
