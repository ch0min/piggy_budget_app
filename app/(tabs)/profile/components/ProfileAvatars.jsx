import React, { useState, useEffect, act } from "react";
import { Dimensions, StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useUser } from "../../../../context/UserContext";
import colors from "../../../../utils/colors";
import PROFILE_AVATARS from "../../../../utils/ProfileAvatars";
import DotPagination from "./DotPagination";

const screenWidth = Dimensions.get("window").width;

const ProfileAvatars = ({ selectedAvatar, setSelectedAvatar, setAvatarUrl }) => {
	const { loading } = useUser();
	const [activeSlide, setActiveSlide] = useState(0);

	const avatarsPerRow = 5;
	const rowsPerSlide = 2;
	const avatarsPerSlide = avatarsPerRow * rowsPerSlide;
	const avatarChunks = [];

	for (let i = 0; i < PROFILE_AVATARS.length; i += avatarsPerSlide) {
		avatarChunks.push(PROFILE_AVATARS.slice(i, i + avatarsPerSlide));
	}
	const totalPages = avatarChunks.length;

	const handleScroll = (event) => {
		const contentOffsetX = event.nativeEvent.contentOffset.x;
		const currentPageIndex = Math.round(contentOffsetX / screenWidth);
		setActiveSlide(currentPageIndex);
	};

	const handleAvatarSelection = (avatar) => {
		setSelectedAvatar(avatar);
		setAvatarUrl(avatar.avatar);
	};

	const renderAvatars = ({ item }) => (
		<View style={styles.avatarRow}>
			{item.map((avatar, index) => (
				<TouchableOpacity
					style={[styles.profileAvatarSubcontainer, selectedAvatar === avatar ? styles.selectedAvatarBorder : {}]}
					key={index}
					onPress={() => handleAvatarSelection(avatar)}
				>
					<Image source={avatar.image} style={styles.profileAvatar} />
				</TouchableOpacity>
			))}
		</View>
	);

	return (
		<View style={styles.container}>
			{selectedAvatar && (
				<View style={styles.selectedAvatarContainer}>
					<Image source={selectedAvatar.image} style={styles.selectedAvatarImage} />
				</View>
			)}

			<ScrollView
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onScroll={handleScroll}
				scrollEventThrottle={16}
			>
				{avatarChunks.map((chunk, index) => (
					<View key={index} style={styles.slideContainer}>
						{renderAvatars({ item: chunk })}
					</View>
				))}
			</ScrollView>

			<View style={styles.dots}>
				<DotPagination total={totalPages} current={activeSlide} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		borderRadius: 15,

		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1,
	},
	slideContainer: {
		width: screenWidth,
		alignItems: "center",
		justifyContent: "center",
	},
	avatarRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		width: screenWidth,
		alignItems: "center",
		justifyContent: "center",
	},
	profileAvatarSubcontainer: {
		alignItems: "center",
		margin: 10,
	},
	profileAvatar: {
		width: 50,
		height: 50,
	},
	selectedAvatarContainer: {
		marginVertical: "5%",
	},
	selectedAvatarImage: {
		width: 70,
		height: 70,
	},
	selectedAvatarBorder: {
		padding: "1%",
		margin: "1%",
		borderRadius: 37.5,
		borderWidth: 2,
		borderColor: colors.WHITE,
	},
	dots: {
		marginVertical: "10%",
	},
});

export default ProfileAvatars;
