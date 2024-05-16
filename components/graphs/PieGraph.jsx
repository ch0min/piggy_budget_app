import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useUser } from "../../context/UserContext";
import PieChart from "react-native-pie-chart";
import colors from "../../utils/colors";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import FormatNumber from "../../utils/formatNumber";

const PieGraph = ({ expenseAreas, expenses }) => {
	const { userProfile } = useUser();
	const size = 120;
	const [values, setValues] = useState([]);
	const [sliceColor, setSliceColor] = useState([]);
	const [totalCalcEstimate, setTotalCalcEstimate] = useState(0);
	const [plannedTotalMaxBudget, setPlannedTotalMaxBudget] = useState(0);
	const [toggleAllAreas, setToggleAllAreas] = useState(false);

	useEffect(() => {
		if (expenseAreas.length > 0) {
			const values = [];
			const sliceColor = [];
			let total = 0;

			expenseAreas.forEach((area, index) => {
				const budget = area.total_budget || 0;
				if (budget > 0) {
					values.push(budget);
					sliceColor.push(colors.COLOR_LIST[index % colors.COLOR_LIST.length]);
					total += budget;
				}
			});

			if (total > 0) {
				setValues(values);
				setSliceColor(sliceColor);
				setTotalCalcEstimate(total);
			} else {
				handleNoData();
			}
		} else {
			handleNoData();
		}
	}, [expenseAreas]);

	useEffect(() => {
		calculatePlannedTotalExpenses();
	}, [expenseAreas]);

	const handleNoData = () => {
		setValues([1]);
		setSliceColor([colors.GRAY]);
		setTotalCalcEstimate(0);
	};

	const calculatePlannedTotalExpenses = () => {
		const maxBudget = expenses.reduce((acc, exp) => acc + parseFloat(exp.max_budget || 0), 0);

		setPlannedTotalMaxBudget(maxBudget);
	};

	const toggleShowAllAreas = () => {
		setToggleAllAreas(!toggleAllAreas);
	};

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
					<Text>No Expense Areas Available</Text>
				)}
				<View style={styles.legendContainer}>
					<Text style={styles.legendHeading}>Planned total budget</Text>
					<Text style={styles.legendTotalBudget}>
						{FormatNumber(plannedTotalMaxBudget)} {userProfile.valutaName}
					</Text>
					<Text style={styles.legendSubHeading}>
						<Text style={{ fontSize: 14, fontStyle: "italic", color: colors.DARKGRAY }}>You've spent: </Text>
						{FormatNumber(totalCalcEstimate)} {userProfile.valutaName}
					</Text>
				</View>
			</View>

			{expenseAreas.slice(0, toggleAllAreas ? expenseAreas.length : 3).map((area, index) => {
				const percentage = totalCalcEstimate > 0 ? ((area.total_budget || 0) / totalCalcEstimate) * 100 : 0;

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
								{totalCalcEstimate > 0 && (
									<Text style={{ color: colors.SILVER }}> ({percentage.toFixed(0)}%)</Text>
								)}
							</Text>
							<Text style={styles.chartNameTotalBudgetText}>
								{FormatNumber(area.total_budget || 0)} {userProfile.valutaName}
							</Text>
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
		gap: "25%",
	},
	legendContainer: {
		flex: 1,
		alignItems: "flex-start",
		justifyContent: "center",
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
		fontSize: 16,
		color: colors.BLACK,
	},
	chartNameContainer: {
		display: "flex",
		flexDirection: "row",
		alignContent: "center",
		justifyContent: "flex-start",
		marginTop: "3%",
		gap: "5%",
	},
	chartNameTextContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	chartNameText: {
		marginTop: "1%",
	},
	chartNameTotalBudgetText: {
		marginTop: "1%",
		fontWeight: "bold",
	},
	caretIcons: {
		flex: 1,
		alignSelf: "center",
		marginTop: "3%",
	},
});

export default PieGraph;
