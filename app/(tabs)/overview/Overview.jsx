import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useUser } from "../../../context/UserContext";
// import { RefreshControl } from "react-native";
import OverviewHeader from "./header/OverviewHeader";
import LineGraph from "./components/LineGraph";
import LatestExpenses from "./components/LatestExpenses";

const Overview = ({ navigation }) => {
	const { session } = useUser();

	return (
		<ScrollView style={styles.container}>
			<OverviewHeader session={session} />
			<LineGraph />

			<View style={styles.subContainer}></View>

			<LatestExpenses navigation={navigation} />
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
	graphContainer: {
		flex: 1,
	},
});

export default Overview;
