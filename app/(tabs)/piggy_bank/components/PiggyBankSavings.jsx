import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import colors from "../../../../constants/colors";
import { useAuth } from "../../../../contexts/AuthContext";
import { useMonthly } from "../../../../contexts/MonthlyContext";

const PiggyBankSavings = ({ totalSavings }) => {

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Din opsparing</Text>
			<Text style={styles.heading}>${totalSavings}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	LatestTransactionHeading: {},
});

export default PiggyBankSavings;
