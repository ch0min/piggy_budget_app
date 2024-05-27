import React, { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import { decode } from "base64-arraybuffer";
import {
	Alert,
	ActivityIndicator,
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import colors from "../../../../constants/colors";
import { useAuth } from "../../../../contexts/AuthContext";
import { useMonthly } from "../../../../contexts/MonthlyContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import CreateOrUpdateGoalModal from "./createOrUpdateGoal";
import ProgressBarGoal from "./ProgressBarGoal";

const PiggyBankGoal = () => {
	const { user } = useAuth;
	const { getMonthlyGoal, createOrUpdateMonthlyGoal, totalSavings } = useMonthly();
	const [goalModalVisible, setGoalModalVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [goalName, setGoalName] = useState("");
	const [savingsGoal, setSavingsGoal] = useState("");

	const imagePlaceholder = require("../../../../assets/images/placeholder.png");
	const [image, setImage] = useState(null);
	const [previewImage, setPreviewImage] = useState(null);

	useEffect(() => {
		const fetchGoal = async () => {
			const goalData = await getMonthlyGoal();

			if (goalData) {
				setGoalName(goalData.name);
				setSavingsGoal(goalData.savings_goal.toString());
				setImage(goalData.image || require("../../../../assets/images/placeholder.png"));
				setPreviewImage(goalData.image || require("../../../../assets/images/placeholder.png"));
			} else {
				setGoalName("");
				setSavingsGoal("");
				setImage(require("../../../../assets/images/placeholder.png"));
				setPreviewImage(require("../../../../assets/images/placeholder.png"));
			}
		};
		fetchGoal();
	}, []);

	const onImagePicker = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			quality: 0.3,
			base64: true,
		});

		if (!result.canceled) {
			setPreviewImage(result.assets[0].uri);
			setImage(result.assets[0].base64);
		}
	};

	const handleSaveGoal = async () => {
		setLoading(true);
		const imgFileName = Date.now();
		try {
			const { data, error } = await supabase.storage
				.from("goal_images")
				.upload(imgFileName + ".png", decode(image), {
					contentType: "image/png",
				});

			if (data) {
				const fileUrl =
					"https://pyleapvvcehmbucjsbhe.supabase.co/storage/v1/object/public/goal_images/" + imgFileName + ".png";
				await createOrUpdateMonthlyGoal({ goalName, savingsGoal, image: fileUrl });
				setGoalModalVisible(false);

				console.log(data);
			}
		} catch (error) {
			console.error("Error handleSaveGoal", error);
		} finally {
			setLoading(false);
		}
	};

	// Progress bar additionals:
	const positiveSavings = Math.max(0, totalSavings);
	const totalPercentage = savingsGoal > 0 ? (positiveSavings / savingsGoal) * 100 : 0;

	const backgroundColor = totalPercentage >= 100 ? colors.DARKGREEN : colors.SECONDARY;
	const showCheckmark =
		totalPercentage >= 100 ? (
			<Ionicons name="checkmark-circle" size={54} color={colors.GREEN} />
		) : (
			<MaterialCommunityIcons name="timer-sand-complete" size={54} color={colors.WHITE} />
		);

	return (
		<ImageBackground
			source={previewImage ? { uri: previewImage } : imagePlaceholder}
			imageStyle={{ borderRadius: 15 }}
			style={styles.container}
		>
			<Text style={styles.heading}>Månedligt mål </Text>

			<TouchableOpacity style={styles.button} onPress={() => setGoalModalVisible(true)}>
				<View style={styles.centerContainer}>{showCheckmark}</View>
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
					handleSaveGoal={handleSaveGoal}
					imagePlaceholder={imagePlaceholder}
					onClose={() => setGoalModalVisible(false)}
				/>
			</TouchableOpacity>
			<View style={styles.progressBarContainer}>
				<ProgressBarGoal
					totalPercentage={totalPercentage}
					backgroundColor={backgroundColor}
					showCheckmark={showCheckmark}
				/>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
		marginHorizontal: "5%",
		padding: 20,
		borderRadius: 15,
		backgroundColor: colors.WHITE,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1,
	},
	centerContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: "10%",
	},
	button: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
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
	heading: {
		fontSize: 18,
		color: colors.WHITE,
	},
	progressBarContainer: {
		// marginTop: "35%",
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
