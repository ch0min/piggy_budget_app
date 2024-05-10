import React, { useState, useCallback } from "react";
import { StyleSheet, View, Modal, Text, TextInput, TouchableOpacity } from "react-native";
import colors from "../../../../utils/colors";
// import { RefreshControl } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

const updateExpense = ({
	updateExpenseVisible,
	setUpdateExpenseVisible,
	editableExpense,
	setEditableExpense,
	handleUpdateExpense,
	onClose,
}) => {
	return (
		<Modal visible={addTransactionVisible} animationType="fade" transparent={true} onRequestClose={onClose}>
			<TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
				<View style={styles.modalContent}>
					<View style={styles.createTransactionContainer}>
						<View style={styles.createTransactionBtnContainer}>
							<TextInput
								style={styles.createTransactionNameInput}
								placeholder="Transaction name"
								placeholderTextColor={colors.DARKGRAY}
								onChangeText={setTransactionName}
								value={transactionName}
								autoFocus={true}
							/>
							<MaterialIcons name="edit" size={24} color={colors.GRAY} />
						</View>

						<TextInput
							style={styles.createTransactionAmountInput}
							placeholder="Insert amount"
							placeholderTextColor={colors.DARKGRAY}
							onChangeText={setTransactionAmount}
							value={transactionAmount}
							inputMode="decimal"
							maxLength={9}
						/>
						<TextInput
							style={styles.createTransactionNoteInput}
							placeholder="Note (optional)"
							placeholderTextColor={colors.DARKGRAY}
							onChangeText={setTransactionNote}
							value={transactionNote}
						/>

						<TouchableOpacity style={styles.addBtn} onPress={handleCreateTransaction}>
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
	input: {
		width: "100%",
		marginBottom: 10,
		padding: 10,
		borderWidth: 1,
		bordercolor: colors.GRAY,
		borderRadius: 5,
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 20,
		paddingVertical: 20,
		borderRadius: 5,
		backgroundColor: colors.DARKGRAY,
	},
});

export default AddTransaction;
