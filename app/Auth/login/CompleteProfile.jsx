import React, { useState, useEffect } from "react";
import { ActivityIndicator, Alert, StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useUser } from "../../../context/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../../constants/colors";
import PickerWheel from "../../../components/modals/PickerWheel";
import logo from "../../../assets/images/logo2.png";
import ProfileAvatars from "../../(tabs)/profile/components/ProfileAvatars";
import PROFILE_AVATARS from "../../../constants/ProfileAvatars";

const CompleteProfile = ({ navigation }) => {
	const {
		loading,
		setLoading,
		profileCompleted,
		setProfileCompleted,
		userProfile,
		updateProfile,
		valutas,
		getValutas,
	} = useUser();
	const [selectedAvatar, setSelectedAvatar] = useState(PROFILE_AVATARS[16]);

	const [avatarUrl, setAvatarUrl] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [selectedValutaId, setSelectedValutaId] = useState(1);
	const [valutaPickerVisible, setValutaPickerVisible] = useState(userProfile?.valuta_id);

	// Splash Loading:
	if (loading) {
		return (
			<LinearGradient colors={[colors.SECONDARY, colors.PRIMARY]} locations={[0.3, 1.0]} style={styles.container}>
				<View style={styles.loadingContainer}>
					<Text style={styles.heading}>Velkommen tilbage</Text>
					<Text style={styles.subheading}>Vi har savnet dig!</Text>
					<Image source={logo} style={styles.logo} />
				</View>
			</LinearGradient>
		);
	}

	useEffect(() => {
		getValutas();
	}, []);

	useEffect(() => {
		if (userProfile && userProfile.valuta_id) {
			setSelectedValutaId(userProfile.valuta_id);
		}
	}, []);

	const handleUpdateProfile = async () => {
		if (!avatarUrl || !firstName || !lastName || !selectedValutaId) {
			Alert.alert("Venligst, udfyld alle felter.");
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

	if (!profileCompleted) {
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
	}
	return null;
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	subcontainer: {
		flex: 1,
	},
	loadingContainer: {
		alignItems: "center",
		width: "100%",
		height: "100%",
		marginTop: "60%",
	},
	heading: {
		alignSelf: "flex-start",
		marginBottom: "2%",
		marginLeft: "5%",
		fontSize: 20,
		color: colors.GRAY,
	},
	subheading: {
		alignSelf: "flex-start",
		marginLeft: "5%",
		fontSize: 32,
		fontWeight: "bold",
		color: colors.WHITE,
	},
	logoContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	logo: {
		width: 250,
		height: 250,
		marginVertical: "12%",

		// Shadow for iOS
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		// Android
		elevation: 1,
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
