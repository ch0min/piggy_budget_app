import React, { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, StyleSheet, View, ScrollView } from "react-native";
import colors from "../../../constants/colors";
import OverviewHeader from "./header/OverviewHeader";
import LineGraph from "./components/LineGraph";
import PiggyBankGoal from "../piggy_bank/components/PiggyBankGoal";
import LatestExpenses from "./components/LatestExpenses";

const Overview = ({ navigation }) => {
	const [loadingOverview, setLoadingOverview] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setLoadingOverview(false);
		}, 1000);
	}, []);

	return (
		<View style={styles.container}>
			{loadingOverview ? (
				<ActivityIndicator size="large" style={{ marginVertical: "70%" }} color={colors.DARKGRAY} />
			) : (
				<View style={styles.subContainer}>
					<OverviewHeader navigation={navigation} />

					<LineGraph />

					<ScrollView style={styles.scrollContainer}>
						<PiggyBankGoal />

						<LatestExpenses navigation={navigation} />
					</ScrollView>
				</View>
			)}
		</View>
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
	},
});

export default Overview;
