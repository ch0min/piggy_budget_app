import React, { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import { decode } from "base64-arraybuffer";
import { Alert, ActivityIndicator, StyleSheet, View, Modal, Text, TextInput, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import colors from "../../../../constants/colors";
import { useAuth } from "../../../../contexts/AuthContext";
import { useMonthly } from "../../../../contexts/MonthlyContext";
import CreateOrUpdateGoalModal from "./createOrUpdateGoal";
import placeholder from "../../../../assets/images/placeholder.png";

const PiggyBankGoal = () => {
	const { user } = useAuth;
	const { getMonthlyBudget, createOrUpdateMonthlyGoal, totalSavings } = useMonthly();
	const [goalModalVisible, setGoalModalVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [goalName, setGoalName] = useState("");
	const [savingsGoal, setSavingsGoal] = useState("");

	const imagePlaceholder = placeholder;
	const [image, setImage] = useState(imagePlaceholder);
	const [previewImage, setPreviewImage] = useState(placeholder);

	const onImagePicker = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			quality: 0.7,
			base64: true,
		});

		if (!result.canceled) {
			setPreviewImage(result.assets[0].uri);
			setImage(result.assets[0].base64);
		}
	};

	const handleAddImageToGoal = async () => {
		setLoading(true);
		const imgFileName = Date.now();
		try {
			const { data, error } = await supabase.storage
				.from("goal_images")
				.upload("goal_" + imgFileName + ".png", decode(image), {
					contentType: "image/png",
				});

			console.log("File upload:", data);
		} catch (error) {
			console.error("Error handleAddImageToGoal", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSaveGoal = async () => {
		if (parseFloat(savingsGoal) > totalSavings) {
			Alert.alert("Dit opsparingsmål kan ikke overskride din totale opsparing.");
			return;
		}
		setLoading(true);
		try {
			await createOrUpdateMonthlyGoal({ goalName, savingsGoal, image });
			setGoalModalVisible(false);
		} catch (error) {
			console.error("Error handleSaveGoal", error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.button} onPress={() => setGoalModalVisible(true)}>
				<Text>Sæt et månedligt mål</Text>
			</TouchableOpacity>

			<CreateOrUpdateGoalModal
				loading={loading}
				goalModalVisible={goalModalVisible}
				setGoalModalVisible={setGoalModalVisible}
				goalName={goalName}
				setGoalName={setGoalName}
				savingsGoal={savingsGoal}
				setSavingsGoal={setSavingsGoal}
				image={image}
				previewImage={previewImage}
				onImagePicker={onImagePicker}
				handleAddImageToGoal={handleAddImageToGoal}
				handleSaveGoal={handleSaveGoal}
				onClose={() => setGoalModalVisible(false)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
		marginHorizontal: "5%",
		marginTop: "15%",
		padding: 20,
		borderRadius: 15,
		backgroundColor: colors.WHITE,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1,
	},
	button: {
		margin: 10,
		padding: 10,
		borderRadius: 5,
		backgroundColor: colors.PRIMARY,
	},
	modalOverlay: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "90%",
		padding: 20,
		borderRadius: 10,
		backgroundColor: colors.WHITE,
	},
	input: {
		width: "100%",
		marginBottom: 10,
		padding: 10,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: colors.DARKGRAY,
	},
	saveButton: {
		alignItems: "center",
		padding: 10,
		borderRadius: 5,
		backgroundColor: colors.SECONDARY,
	},
	saveButtonText: {
		fontWeight: "bold",
		color: colors.WHITE,
	},
});

export default PiggyBankGoal;
