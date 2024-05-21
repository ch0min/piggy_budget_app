import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import { useUser } from "../../../../context/UserContext";
import colors from "../../../../constants/colors";
import FormatNumber from "../../../../utils/formatNumber";
import { FontAwesome } from "@expo/vector-icons";

const LatestExpenses = ({ navigation }) => {
	const { session, userProfile, loadingData, setLoadingData, expenses, getLatestExpenses } = useUser();

	useFocusEffect(
		useCallback(() => {
			if (session) {
				setLoadingData(true);
				getLatestExpenses().finally(() => setLoadingData(false));
			}
		}, [session])
	);

	const handleExpense = (exp) => {
		navigation.navigate("Expenses", { selectedExpense: exp });
	};

	const renderLatestExpenses = ({ item }) => (
		<TouchableOpacity style={styles.latestExpensesContainer} onPress={() => handleExpense(item)}>
			<View style={[styles.latestExpensesIcon, { backgroundColor: item.color }]}>
				<FontAwesome name={item.icon} size={14} color={colors.WHITE} />
			</View>
			<View style={styles.latestExpensesTextContainer}>
				<Text style={styles.latestExpensesName}>{item.name}</Text>
				<View style={styles.latestExpensesBudgetNameBox}>
					<Text style={styles.latestExpensesTotalSpent}>
						{item.total_spent_expense > 0 ? (
							`-${FormatNumber(item.total_spent_expense)} ${userProfile.valutaName}`
						) : (
							<Text style={{ color: colors.BLACK }}>0 {userProfile.valutaName}</Text>
						)}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<View style={styles.LatestTransactionsContainer}>
				<Text style={styles.LatestTransactionHeading}>Seneste udgifter</Text>
				<View style={styles.horizontalLine} />
				{loadingData ? (
					<ActivityIndicator size="large" style={{ marginVertical: "31%" }} color={colors.DARKGRAY} />
				) : (
					<FlatList
						data={expenses}
						renderItem={renderLatestExpenses}
						keyExtractor={(exp) => `${exp.id}`}
						scrollEnabled={false}
						ListEmptyComponent={
							<Text style={{ marginTop: "5%", marginLeft: "4%" }}>No expenses found for this area.</Text>
						}
					/>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	horizontalLine: {
		borderBottomWidth: 1,
		borderBottomColor: colors.LIGHT,
		opacity: 0.5,
	},
	LatestTransactionsContainer: {
		flex: 1,
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
	LatestTransactionHeading: {
		marginLeft: "3%",
		marginBottom: "4%",
		fontSize: 20,
		fontWeight: "bold",
	},
	latestExpensesContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		marginHorizontal: "1.5%",
		padding: "1%",

		borderBottomWidth: 0.5,
		borderBottomColor: colors.LIGHT,
	},
	latestExpensesTextContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	latestExpensesName: {
		flexShrink: 1,
		fontSize: 16,
	},
	latestExpensesBudgetNameBox: {
		flexDirection: "row",
		marginVertical: "2%",
		padding: "3%",
		borderRadius: 5,
		// backgroundColor: "#F4F4F4",
	},
	latestExpensesTotalSpent: {
		flexShrink: 1,
		fontSize: 14,
		color: colors.SECONDARY,
	},
	latestExpensesTotalBudgetExpenseName: {
		flexShrink: 1,
		fontSize: 16,
	},
	latestExpensesIcon: {
		alignItems: "center",
		justifyContent: "center",
		marginRight: "3%",
		width: 30,
		height: 30,
		borderRadius: 37.5,
	},
});

export default LatestExpenses;
