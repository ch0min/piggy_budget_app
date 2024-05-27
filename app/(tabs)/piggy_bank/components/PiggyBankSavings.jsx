import React, { useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useAuth } from "../../../../contexts/AuthContext";
import colors from "../../../../constants/colors";
import SadPiggy from "../../../../assets/images/sad_piggy.png";
import HappyPiggy from "../../../../assets/images/happy_piggy.png";
import Coins from "../../../../assets/images/coins2.png";

const PiggyBankSavings = ({ totalSavings, getTotalPiggyBankSavings }) => {
	const { userProfile } = useAuth();

	useEffect(() => {
		getTotalPiggyBankSavings();
	}, [totalSavings]);

	const borderColor = totalSavings >= 0 ? colors.DARKGREEN : colors.RED;
	const piggyImage = totalSavings >= 0 ? HappyPiggy : SadPiggy;
	const piggyMessage = totalSavings >= 0 ? "Din sparegris er glad!" : "Din sparegris er flad..";

	const getSavingsTextStyle = () => {
		if (totalSavings >= 0) {
			return [styles.savingsText, styles.positiveSavings];
		} else if (totalSavings < 0) {
			return [styles.savingsText, styles.negativeSavings];
		}
		return styles.savingsText;
	};

	const formatSavings = () => {
		if (totalSavings !== 0) {
			const sign = totalSavings > 0 ? "+" : "-";
			return `${sign}${Math.abs(totalSavings)} ${userProfile.valuta.name}`;
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.contentContainer}>
				<View style={styles.circleContainer}>
					<Text style={styles.heading}>Din opsparing</Text>
					<Text style={styles.subHeading}>Siden du kom med ombord har du sparet:</Text>

					<View style={[styles.circle, { borderColor: borderColor }]}>
						<Text style={getSavingsTextStyle()}>{formatSavings()}</Text>
					</View>
				</View>

				<View style={styles.piggyContainer}>
					<View style={styles.bubble}>
						<Text style={styles.piggyMessage}>{piggyMessage}</Text>
						<View style={styles.bubbleTail} />
					</View>
					<View style={styles.imageContainer}>
						<Image source={Coins} style={styles.coinsImage} />
						<Image source={piggyImage} style={styles.piggyImage} />
					</View>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: "8%",
	},
	heading: {
		marginTop: "10%",
		fontSize: 24,
		fontWeight: "bold",
		color: colors.WHITE,
	},
	subHeading: {
		marginBottom: "5%",
		fontSize: 16,
		color: colors.WHITE,
	},
	contentContainer: {
		// flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "100%",
	},
	circleContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	circle: {
		alignItems: "center",
		justifyContent: "center",
		width: 200,
		height: 200,
		borderRadius: 100,
		borderWidth: 10,
		borderColor: colors.BLACK,
		backgroundColor: "transparent",

		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1,
	},
	savingsText: {
		fontSize: 24,
		fontWeight: "bold",
		color: colors.BLACK,
	},
	positiveSavings: {
		color: colors.GREEN,
	},
	negativeSavings: {
		color: colors.DARKRED,
	},
	imageContainer: {
		flexDirection: "column",
		alignItems: "center",
	},
	coinsImage: {
		marginTop: "5%",
		width: 50,
		height: 50,
		resizeMode: "contain",
	},
	piggyImage: {
		marginTop: "-5%",
		width: 150,
		height: 150,
		resizeMode: "contain",
	},
	piggyContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	piggyMessage: {
		textAlign: "center",
		fontSize: 16,
		color: colors.BLACK,
	},
	bubble: {
		position: "relative",
		borderRadius: 20,
		paddingHorizontal: "5%",
		paddingVertical: "10%",
		borderWidth: 1,
		borderColor: colors.WHITE,
		backgroundColor: colors.WHITE,

		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1,
	},
	bubbleTail: {
		position: "absolute",
		top: "50%",
		right: -10,
		borderTopWidth: 20,
		borderBottomWidth: 10,
		borderLeftWidth: 10,
		borderTopColor: "transparent",
		borderBottomColor: "transparent",
		borderLeftColor: colors.WHITE,
		transform: [{ translateY: -30 }],
	},
});

export default PiggyBankSavings;
