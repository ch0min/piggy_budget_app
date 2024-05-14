import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useUser } from "../../../context/UserContext";
import colors from "../../../utils/colors";
import PickerWheel from "../../../components/modals/PickerWheel";
import PrimaryExecBtn from "../../../components/buttons/primaryExecBtn";

const CompleteProfile = ({ navigation }) => {
	const { loading, profileCompleted, userProfile, updateProfile, valutas, getValutas } = useUser();
	const [avatarUrl, setAvatarUrl] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [selectedValutaId, setSelectedValutaId] = useState("");
	const [valutaPickerVisible, setValutaPickerVisible] = useState(userProfile?.valuta_id);

	useEffect(() => {
		getValutas();
	}, []);

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

	console.log(selectedValutaId);

	return (
		<View style={styles.container}>
			<View style={styles.subcontainer}>
				<View style={styles.textInputContainer}>
					<Text style={styles.headingInput}>First name</Text>
					<View style={styles.textInput}>
						<TextInput label="FirstName" onChangeText={(text) => setFirstName(text)} value={firstName || ""} />
					</View>

					<Text style={styles.headingInput}>Last name</Text>
					<View style={styles.textInput}>
						<TextInput label="LastName" onChangeText={(text) => setLastName(text)} value={lastName || ""} />
					</View>

					<Text style={styles.headingInput}>Avatar</Text>
					<View style={styles.textInput}>
						<TextInput label="Avatar" onChangeText={(text) => setAvatarUrl(text)} value={avatarUrl || ""} />
					</View>

					<Text style={styles.headingInput}>Currency</Text>
					<TouchableOpacity style={styles.pickerInput} onPress={() => setValutaPickerVisible(true)}>
						<Text style={styles.pickerInputText}>
							{valutas.find((v) => v.id === Number(selectedValutaId))?.name || "Select currency"}
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

				<PrimaryExecBtn
					loading={loading}
					execFunction={handleUpdateProfile}
					btnText={loading ? "Loading.." : "Update"}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: colors.WHITE,
	},
	subcontainer: {
		width: "100%",
		height: "100%",
		marginTop: 100,
	},
	textInputContainer: {
		marginTop: 30,
	},
	headingInput: {
		margin: 5,
		fontSize: 14,
	},
	textInput: {
		width: "100%",
		marginBottom: 20,
		padding: 15,
		borderRadius: 10,
		backgroundColor: colors.PRIMARY,
	},
	valutaPickerContainer: {
		marginTop: 20,
		marginHorizontal: 20,
		padding: 10,
		borderRadius: 5,
		backgroundColor: colors.DARKGRAY,
	},
	pickerInput: {
		padding: 10,
		borderRadius: 5,
		backgroundColor: colors.WHITE,
	},
	pickerInputText: {
		fontSize: 16,
		color: colors.DARKGRAY,
	},
});

export default CompleteProfile;
