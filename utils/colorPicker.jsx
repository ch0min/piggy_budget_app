import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import colors from "./colors";

const ColorPicker = ({selectedColor, setSelectedColor}) => {

    
	return (
		<View style={styles.container}>
			{colors.CATEGORY_COLOR_LIST.map((color, index) => (
                <TouchableOpacity
                    key={index}
                    style={[{height: 30, width: 30, backgroundColor: color, borderRadius: 99}, selectedColor === color && {borderWidth: 4}]}
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
        marginTop: 10
    },
    colorPickerBtn: {
        width: 30,
        height: 30,
        borderRadius: 99,
        // backgroundColor: selectedColor
    }
});

export default ColorPicker;
