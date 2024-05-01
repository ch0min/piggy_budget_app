import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";

const CompleteProfile = () => {
	const [username, setUsername] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [avatarUrl, setAvatarUrl] = useState("");

	const handleCompleteProfile = async () => {
		const { error } = await supabase.from("profiles").upsert({
			username,
			first_name: firstName,
			last_name: lastName,
            avatar_url: avatarUrl
		});

		if (error) {
			Alert.alert("Error", error.message);
		} else {
			Alert.alert("Profile Updated", "Your profile has been updated successfully!");
		}
	};

	return (
		<View>
			<TextInput placeholder="Username" value={username} onChangeText={setUsername} />
			<TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} />
			<TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} />
			<Button title="Complete Profile" onPress={handleCompleteProfile} />
		</View>
	);
};

export default CompleteProfile;
