import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../../../../contexts/AuthContext";
import { useMonthly } from "../../../../contexts/MonthlyContext";
import PieChart from "react-native-pie-chart";
import colors from "../../../../constants/colors";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import FormatNumber from "../../../../utils/formatNumber";

const PieGraph = ({ expenseAreas, expenses }) => {
	const { userProfile } = useAuth();
	const {
		loadingData,
		setLoadingData,
		totalSpentMonth,
		setTotalSpentMonth,
		totalBudgetMonth,
		setTotalBudgetMonth,
		getMonthlyBudget,
	} = useMonthly();
	const isFocused = useIsFocused(); // Checking if the screen is focused.

	const size = 120;
	const [values, setValues] = useState([1]);
	const [sliceColor, setSliceColor] = useState([colors.GRAY]);
	const [toggleAllAreas, setToggleAllAreas] = useState(false);

	useEffect(() => {
		if (isFocused) {
			setLoadingData(true);
			const fetchData = async () => {
				calculatePieGraph();
				getMonthlyBudget();
				setLoadingData(false);
			};
			fetchData();
		}
	}, [isFocused, expenseAreas, totalBudgetMonth]);
	// }, [expenseAreas, totalBudgetMonth]);

	const calculateAreaSpentAmount = (areaId) => {
		return expenses
			.filter((exp) => exp.expense_areas_id === areaId)
			.reduce((total, exp) => total + exp.total_spent_expense, 0);
	};

	const remainingBudgetLeft = totalBudgetMonth - totalSpentMonth;

	const calculatePieGraph = () => {
		if (expenseAreas.length > 0) {
			const newValues = [];
			const newSliceColor = [];
			let totalSpent = 0;

			expenseAreas.forEach((area, index) => {
				const spentAmount = calculateAreaSpentAmount(area.id) || 0;
				if (spentAmount > 0) {
					newValues.push(spentAmount);
					newSliceColor.push(colors.COLOR_LIST[index % colors.COLOR_LIST.length]);
					totalSpent += spentAmount;
				}
			});

			if (totalBudgetMonth > totalSpent) {
				newValues.push(totalBudgetMonth - totalSpent);
				newSliceColor.push(colors.GRAY);
			}

			setTotalSpentMonth(totalSpent);
			setValues(newValues);
			setSliceColor(newSliceColor);
		} else {
			handleNoData();
		}
		getMonthlyBudget();
	};

	const handleNoData = () => {
		setValues([100]);
		setSliceColor([colors.GRAY]);
		setTotalSpentMonth(0);
		setTotalBudgetMonth(0);
	};

	const toggleShowAllAreas = () => {
		setToggleAllAreas(!toggleAllAreas);
	};

	if (loadingData) {
		return (
			<ActivityIndicator size="large" style={{ marginTop: "30%", marginBottom: "40%" }} color={colors.DARKGRAY} />
		);
	}

	return (
		<TouchableOpacity style={styles.container} onPress={toggleShowAllAreas}>
			<View style={styles.subContainer}>
				{values.length > 0 && values.reduce((acc, total) => acc + total, 0) > 0 ? (
					<PieChart
						style={styles.pieChart}
						widthAndHeight={size}
						series={values}
						sliceColor={sliceColor}
						coverRadius={0.65}
					/>
				) : (
					<PieChart
						style={styles.pieChart}
						widthAndHeight={size}
						series={[100]}
						sliceColor={[colors.GRAY]}
						coverRadius={0.65}
					/>
				)}
				<View style={styles.legendContainer}>
					<Text style={styles.legendHeading}>Planlagt total budget</Text>
					<Text style={styles.legendTotalBudget}>
						{FormatNumber(totalBudgetMonth)} {userProfile.valutaName}
					</Text>
					<Text style={styles.legendSubHeading}>
						{FormatNumber(remainingBudgetLeft)} {userProfile.valutaName}
						<Text style={{ fontSize: 14, color: colors.DARKGRAY }}> tilbage</Text>
					</Text>
				</View>
			</View>

			{expenseAreas.slice(0, toggleAllAreas ? expenseAreas.length : 3).map((area, index) => {
				const actualAreaSpentAmount = calculateAreaSpentAmount(area.id);
				const percentage = totalBudgetMonth > 0 ? ((actualAreaSpentAmount || 0) / totalBudgetMonth) * 100 : 0;

				return (
					<View key={index} style={styles.chartNameContainer}>
						<MaterialCommunityIcons
							name="square-rounded"
							size={24}
							color={colors.COLOR_LIST[index % colors.COLOR_LIST.length]}
						/>
						<View style={styles.chartNameTextContainer}>
							<Text style={styles.chartNameText}>
								{area.name}
								{totalSpentMonth > 0 && (
									<Text style={{ color: colors.SILVER }}> ({percentage.toFixed(0)}%)</Text>
								)}
							</Text>
							{actualAreaSpentAmount > 0 ? (
								<Text style={styles.chartNameTotalBudgetText}>
									-{FormatNumber(actualAreaSpentAmount)} {userProfile.valutaName}
								</Text>
							) : (
								<Text style={styles.chartNameTotalBudgetTextNull}>0 {userProfile.valutaName}</Text>
							)}
						</View>
					</View>
				);
			})}

			{toggleAllAreas ? (
				<FontAwesome style={styles.caretIcons} name="angle-double-up" size={22} color={colors.DARKGRAY} />
			) : (
				<FontAwesome style={styles.caretIcons} name="angle-double-down" size={22} color={colors.DARKGRAY} />
			)}
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
	pieChart: {
		marginBottom: "3%",
	},
	heading: {
		fontSize: 20,
	},
	subContainer: {
		flex: 1,
		flexDirection: "row",
	},
	legendContainer: {
		flex: 1,
		alignItems: "flex-start",
		justifyContent: "center",
		marginLeft: "10%",
	},
	legendHeading: {
		textTransform: "uppercase",
		fontSize: 12,
		color: colors.DARKGRAY,
	},
	legendTotalBudget: {
		fontSize: 30,
		fontWeight: "bold",
		color: colors.BLACK,
	},
	legendSubHeading: {
		fontSize: 14,
		color: colors.BLACK,
	},
	chartNameContainer: {
		display: "flex",
		flexDirection: "row",
		alignContent: "center",
		justifyContent: "flex-start",
		marginTop: "3%",
	},
	chartNameTextContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	chartNameText: {
		marginTop: "1%",
		marginLeft: "1%",
	},
	chartNameTotalBudgetText: {
		marginTop: "1%",
		fontWeight: "bold",
		color: colors.RED,
	},
	chartNameTotalBudgetTextNull: {
		marginTop: "1%",
		fontWeight: "bold",
		color: colors.BLACK,
	},
	caretIcons: {
		flex: 1,
		alignSelf: "center",
		marginTop: "3%",
	},
});

export default PieGraph;
