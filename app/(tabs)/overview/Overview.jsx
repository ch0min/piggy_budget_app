import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Dimensions, StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { useUser } from "../../../context/UserContext";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import colors from "../../../utils/colors";
// import { RefreshControl } from "react-native";
import OverviewHeader from "./header/OverviewHeader";
import BarGraph from "../../../components/graphs/BarGraph";
import FormatNumber from "../../../utils/formatNumber";
import { FontAwesome, MaterialIcons, Feather, AntDesign, Entypo } from "@expo/vector-icons";

import { BarChart } from "react-native-chart-kit";
import { supabase } from "../../../utils/supabase";

const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const Overview = () => {
	const { session } = useUser();
	const [currentDate, setCurrentDate] = useState(new Date());
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [
			{
				data: [], // total_spent_month values
			},
			{
				data: [], // total_budget_month values
			},
		],
	});

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
		if (session) {
			fetchMonthlyBudgets();
		}
	}, [session, currentDate]);

	const calculateMonths = () => {
		const currentMonth = new Date().getMonth() + 1;
		const currentYear = new Date().getFullYear();
		let monthsToFetch = [];
		for (let i = -2; i <= 2; i++) {
			let month = currentMonth + i;
			let year = currentYear;
			if (month < 1) {
				month += 12;
				year--;
			} else if (month > 12) {
				month -= 12;
				year++;
			}
			monthsToFetch.push({ month, year });
		}
		return monthsToFetch;
	};

	const fetchMonthlyBudgets = async () => {
		const userId = session?.user?.id;
		const monthsToFetch = calculateMonths();

		try {
			const promises = monthsToFetch.map(({ month, year }) =>
				supabase
					.from("monthly_budgets")
					.select("total_spent_month, total_budget_month")
					.eq("user_id", userId)
					.eq("month", month)
					.eq("year", year)
					.single()
			);

			const results = await Promise.all(promises);

			const labels = [];
			const dataSpent = [];
			const dataBudget = [];

			results.forEach((result, index) => {
				// Shortening month and year in the graph:
				const monthName = MONTH_NAMES[monthsToFetch[index].month - 1].substring(0, 3);
				const yearShort = monthsToFetch[index].year.toString().substring(2);
				const label = `${monthName} '${yearShort}`;

				if (result.data) {
					labels.push(label);
					dataSpent.push(result.data.total_spent_month || 0);
					dataBudget.push(result.data.total_budget_month || 0);
				} else {
					labels.push(label);
					dataSpent.push(0);
					dataBudget.push(0);
				}
			});

			setChartData({
				labels,
				datasets: [{ data: dataSpent }, { data: dataBudget }],
			});
		} catch (error) {
			console.error("Error fetching monthly budgets:", error.message);
		}
	};

	return (
		<View style={styles.container}>
			<OverviewHeader session={session} />
			<View style={styles.graphContainer}>
				<BarChart
					data={chartData}
					width={Dimensions.get("window").width - 16}
					height={220}
					chartConfig={{
						// backgroundColor: colors.WHITE,
						backgroundGradientFrom: colors.RED,
						backgroundGradientTo: colors.RED,
						decimalPlaces: 1,
						labelColor: (opacity = 1) => colors.BLACK,
						color: (opacity = 1) => colors.BLACK,
						style: {
							alignSelf: "center",
						},
						barPercentage: 0.6,
					}}
					fromZero={true}
					showBarTops={true}
					withInnerLines={false}
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
		justifyContent: "space-between",
		marginHorizontal: "5%",
		marginTop: "5%",
		padding: 20,
		borderRadius: 15,
		backgroundColor: colors.WHITE,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1,
	},
});

export default Overview;
