import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import colors from "../../../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import coins from "../../../../assets/images/coins.png";
import coins2 from "../../../../assets/images/coins2.png";
import coins3 from "../../../../assets/images/coins3.png";

const Bubble = () => {
	return (
		<View style={styles.container}>
			<LinearGradient
				colors={[colors.SECONDARY, colors.TERTIARY, colors.PRIMARY]}
				locations={[0.5, 0.7, 1.0]}
				style={styles.bubble}
			>
				<View style={styles.iconsContainer}>
					<Image source={coins} style={styles.coinsIcon} />
					<Image source={coins2} style={styles.coins2Icon} />
					<Image source={coins3} style={styles.coins3Icon} />
				</View>
			</LinearGradient>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	bubble: {
		width: 500,
		height: 250,
		borderRadius: 120,
		backgroundColor: colors.SECONDARY,
	},
	iconsContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		marginTop: "15%",
		padding: 10,
	},
	coinsIcon: {
		width: 50,
		height: 50,
		marginTop: "10%",
		marginLeft: "10%",
		opacity: 0.7,
	},
	coins2Icon: {
		width: 70,
		height: 70,
		opacity: 0.7,
	},
	coins3Icon: {
		width: 50,
		height: 50,
		marginTop: "10%",
		marginRight: "10%",
		opacity: 0.7,
	},
});

export default Bubble;
