import { useState, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { supabase } from "../../../utils/supabase";
import { useNavigation } from "@react-navigation/native";
import { Button, Input } from "react-native-elements";

const Account = ({ session }) => {
	const navigation = useNavigation();

	const [loading, setLoading] = useState(true);
	const [username, setUsername] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	const [avatarUrl, setAvatarUrl] = useState("");

	useEffect(() => {
		if (session) getProfile();
	}, [session]);

	async function getProfile() {
		try {
			setLoading(true);
			if (!session?.user) throw new Error("No user on the session!");

			const { data, error, status } = await supabase
				.from("profiles")
				.select(`username, first_name, last_name, avatar_url`)
				.eq("id", session?.user.id)
				.single();
			if (error && status !== 406) {
				throw error;
			}

			if (data) {
				setUsername(data.username);
				setFirstName(data.first_name);
				setLastName(data.last_name);

				setAvatarUrl(data.avatar_url);
			}
		} catch (error) {
			if (error instanceof Error) {
				Alert.alert(error.message);
			}
		} finally {
			setLoading(false);
		}
	}

	async function updateProfile({ username, first_name, last_name, avatar_url }) {
		try {
			setLoading(true);
			if (!session?.user) throw new Error("No user on the session!");

			const updates = {
				id: session?.user.id,
				username,
				first_name,
				last_name,
				avatar_url,
				updated_at: new Date(),
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
	}

	return (
		<View style={styles.container}>
			<View style={[styles.verticallySpaced, styles.mt20]}>
				<Input label="Email" value={session?.user?.email} disabled />
			</View>

			<View style={styles.verticallySpaced}>
				<Input label="Username" value={username || ""} onChangeText={(text) => setUsername(text)} />
			</View>

			<View style={styles.verticallySpaced}>
				<Input label="First Name" value={firstName || ""} onChangeText={(text) => setFirstName(text)} />
			</View>

			<View style={styles.verticallySpaced}>
				<Input label="Last Name" value={lastName || ""} onChangeText={(text) => setLastName(text)} />
			</View>

			<View style={styles.verticallySpaced}>
				<Input label="Avatar" value={avatarUrl || ""} onChangeText={(text) => setAvatarUrl(text)} />
			</View>

			<View style={[styles.verticallySpaced, styles.mt20]}>
				<Button
					title={loading ? "Loading ..." : "Update"}
					onPress={() => updateProfile({ username, first_name: firstName, last_name: lastName, avatar_url: avatarUrl })}
					disabled={loading}
				/>
			</View>

			<View style={styles.verticallySpaced}>
				<Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 40,
		padding: 12,
	},
	verticallySpaced: {
		paddingTop: 4,
		paddingBottom: 4,
		alignSelf: "stretch",
	},
	mt20: {
		marginTop: 20,
	},
});

export default Account;
