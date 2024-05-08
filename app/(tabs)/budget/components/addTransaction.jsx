import React, { useState, useCallback } from "react";
import { StyleSheet, View, Modal, Text, TextInput, TouchableOpacity } from "react-native";
import colors from "../../../../utils/colors";
// import { RefreshControl } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

const AddTransaction = ({
	addTransactionVisible,
	setAddTransactionVisible,
	transactionName,
	setTransactionName,
	transactionAmount,
	setTransactionAmount,
	transactionNote,
	setTransactionNote,
	handleCreateTransaction,
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
	createTransactionContainer: {
		width: "100%",
	},
	createTransactionBtnContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	createTransactionNameInput: {
		width: "90%",
		fontSize: 18,
		color: colors.BLACK,
	},
	createTransactionAmountInput: {
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

export default AddTransaction;
