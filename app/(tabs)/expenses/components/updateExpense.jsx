import React from "react";
import { StyleSheet, View, Modal, TextInput, TouchableOpacity } from "react-native";
import colors from "../../../../utils/colors";
// import { RefreshControl } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

const UpdateExpense = ({
	updateExpenseVisible,
	editableExpenseName,
	setEditableExpenseName,
	editableExpenseMaxBudget,
	setEditableExpenseMaxBudget,
	handleUpdateExpense,
	onClose,
}) => {
	return (
		<Modal visible={updateExpenseVisible} animationType="fade" transparent={true} onRequestClose={onClose}>
			<TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
				<View style={styles.modalContent}>
					<View style={styles.updateExpenseContainer}>
						<View style={styles.updateExpenseBtnContainer}>
							<TextInput
								style={styles.updateExpenseNameInput}
								placeholder="Expense name"
								placeholderTextColor={colors.DARKGRAY}
								onChangeText={setEditableExpenseName}
								value={editableExpenseName}
								autoFocus={true}
							/>
							<MaterialIcons name="edit" size={24} color={colors.GRAY} />
						</View>

						<TextInput
							style={styles.updateExpenseAmountInput}
							placeholder="Insert amount"
							placeholderTextColor={colors.DARKGRAY}
							onChangeText={setEditableExpenseMaxBudget}
							value={editableExpenseMaxBudget}
							inputMode="decimal"
							maxLength={9}
						/>

						<TouchableOpacity style={styles.addBtn} onPress={handleUpdateExpense}>
							<AntDesign name="check" size={34} color={colors.BLACK} />
						</TouchableOpacity>
					</View>
				</View>
			</TouchableOpacity>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		alignItems: "center",
		marginHorizontal: "8%",
		width: "90%",

		marginVertical: "5%",
		padding: "5%",
		borderRadius: 15,
		backgroundColor: colors.WHITE,

		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1,
	},
	updateExpenseContainer: {
		width: "100%",
	},
	updateExpenseBtnContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	updateExpenseNameInput: {
		width: "90%",
		fontSize: 18,
		color: colors.BLACK,
	},
	updateExpenseAmountInput: {
		marginTop: "5%",
		paddingVertical: "5%",
		fontSize: 14,
		color: colors.BLACK,
		borderTopWidth: 1,
		borderTopColor: colors.GRAY,
		borderBottomWidth: 1,
		borderBottomColor: colors.GRAY,
	},
	updateExpenseNoteInput: {
		paddingVertical: "5%",
		fontSize: 14,
		color: colors.BLACK,
		borderBottomWidth: 1,
		borderBottomColor: colors.GRAY,
	},
	addBtn: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: "5%",
	},
	addBtnText: {
		fontSize: 20,
		color: colors.BLACK,
	},
});

export default UpdateExpense;
