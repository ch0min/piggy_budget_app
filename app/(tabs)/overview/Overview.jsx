import React, { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, RefreshControl, StyleSheet, View, ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import { useMonthly } from "../../../contexts/MonthlyContext";
import colors from "../../../constants/colors";
import OverviewHeader from "./header/OverviewHeader";
import LineGraph from "./components/LineGraph";
import PiggyBankGoal from "../piggy_bank/components/PiggyBankGoal";
import LatestExpenses from "./components/LatestExpenses";

const Overview = ({ navigation }) => {
	const { user, userProfile, getProfile } = useAuth();
	const { currentMonth, getMonthlyBudgetLineChart, getMonthlyBudget, getMonthlyGoal } = useMonthly();
	const isFocused = useIsFocused();
	const [loadingOverview, setLoadingOverview] = useState(true);
	const [refresh, setRefresh] = useState(false);

	const onRefresh = useCallback(async () => {
		setRefresh(true);
		setLoadingOverview(true);
		setTimeout(() => {
			setLoadingOverview(false);
			setRefresh(false);
		}, 1000);
	}, []);

	useEffect(() => {
		setLoadingOverview(true);
		if (!userProfile && user) {
			getProfile(user.id);
			setTimeout(() => {
				setLoadingOverview(false);
			}, 1000);
		}
	}, [user, userProfile]);

	useEffect(() => {
		const fetchMonthlyBudgetAndGoalAndLineChart = async () => {
			await getMonthlyBudgetLineChart();
			await getMonthlyBudget();
			await getMonthlyGoal();
		};

		if (isFocused && userProfile && user && currentMonth) {
			fetchMonthlyBudgetAndGoalAndLineChart();
		}
	}, [isFocused, user, currentMonth]);

	return (
		<ScrollView
			style={styles.container}
			refreshControl={
				<RefreshControl
					refreshing={refresh}
					onRefresh={onRefresh}
					colors={[colors.DARKGRAY]}
					tintColor={colors.DARKGRAY}
				/>
			}
		>
			{/* {loadingOverview ? (
				<ActivityIndicator size="large" style={{ marginVertical: "70%" }} color={colors.DARKGRAY} />
			) : ( */}
			<View style={styles.subContainer}>
				<OverviewHeader navigation={navigation} />

				<LineGraph />

				<ScrollView style={styles.scrollContainer}>
					<PiggyBankGoal />

					<LatestExpenses navigation={navigation} />
				</ScrollView>
			</View>
			{/* )} */}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	subContainer: {
		flex: 1,
	},
	scrollContainer: {
		flex: 2,
		marginTop: "5%",
	},
});

export default Overview;
