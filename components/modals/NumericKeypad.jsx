import React from "react";
import { StyleSheet, View, Modal, Text, TouchableOpacity } from "react-native";
import colors from "../../constants/colors";

const NumericKeypad = ({ keypadVisible, amount, setAmount, onClose }) => {
	const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "⌫"];

	const handleKeyPress = (key) => {
		if (key === "⌫") {
			setAmount((prev) => {
				let updated = prev.slice(0, -1);
				if (!updated.includes(",")) {
					return formatNumber(updated.replace(/[^0-9]/g, ""));
				}
				return updated;
			});
		} else if (key === ",") {
			if (amount.length > 0 && !amount.includes(",")) {
				setAmount((prev) => prev + key);
			}
		} else {
			let newValue = amount + key;
			if (amount.includes(",")) {
				const parts = amount.split(",");
				if (parts[1] && parts[1].length >= 2) return;
				newValue = amount + key;
			} else {
				let rawDigits = newValue.replace(/[^0-9]/g, "");
				if (rawDigits.length > 9) return;
			}
			if (!newValue.includes(",")) {
				newValue = formatNumber(newValue.replace(/[^0-9]/g, ""));
			}
			setAmount(newValue);
		}
	};

	const formatNumber = (numberString) => {
		return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	};

	return (
		<Modal
			visible={keypadVisible}
			animationType="fade"
			transparent={true}
			onRequestClose={onClose} // Android
		>
			<TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={onClose}>
				<View style={styles.keypadModal} onStartShouldSetResponder={() => true}>
					{keys.map((key, index) => (
						<TouchableOpacity key={index} style={styles.key} onPress={() => handleKeyPress(key)}>
							<Text style={styles.keyText}>{key}</Text>
						</TouchableOpacity>
					))}
				</View>
			</TouchableOpacity>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "flex-end",
	},
	// modalOverlay: {
	// 	flex: 1,
	// 	alignItems: "center",
	// 	justifyContent: "flex-end",
	// 	backgroundColor: "rgba(0, 0, 0, 0.5)",
	// },
	keypadModal: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		padding: "5%",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		backgroundColor: colors.WHITE,
	},
	key: {
		alignItems: "center",
		justifyContent: "center",
		width: "33%",
		padding: "5%",
	},
	keyText: {
		fontSize: 24,
		color: colors.BLACK,
	},
});

export default NumericKeypad;
