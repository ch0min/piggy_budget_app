import React, { useState, useEffect } from "react";
import {
	Alert,
	ActivityIndicator,
	StyleSheet,
	View,
	Modal,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
} from "react-native";
import colors from "../../../../constants/colors";
import { FontAwesome, MaterialIcons, AntDesign } from "@expo/vector-icons";

const CreateOrUpdateGoalModal = ({
	loading,
	goalModalVisible,
	goalName,
	setGoalName,
	savingsGoal,
	setSavingsGoal,
	previewImage,
	onImagePicker,
	handleSaveGoal,
	imagePlaceholder,
	onClose,
}) => {
	const handleSave = async () => {
		handleSaveGoal();
	};

	return (
		<Modal visible={goalModalVisible} animationType="fade" transparent={true} onRequestClose={onClose}>
			<TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
				<View style={styles.modalContent}>
					<View style={styles.goalModalContainer}>
						<View style={styles.goalNameContainer}>
							<TextInput
								style={styles.goalNameInput}
								placeholder="Dit mål"
								placeholderTextColor={colors.DARKGRAY}
								onChangeText={setGoalName}
								value={goalName}
							/>
							<MaterialIcons name="edit" size={24} color={colors.GRAY} />
						</View>

						<TextInput
							style={styles.savingsGoalInput}
							placeholder="Opsparingsmål"
							placeholderTextColor={colors.DARKGRAY}
							onChangeText={setSavingsGoal}
							value={savingsGoal}
							inputMode="decimal"
						/>

						<TouchableOpacity onPress={() => onImagePicker()}>
							{previewImage === imagePlaceholder ? (
								<View style={[styles.imageInput, styles.imagePlaceholder]}>
									<FontAwesome name="image" size={60} color={colors.DARKGRAY} />
								</View>
							) : (
								<Image source={{ uri: previewImage || imagePlaceholder }} style={styles.imageInput} />
							)}
						</TouchableOpacity>

						<TouchableOpacity style={styles.saveButton} onPress={handleSave}>
							{loading ? (
								<ActivityIndicator size="small" style={{ marginVertical: "2%" }} color={colors.DARKGRAY} />
							) : (
								<AntDesign name="check" size={34} color={colors.BLACK} />
							)}
						</TouchableOpacity>
					</View>
				</View>
			</TouchableOpacity>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		alignItems: "center",
		marginHorizontal: "8%",
		width: "90%",
		marginBottom: "50%",
		padding: "5%",
		borderRadius: 15,
		backgroundColor: colors.WHITE,

		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1,
	},
	goalModalContainer: {
		width: "100%",
	},
	goalNameContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	goalNameInput: {
		width: "90%",
		fontSize: 18,
		color: colors.BLACK,
	},
	savingsGoalInput: {
		marginTop: "5%",
		paddingVertical: "5%",
		fontSize: 14,
		color: colors.BLACK,
		borderTopWidth: 1,
		borderTopColor: colors.GRAY,
		borderBottomWidth: 1,
		borderBottomColor: colors.GRAY,
	},
	imageInput: {
		alignSelf: "center",
		width: 275,
		height: 150,
		marginTop: "10%",
		borderRadius: 15,
	},
	imagePlaceholder: {
		alignItems: "center",
		justifyContent: "center",
	},
	saveButton: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: "5%",
	},
	saveButtonText: {
		fontSize: 20,
		color: colors.BLACK,
	},
});

export default CreateOrUpdateGoalModal;
