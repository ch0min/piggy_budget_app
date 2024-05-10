import React from "react";
import { StyleSheet, View, ScrollView, Modal, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import colors from "../../utils/colors";
import { FontAwesome } from "@expo/vector-icons";

const IconPicker = ({ iconPickerVisible, icons, handleIconSelect, onClose }) => {
	return (
		<Modal
			visible={iconPickerVisible}
			transparent={true}
			onRequestClose={onClose} // Android
		>
			<TouchableOpacity style={styles.modalOverlay} onPressOut={onClose}>
				<View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
					<ScrollView
						horizontal={false}
						contentContainerStyle={styles.iconPickerModal}
						onStartShouldSetResponder={() => true}
					>
						<View style={styles.iconGrid}>
							{icons.map((icon) => (
								<TouchableOpacity style={styles.icon} key={icon} onPress={() => handleIconSelect(icon)}>
									<FontAwesome name={icon} size={24} color={colors.BLACK} />
								</TouchableOpacity>
							))}
						</View>
					</ScrollView>
				</View>
			</TouchableOpacity>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		justifyContent: "flex-end",
	},
	modalContainer: {
		maxHeight: "30%",
		padding: 20,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		backgroundColor: colors.WHITE,
	},
	iconPickerModal: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
	},
	iconGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	icon: {
		alignItems: "center",
		justifyContent: "center",
		width: 50,
		height: 50,
		margin: "3%",
	},
});

export default IconPicker;
