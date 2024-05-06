import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import PieChart from "react-native-pie-chart";
import colors from "../../utils/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PieGraph = ({ categoriesList }) => {
	const [values, setValues] = useState([1]);
	const [sliceColor, setSliceColor] = useState([colors.GRAY]);
	const [totalCalcEstimate, setTotalCalcEstimate] = useState(0);
	const size = 150;

	// useEffect(() => {
	// 	updatePieChart();
	// }, []);

	// const updatePieChart = () => {
	// 	let totalEstimates = 0;
	// 	let otherCost = 0;
	// 	setValues([]);
	// 	setSliceColor([]);

	// };

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>
				Total Estimate : <Text>${totalCalcEstimate}</Text>
			</Text>

			<View style={styles.subContainer}>
				<PieChart
					widthAndHeight={size}
					series={values}
					sliceColor={sliceColor}
					coverRadius={0.65}
					coverFill={colors.WHITE}
				/>

				{categoriesList?.length === 0 ? (
					<View style={styles.chartNameContainer}>
						<MaterialCommunityIcons name="checkbox-blank-circle" size={24} color={colors.GRAY} />
						<Text>NA</Text>
					</View>
				) : (
					<View>
						{categoriesList?.map(
							(category, index) =>
								index <= 4 && (
									<View key={index} style={styles.chartNameContainer}>
										<MaterialCommunityIcons
											name="checkbox-blank-circle"
											size={24}
											color={colors.COLOR_LIST[index]}
										/>
										<Text>{index < 4 ? category.name : "Other"}</Text>
									</View>
								)
						)}
					</View>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: "flex",
		marginTop: "5%",
		backgroundColor: colors.WHITE,
		padding: 20,
		borderRadius: 15,
		elevation: 1,

		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1,
	},
	heading: {
		fontSize: 20,
	},
	subContainer: {
		display: "flex",
		flexDirection: "row",
		marginTop: 10,
		gap: 40,
	},
	chartNameContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
	},
});

export default PieGraph;
