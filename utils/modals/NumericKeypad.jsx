import React from "react";
import { StyleSheet, View, Modal, Text, TouchableOpacity } from "react-native";
import colors from "../colors";

const NumericKeypad = ({ keypadVisible, handleKeyPress, onClose }) => {
	const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"];

	return (
		<Modal
			visible={keypadVisible}
			animationType="slide"
			transparent={true}
			onRequestClose={onClose} // Android
		>
			<TouchableOpacity style={styles.modalContainer} onPressOut={onClose}>
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
	keypadModal: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		padding: "5%",
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
