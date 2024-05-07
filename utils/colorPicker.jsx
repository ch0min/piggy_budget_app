import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import colors from "./colors";

const ColorPicker = ({ selectedColor, setSelectedColor }) => {
	return (
		<View style={styles.container}>
			{colors.CATEGORY_COLOR_LIST.map((color, index) => (
				<TouchableOpacity
					key={index}
					style={[
						{ height: 35, width: 35, backgroundColor: color, borderRadius: 99 },
						selectedColor === color && { borderWidth: 2 },
					]}
					onPress={() => setSelectedColor(color)}
				/>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "row",
		gap: 20,
		marginTop: 10,
	},
});

export default ColorPicker;
