import React from "react";
import { StyleSheet, View, Modal, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import colors from "../../utils/colors";

const PickerWheel = ({ pickerVisible, items, selectedValue, onValueChange, onClose }) => {
	return (
		<Modal
			visible={pickerVisible}
			animationType="fade"
			transparent={true}
			onRequestClose={onClose} // Android
		>
			<TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={onClose}>
				<View style={styles.pickerModal} onStartShouldSetResponder={() => true}>
					<Picker style={styles.picker} selectedValue={selectedValue} onValueChange={onValueChange}>
						{items.map((item) => (
							<Picker.Item key={item.id} label={item.name} value={item.id} />
						))}
					</Picker>
				</View>
			</TouchableOpacity>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-end",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	pickerModal: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		backgroundColor: colors.WHITE,

		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
	},
	picker: {
		width: "100%",
	},
});

export default PickerWheel;
