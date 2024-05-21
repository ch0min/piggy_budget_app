import React, { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, StyleSheet, View, ScrollView } from "react-native";
import { useUser } from "../../../context/UserContext";
import colors from "../../../constants/colors";
import OverviewHeader from "./header/OverviewHeader";
import LineGraph from "./components/LineGraph";
import LatestExpenses from "./components/LatestExpenses";

const Overview = ({ navigation }) => {
	const {} = useUser();
	const [loadingOverview, setLoadingOverview] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setLoadingOverview(false);
		}, 1000);
	}, []);

	return (
		<View style={styles.container}>
			{loadingOverview ? (
				<ActivityIndicator size="large" style={{ marginVertical: "75%" }} color={colors.DARKGRAY} />
			) : (
				<View style={styles.subContainer}>
					<OverviewHeader />

					<LineGraph />
					<ScrollView style={styles.scrollContainer}>
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
		flex: 1,
	},
});

export default Overview;
