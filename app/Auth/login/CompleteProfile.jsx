import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useUser } from "../../../context/UserContext";
import { LinearGradient } from "expo-linear-gradient";

import colors from "../../../utils/colors";
import PickerWheel from "../../../components/modals/PickerWheel";
import PrimaryExecBtn from "../../../components/buttons/primaryExecBtn";

import ProfileAvatars from "../../(tabs)/profile/components/ProfileAvatars";
import questionmark from "../../../assets/images/profile_images/questionmark.png";
import PROFILE_AVATARS from "../../../utils/ProfileAvatars";

const CompleteProfile = ({ navigation }) => {
	const { loading, profileCompleted, userProfile, updateProfile, valutas, getValutas } = useUser();
	const [selectedAvatar, setSelectedAvatar] = useState(PROFILE_AVATARS[16]);

	const [avatarUrl, setAvatarUrl] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [selectedValutaId, setSelectedValutaId] = useState(1);
	const [valutaPickerVisible, setValutaPickerVisible] = useState(userProfile?.valuta_id);

	useEffect(() => {
		getValutas();
	}, []);

	console.log(valutas);
	useEffect(() => {
		if (userProfile?.valuta_id) {
			setSelectedValutaId(userProfile.valuta_id);
		}
	}, [userProfile]);

	const handleUpdateProfile = async () => {
		if (!avatarUrl || !firstName || !lastName || !selectedValutaId) {
			Alert.alert("Please fill out all fields.");
			return;
		}

		const updates = {
			avatar_url: avatarUrl,
			first_name: firstName,
			last_name: lastName,
			valuta_id: selectedValutaId,
			profile_completed: true,
		};

		await updateProfile(updates);
		if (profileCompleted) {
			navigation.navigate("HomeTabs");
		}
	};

	const handleValuta = (valutaId) => {
		setSelectedValutaId(valutaId);
	};

	return (
		<LinearGradient
			colors={[colors.PRIMARY, colors.SECONDARY]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			locations={[0.1, 1.0]}
			style={styles.container}
		>
			<View style={styles.subcontainer}>
				<View style={styles.headingContainer}>
					<Text style={styles.heading}>Hop med ombord, du er der snart..</Text>
					<Text style={styles.subheading}>Færdiggør din profil</Text>
				</View>

				<View style={styles.textInputContainer}>
					<View style={styles.textInput}>
						<TextInput
							label="FirstName"
							placeholder="Fornavn"
							placeholderTextColor={{ color: colors.WHITE }}
							onChangeText={(text) => setFirstName(text)}
							value={firstName || ""}
						/>
					</View>

					<View style={styles.textInput}>
						<TextInput
							label="LastName"
							placeholder="Efternavn"
							placeholderTextColor={{ color: colors.WHITE }}
							onChangeText={(text) => setLastName(text)}
							value={lastName || ""}
						/>
					</View>
				</View>

				<View style={styles.pickerContainer}>
					<Text style={styles.pickerHeading}>Vælg din foretrukne valuta</Text>
					<TouchableOpacity style={styles.pickerInput} onPress={() => setValutaPickerVisible(true)}>
						<Text style={styles.pickerInputText}>
							{valutas.find((v) => v.id === Number(selectedValutaId))?.name || "Valuta"}
						</Text>
					</TouchableOpacity>
					{valutaPickerVisible && (
						<PickerWheel
							pickerVisible={valutaPickerVisible}
							items={valutas}
							selectedValue={selectedValutaId}
							onValueChange={handleValuta}
							onClose={() => setValutaPickerVisible(false)}
						/>
					)}
				</View>
				<View style={styles.avatarContainer}>
					<Text style={styles.avatarHeading}>Vælg din avatar</Text>
				</View>

				<ProfileAvatars
					selectedAvatar={selectedAvatar}
					setSelectedAvatar={setSelectedAvatar}
					setAvatarUrl={setAvatarUrl}
				/>

				<TouchableOpacity style={styles.btn} onPress={() => handleUpdateProfile()} disabled={loading}>
					<Text style={styles.btnText}>Kom igang</Text>
				</TouchableOpacity>
			</View>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	subcontainer: {
		flex: 1,
	},
	headingContainer: {
		display: "flex",
		height: "10%",
		marginTop: "15%",
		alignItems: "center",
		justifyContent: "center",
	},
	heading: {
		fontSize: 14,
		// fontWeight: "bold",
		color: colors.WHITE,
	},
	subheading: {
		fontSize: 30,
		fontWeight: "bold",
		color: colors.WHITE,
	},
	textInputContainer: {
		flexDirection: "row",
		width: "100%",
		padding: "5%",
		gap: "10%",
	},
	textInput: {
		flex: 1,
		padding: "5%",
		borderRadius: 10,
		backgroundColor: colors.WHITE,
	},
	pickerContainer: {
		alignItems: "center",
		justifyContent: "center",
		padding: "5%",
		gap: "10%",
	},
	pickerInput: {
		alignItems: "center",
		justifyContent: "center",
		width: "25%",
		padding: "3%",
		borderRadius: 10,
		fontSize: 24,
		backgroundColor: colors.WHITE,
	},
	pickerHeading: {
		fontSize: 18,
		color: colors.WHITE,
	},
	pickerInputText: {
		fontSize: 22,
		color: colors.DARKGRAY,
	},
	avatarContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: "5%",
	},
	avatarHeading: {
		fontSize: 26,
		color: colors.WHITE,
	},
	btn: {
		marginBottom: "15%",
		marginHorizontal: "5%",
		padding: "5%",
		borderRadius: 37.5,
		backgroundColor: "#FFC300",
	},
	btnText: {
		textAlign: "center",
		fontSize: 16,
		fontWeight: "bold",
		color: colors.WHITE,
	},
});

export default CompleteProfile;
