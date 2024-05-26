import React from "react";
import { ActivityIndicator, StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import colors from "../../../../constants/colors";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

const ExpenseAreaItem = ({
	loading,
	item,
	editableId,
	setEditableId,
	handleUpdateExpenseAreaName,
	handleDeleteExpenseArea,
	saveUpdatedExpenseArea,
}) => {
	return (
		<View style={styles.expenseAreaItemContainer}>
			{loading && editableId === item.id ? (
				<ActivityIndicator size="medium" style={{ marginTop: "5%", marginBottom: "10%" }} color={colors.DARKGRAY} />
			) : (
				<View style={styles.expenseAreaHeader}>
					{editableId === item.id ? (
						<View style={styles.expenseAreaHeaderEdit}>
							<TouchableOpacity onPress={() => handleDeleteExpenseArea(item.id)} disabled={loading}>
								<MaterialIcons name="remove-circle" size={26} color={colors.RED} />
							</TouchableOpacity>
							<TextInput
								style={styles.expenseAreaInput}
								onChangeText={(newName) => handleUpdateExpenseAreaName(item.id, newName)}
								value={editableExpenseAreas.find((area) => area.id === item.id)?.editableName || ""}
								autoFocus={true}
							/>
						</View>
					) : (
						<>
							<Text style={styles.expenseAreaName}>{item.name}</Text>
						</>
					)}
					<TouchableOpacity
						onPress={() => {
							if (editableId === item.id) {
								saveUpdatedExpenseArea(item.id);
								setEditableId(null);
							} else {
								setEditableId(item.id);
							}
						}}
						disabled={loading}
					>
						{editableId === item.id ? (
							<AntDesign name={"check"} size={28} color={colors.DARKGRAY} />
						) : (
							<MaterialIcons name={"edit"} size={24} color={colors.DARKGRAY} />
						)}
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	expenseAreaItemContainer: {
		justifyContent: "space-between",
		marginHorizontal: "5%",
		marginTop: "5%",
		padding: 20,
		borderRadius: 15,
		backgroundColor: colors.WHITE,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1,
	},
	horizontalLine: {
		borderBottomWidth: 1,
		borderBottomColor: colors.LIGHT,
		opacity: 0.5,
	},
	expenseAreaHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	expenseAreaHeaderEdit: {
		flexDirection: "row",
	},
	expenseAreaName: {
		marginLeft: "3%",
		marginBottom: "4%",
		fontSize: 22,
		fontWeight: "bold",
	},
	expenseAreaTotalBudget: {
		marginTop: "1%",
		fontSize: 18,
		fontStyle: "italic",
	},
	expenseAreaInput: {
		width: "80%",
		marginLeft: "3%",
		marginBottom: "4%",
		fontSize: 22,
		fontWeight: "bold",
	},
	expenseAreaActions: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
});

export default ExpenseAreaItem;
