import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import colors from "../../../../constants/colors";
import MONTH_NAMES from "../../../../constants/months";

const MonthlyBudgetSwiper = ({ currentMonth, setCurrentMonth }) => {
	const changeMonth = (increment) => {
		let newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1);
		setCurrentMonth(newMonth);
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.btn} onPress={() => changeMonth(-1)}>
				<Entypo name="chevron-thin-left" size={22} color={colors.BLACK} />
			</TouchableOpacity>
			<Text style={styles.monthText}>
				{MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
			</Text>
			<TouchableOpacity style={styles.btn} onPress={() => changeMonth(1)}>
				<Entypo name="chevron-thin-right" size={22} color={colors.BLACK} />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: "5%",
		marginHorizontal: "5%",
		borderRadius: 20,

		backgroundColor: colors.WHITE,

		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1,
	},
	btn: {
		padding: "5%",
	},
	buttonText: {
		fontSize: 18,
		color: colors.BLACK,
	},
	monthText: {
		fontSize: 18,
		color: colors.BLACK,
	},
});

export default MonthlyBudgetSwiper;
