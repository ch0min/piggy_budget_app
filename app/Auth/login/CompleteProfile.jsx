import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View, Text, TextInput, Button } from "react-native";
import { supabase } from "../../../utils/supabase";
import colors from "../../../utils/colors";
import PrimaryExecBtn from "../../../components/Buttons/primaryExecBtn";

const CompleteProfile = ({ session }) => {
	const [loading, setLoading] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState("");
	const [username, setUsername] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	useEffect(() => {
		if (session) {
			getProfile();
		}
	}, [session]);

	// Make these functions reusable
	const getProfile = async () => {
		try {
			setLoading(true);
			if (!session?.user) throw new Error("No user on the session!");

			const { data, error, status } = await supabase
				.from("profiles")
				.select(`avatar_url, username, first_name, last_name`)
				.eq("id", session?.user.id)
				.single();
			if (error && status !== 406) {
				throw error;
			}
			if (data) {
				setAvatarUrl(data.avatar_url);
				setUsername(data.username);
				setFirstName(data.first_name);
				setLastName(data.last_name);
			}
		} catch (error) {
			if (error instanceof Error) {
				Alert.alert(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	const updateProfile = async ({ avatar_url, username, first_name, last_name }) => {
		try {
			setLoading(true);
			if (!session?.user) throw new Error("No user on the session!");

			const updates = {
				id: session?.user.id,
				updated_at: new Date(),
				avatar_url,
				username,
				first_name,
				last_name,
			};

			const { error } = await supabase.from("profiles").upsert(updates);

			if (error) {
				throw error;
			}
		} catch (error) {
			if (error instanceof Error) {
				Alert.alert(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.subcontainer}>
				<View style={styles.textInputContainer}>
					<Text style={styles.headingInput}>Username</Text>
					<View style={styles.textInput}>
						<TextInput label="Username" onChangeText={(text) => setUsername(text)} value={username || ""} />
					</View>

					<Text style={styles.headingInput}>First name</Text>
					<View style={styles.textInput}>
						<TextInput label="FirstName" onChangeText={(text) => setFirstName(text)} value={firstName || ""} />
					</View>

					<Text style={styles.headingInput}>Last name</Text>
					<View style={styles.textInput}>
						<TextInput label="LastName" onChangeText={(text) => setLastName(text)} value={lastName || ""} />
					</View>
				</View>

				<PrimaryExecBtn
					loading={loading}
					execFunction={() => updateProfile({ avatar_url: avatarUrl, username, first_name: firstName, last_name: lastName })}
					btnText={loading ? "Loading.." : "Update"}
				/>

				<View>
					<Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
				</View>
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
});

export default CompleteProfile;
