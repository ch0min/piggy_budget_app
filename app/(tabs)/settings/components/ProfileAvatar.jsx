import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { useAuth } from "../../../../contexts/AuthContext";
import colors from "../../../../constants/colors";
import PROFILE_AVATARS from "../../../../constants/ProfileAvatars";

const ProfileAvatar = () => {
	const { userProfile } = useAuth();

	const userAvatar =
		userProfile && userProfile.avatar_url
			? PROFILE_AVATARS.find((avatar) => avatar.avatar === userProfile.avatar_url)?.image
			: null;

	return (
		<View style={styles.container}>{userAvatar && <Image source={userAvatar} style={styles.profileAvatar} />}</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	profileAvatar: {
		width: 125,
		height: 125,
	},
});

export default ProfileAvatar;
