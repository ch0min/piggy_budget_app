import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import colors from "../constants/colors";

const ColorPicker = ({ selectedColor, setSelectedColor, height, width, loading }) => {
	return (
		<ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollViewContainer}>
			<View style={styles.container}>
				{colors.COLOR_LIST.map((color, index) => (
					<TouchableOpacity
						key={index}
						style={[
							{ height: height, width: width, marginRight: "2%", backgroundColor: color, borderRadius: 99 },
							selectedColor === color && { borderWidth: 2 },
						]}
						onPress={() => setSelectedColor(color)}
						disabled={loading}
					/>
				))}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	scrollViewContainer: {
		flexGrow: 0,
		marginTop: 5,
	},
	container: {
		display: "flex",
		flexDirection: "row",
		marginTop: 10,
	},
});

export default ColorPicker;
