import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import colors from "../utils/colors";

const ColorPicker = ({ selectedColor, setSelectedColor, height, width }) => {
	return (
		<View style={styles.container}>
			{colors.COLOR_LIST.map((color, index) => (
				<TouchableOpacity
					key={index}
					style={[
						{ height: height, width: width, backgroundColor: color, borderRadius: 99 },
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
