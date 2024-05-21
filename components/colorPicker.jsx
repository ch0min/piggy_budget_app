import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import colors from "../constants/colors";

const ColorPicker = ({ selectedColor, setSelectedColor, height, width, loading }) => {
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
					disabled={loading}
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
