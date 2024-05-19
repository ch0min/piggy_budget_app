import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import colors from "../../../../utils/colors";

const DotPagination = ({ total, current }) => {
	const renderDots = () => {
		let dots = [];
		for (let i = 0; i < total; i++) {
			const isActive = i === current;
			const animatedStyle = useAnimatedStyle(() => {
				return {
					width: withTiming(isActive ? 15 : 10, { duration: 300 }),
					backgroundColor: withTiming(isActive ? colors.WHITE : colors.PRIMARY, { duration: 300 }),
				};
			});
			dots.push(<Animated.View key={i} style={[styles.dot, animatedStyle]} />);
		}
		return dots;
	};

	return <View style={styles.container}>{renderDots()}</View>;
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 0,
	},
	dot: {
		width: 10,
		height: 10,
		marginHorizontal: 4,
		borderRadius: 10,
	},
});

export default DotPagination;
