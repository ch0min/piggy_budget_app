import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View, Modal, Text, TextInput, TouchableOpacity } from "react-native";
import colors from "../../../../utils/colors";
// import { RefreshControl } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const UpdateExpense = ({ editableExpense, handleUpdateExpense, updateExpenseVisible, onClose }) => {
	const [expenseName, setExpenseName] = useState(editableExpense.name || "");
	const [maxBudget, setMaxBudget] = useState((editableExpense.maxBudget || 0).toString());

	useEffect(() => {
		setExpenseName(editableExpense.name || "");
		setMaxBudget(editableExpense.maxBudget);
	}, [editableExpense]);

	return (
		<Modal visible={updateExpenseVisible} animationType="fade" transparent={true} onRequestClose={onClose}>
			<TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
				<View style={styles.modalContent}>
					<View style={styles.updateExpenseContainer}>
						<View style={styles.addExpenseBtnContainer}>
							<TextInput
								style={styles.addExpenseNameInput}
								placeholder="Expense Name"
								placeholderTextColor={colors.DARKGRAY}
								onChangeText={setExpenseName}
								value={expenseName}
							/>
						</View>
						<TextInput
							style={styles.addExpenseMaxBudgetInput}
							placeholder="Max Budget"
							placeholderTextColor={colors.DARKGRAY}
							onChangeText={setMaxBudget}
							value={maxBudget}
							inputMode="decimal"
							maxLength={9}
						/>

						{updateExpenseVisible && (
							<TouchableOpacity
								style={styles.addBtn}
								onPress={() => {
									handleUpdateExpense(expenseName, maxBudget);
									onClose();
								}}
							>
								<AntDesign name="check" size={34} color={colors.BLACK} />
							</TouchableOpacity>
						)}
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
	addExpenseBtnContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	addExpenseNameInput: {
		width: "90%",
		fontSize: 18,
		color: colors.BLACK,
	},
	addExpenseMaxBudgetInput: {
		marginTop: "5%",
		paddingVertical: "5%",
		fontSize: 14,
		color: colors.BLACK,
		borderTopWidth: 1,
		borderTopColor: colors.GRAY,
		borderBottomWidth: 1,
		borderBottomColor: colors.GRAY,
	},
	createTransactionNoteInput: {
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
