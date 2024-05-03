import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Text, Button } from "react-native";
import { supabase } from "../../../utils/supabase";
import colors from "../../../utils/colors";
// import { RefreshControl } from "react-native";
import OverviewHeader from "../../../components/headers/OverviewHeader";
import PieGraph from "../../../components/graphs/PieGraph";

import { Ionicons } from "@expo/vector-icons";

const Overview = ({ session }) => {
	const [loading, setLoading] = useState(false);
	const [categoriesList, setCategoriesList] = useState([]);

	useEffect(() => {
		getCategoriesList();
	}, [session]);

	const getCategoriesList = async () => {
		setLoading(true);
		if (!session?.user) throw new Error("No user on the session!");

		const userEmail = session.user.email;
		const { data, error } = await supabase.from("categories").select(`*`).eq("created_by", userEmail);

		if (error) {
			console.log("Error fetching categories:", error.message);
			setLoading(false);
			return;
		}

		console.log("Data", data);
		setCategoriesList(data);
		setLoading(false);
	};

	return (
		<View style={styles.container}>
			{/* <ScrollView refrefreshControl={<RefreshControl onRefresh={() => getCategoriesList()} refreshing={loading} />}> */}

			<OverviewHeader session={session} />

			<View style={styles.graphContainer}>
				<PieGraph categoriesList={categoriesList} />
			</View>
			{/* </ScrollView> */}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	// subContainer: {
	// 	flex: 1,
	// },
	graphContainer: {
		marginTop: -75,
		padding: 20,
	},
});

export default Overview;
