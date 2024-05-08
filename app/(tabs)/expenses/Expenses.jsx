import React, { useState, useCallback } from "react";
import { StatusBar, StyleSheet, View, Modal, Text, TextInput, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "../../../context/UserContext";
import { KeyboardAwareFlatList, KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colors from "../../../utils/colors";
// import { RefreshControl } from "react-native";
import { FontAwesome, MaterialIcons, AntDesign, Entypo } from "@expo/vector-icons";
import AddTransaction from "../budget/components/addTransaction";

const Expenses = ({ navigation, route }) => {
	const { loading, session, transactions, getTransactions, createTransaction } = useUser();

	const { selectedExpense: selectedExpense } = route.params;
	const [selectedExpenseId, setSelectedExpenseId] = useState(selectedExpense.id);

	const [transactionName, setTransactionName] = useState("");
	const [transactionAmount, setTransactionAmount] = useState("");
	const [transactionNote, setTransactionNote] = useState("");
	const [addTransactionVisible, setAddTransactionVisible] = useState(false);

	useFocusEffect(
		useCallback(() => {
			if (session) {
				getTransactions();
			}
		}, [session])
	);

	const prepareAmountForDB = (displayValue) => {
		let normalized = displayValue.replace(/\./g, "").replace(/,/g, ".");
		return parseFloat(normalized);
	};

	const handleCreateTransaction = async () => {
		if (transactionName && !transactionName.trim()) {
			alert("Transaction can't be empty.");
			return;
		}

		await createTransaction(
			transactionName,
			prepareAmountForDB(transactionAmount),
			transactionNote,
			selectedExpenseId
		);
		setTransactionName("");
		setTransactionAmount("");
		setTransactionNote("");
		setAddTransactionVisible(false);
		getTransactions();
		alert("Transaction created");
	};

	const renderTransactions = ({ item }) => (
		<TouchableOpacity style={styles.transactionItemsContainer}>
			<View style={styles.transactionItemsLeft}>
				<Text style={styles.transactionItemsName}>{item.name}</Text>
				<Text style={styles.transactionItemsNote}>{item.note}</Text>
			</View>
			<View style={styles.transactionItemsRight}>
				<Text style={styles.transactionItemsDate}>{item.created_at}</Text>
				<Text style={styles.transactionItemsAmount}>{item.amount}</Text>
			</View>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" />

			{/* HEADER */}
			<View style={styles.headingContainer}>
				<View style={styles.headingItems}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Entypo name="chevron-thin-left" size={24} color={colors.BLACK} />
					</TouchableOpacity>
					<Text style={styles.heading}>Expense Transactions</Text>
					<TouchableOpacity>
						<Entypo name="chevron-thin-left" size={24} color={colors.BLACK} />
					</TouchableOpacity>
				</View>

				<View style={styles.headingSubContainer}>
					<View style={[styles.expensesIcon, { backgroundColor: selectedExpense.color }]}>
						<FontAwesome name={selectedExpense.icon} size={44} color={colors.WHITE} />
					</View>
					<View>
						<Text style={styles.expenseName}>{selectedExpense.name}</Text>
						<Text style={styles.expenseItemText}>1 Transaction</Text>
					</View>
				</View>
			</View>
			{/* END */}

			{/* Transactions */}
			<View style={styles.transactionsContainer}>
				<Text style={styles.transactionHeading}>Your transactions</Text>
				<KeyboardAwareFlatList
					extraScrollHeight={150}
					data={transactions.filter((tr) => tr.expenses_id === selectedExpenseId)}
					renderItem={renderTransactions}
					keyExtractor={(tr) => `${tr.id}`}
					ListEmptyComponent={
						<Text style={{ marginVertical: "2%", marginLeft: "6%" }}>No transactions found.</Text>
					}
					ListFooterComponent={
						<View style={styles.createTransactionContainer}>
							<TouchableOpacity
								style={styles.createTransactionBtnContainer}
								onPress={() => setAddTransactionVisible(true)}
							>
								<Text style={styles.createTransactionNameInput}>New transaction</Text>
								<MaterialIcons name="edit" size={24} color={colors.GRAY} />
							</TouchableOpacity>
						</View>
					}
				/>
			</View>
			{/* END */}

			{/* Add Transaction Modal */}
			{addTransactionVisible && (
				<>
					<AddTransaction
						addTransactionVisible={addTransactionVisible}
						setAddTransactionVisible={setAddTransactionVisible}
						transactionName={transactionName}
						setTransactionName={setTransactionName}
						transactionAmount={transactionAmount}
						setTransactionAmount={setTransactionAmount}
						transactionNote={transactionNote}
						setTransactionNote={setTransactionNote}
						handleCreateTransaction={handleCreateTransaction}
						onClose={() => setAddTransactionVisible(false)}
					/>
					<AddTransaction />
				</>
			)}
			{/* END */}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	headingContainer: {
		height: "30%",
		backgroundColor: colors.WHITE,

		// Shadow for iOS
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,

		// Shadow for Android
		elevation: 1,
	},
	headingItems: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginHorizontal: "5%",
		marginTop: "15%",
	},
	heading: {
		textAlign: "center",
		fontSize: 14,
		textTransform: "uppercase",
		color: colors.DARKGRAY,
	},
	headingSubContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		margin: "5%",
	},
	expensesIcon: {
		alignItems: "center",
		justifyContent: "center",
		marginRight: "5%",
		width: 90,
		height: 90,
		borderRadius: 99,

		// Shadow for iOS
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 3,

		// Shadow for Android
		elevation: 1,
	},
	expenseName: {
		fontSize: 22,
		fontWeight: "bold",
		color: colors.BLACK,
	},
	expenseItemText: {
		marginTop: "5%",
		fontSize: 16,
		color: colors.DARKGRAY,
	},
	transactionsContainer: {
		flex: 1,
		marginTop: "7%",
	},
	transactionHeading: {
		marginBottom: "3%",
		marginLeft: "5%",
		fontSize: 20,
		fontWeight: "bold",
		color: colors.BLACK,
	},
	transactionItemsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginHorizontal: "5%",
		marginVertical: "1%",
		padding: "5%",
		borderRadius: 15,
		backgroundColor: colors.WHITE,

		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1,
	},
	transactionItemsLeft: {
		gap: "5%",
	},
	transactionItemsRight: {
		gap: "5%",
	},
	transactionItemsName: {
		fontSize: 24,
		fontWeight: "bold",
		color: colors.BLACK,
	},
	transactionItemsNote: {
		fontSize: 16,
		color: colors.DARKGRAY,
	},
	transactionItemsDate: {
		marginTop: "5%",

		fontSize: 14,
		color: colors.DARKGRAY,
	},
	transactionItemsAmount: {
		fontSize: 16,
		fontWeight: "bold",
		color: colors.DARKGRAY,
	},

	createTransactionContainer: {
		marginHorizontal: "8%",
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

	transactionItem: {
		justifyContent: "space-between",
		marginHorizontal: "5%",

		padding: 20,
		borderRadius: 15,
		backgroundColor: colors.WHITE,

		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1,
	},
	transactionText: {
		marginLeft: "3%",
		marginVertical: "3%",
		fontSize: 22,
		fontWeight: "bold",
	},
	// addTransactionContainer: {
	// 	alignItems: "center",
	// 	justifyContent: "center",
	// },
});

export default Expenses;
