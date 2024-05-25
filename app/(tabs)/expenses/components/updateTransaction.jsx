import React from "react";
import { ActivityIndicator, StyleSheet, View, Text, Modal, TextInput, TouchableOpacity } from "react-native";
import colors from "../../../../constants/colors";
// import { RefreshControl } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

const UpdateTransaction = ({
	loading,
	updateTransactionVisible,
	transactionName,
	setTransactionName,
	transactionAmount,
	setTransactionAmount,
	transactionNote,
	setTransactionNote,
	handleUpdateTransaction,
	onClose,
}) => {
	return (
		<Modal visible={updateTransactionVisible} animationType="fade" transparent={true} onRequestClose={onClose}>
			<TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
				<View style={styles.modalContent}>
					<View style={styles.updateTransactionContainer}>
						<View style={styles.updateTransactionBtnContainer}>
							<TextInput
								style={styles.updateTransactionNameInput}
								placeholder="Transaktionsnavn"
								placeholderTextColor={colors.DARKGRAY}
								onChangeText={setTransactionName}
								value={transactionName}
								autoFocus={true}
							/>
							<MaterialIcons name="edit" size={24} color={colors.GRAY} />
						</View>

						<TextInput
							style={styles.updateTransactionAmountInput}
							placeholder="Indtast beløb"
							placeholderTextColor={colors.DARKGRAY}
							onChangeText={setTransactionAmount}
							value={transactionAmount}
							inputMode="decimal"
							maxLength={9}
						/>
						<View style={styles.noteContainer}>
							<TextInput
								style={styles.updateTransactionNoteInput}
								placeholder="Note (valgfri)"
								placeholderTextColor={colors.DARKGRAY}
								onChangeText={setTransactionNote}
								value={transactionNote}
								maxLength={20}
							/>
							<Text style={styles.charsLeft}>({20 - transactionNote.length} tegn tilbage)</Text>
						</View>

						<TouchableOpacity style={styles.addBtn} onPress={handleUpdateTransaction}>
							{loading ? (
								<ActivityIndicator size="small" style={{ marginVertical: "2%" }} color={colors.DARKGRAY} />
							) : (
								<AntDesign name="check" size={34} color={colors.BLACK} />
							)}
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
	updateTransactionContainer: {
		width: "100%",
	},
	updateTransactionBtnContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	updateTransactionNameInput: {
		width: "90%",
		fontSize: 18,
		color: colors.BLACK,
	},
	updateTransactionAmountInput: {
		marginTop: "5%",
		paddingVertical: "5%",
		fontSize: 14,
		color: colors.BLACK,
		borderTopWidth: 1,
		borderTopColor: colors.GRAY,
		borderBottomWidth: 1,
		borderBottomColor: colors.GRAY,
	},
	noteContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: "5%",
		borderBottomWidth: 1,
		borderBottomColor: colors.GRAY,
	},
	updateTransactionNoteInput: {
		fontSize: 14,
		color: colors.BLACK,
	},
	charsLeft: {
		fontSize: 12,
		color: colors.DARKGRAY,
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

export default UpdateTransaction;
