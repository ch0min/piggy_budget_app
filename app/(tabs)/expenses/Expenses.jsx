import React, { useState, useEffect, useCallback } from "react";
import {
	ActivityIndicator,
	RefreshControl,
	Alert,
	StatusBar,
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import { useMonthly } from "../../../contexts/MonthlyContext";
import { useExpenses } from "../../../contexts/ExpensesContext";
import { useTransactions } from "../../../contexts/TransactionsContext";

import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import colors from "../../../constants/colors";
import { FontAwesome, MaterialIcons, Entypo, AntDesign } from "@expo/vector-icons";
import ProgressBar from "./components/ProgressBar";
import UpdateExpense from "./components/updateExpense";
import AddTransaction from "./components/addTransaction";
import UpdateTransaction from "./components/updateTransaction";
import FormatNumber from "../../../utils/formatNumber";
import MONTH_NAMES from "../../../constants/months";

const Expenses = ({ navigation, route }) => {
	const { user, userProfile } = useAuth();
	const { loadingData, setLoadingData } = useMonthly();
	const { loading, getExpenses, updateExpense, deleteExpense } = useExpenses();
	const {
		refresh,
		setRefresh,
		transactions,
		getTransactions,
		createTransaction,
		updateTransaction,
		deleteTransaction,
	} = useTransactions();

	const { selectedExpense: selectedExpense } = route.params;
	const [selectedExpenseId, setSelectedExpenseId] = useState(selectedExpense.id);

	const [currentExpense, setCurrentExpense] = useState(selectedExpense);
	const [editableExpenseName, setEditableExpenseName] = useState(selectedExpense.name);
	const [editableTotalBudgetExpense, setEditableTotalBudgetExpense] = useState(
		String(selectedExpense.total_budget_expense)
	);
	const [editableExpenseIcon, setEditableExpenseIcon] = useState(selectedExpense.icon);
	const [editableExpenseColor, setEditableExpenseColor] = useState(selectedExpense.color);
	const [updateExpenseVisible, setUpdateExpenseVisible] = useState(false);

	const [transactionName, setTransactionName] = useState("");
	const [transactionAmount, setTransactionAmount] = useState("");
	const [transactionNote, setTransactionNote] = useState("");
	const [createTransactionVisible, setCreateTransactionVisible] = useState(false);
	const [updateTransactionVisible, setUpdateTransactionVisible] = useState(false);
	const [currentTransaction, setCurrentTransaction] = useState(null);

	const [isDeleting, setIsDeleting] = useState(false);
	const [loadingTransactionCreationAndUpdating, setLoadingTransactionCreationAndUpdating] = useState(false);

	useFocusEffect(
		useCallback(() => {
			setLoadingData(true);
			getTransactions().finally(() => setLoadingData(false));
		}, [])
	);

	useEffect(() => {
		const totalSpentExpense = transactions.reduce(
			(acc, tr) => (tr.expenses_id === currentExpense.id ? acc + parseFloat(tr.amount) : acc),
			0
		);
		setCurrentExpense({ ...currentExpense, total_spent_expense: totalSpentExpense });
	}, [transactions, selectedExpense.id]);

	useEffect(() => {
		const transactionCount = transactions.filter((tr) => tr.expenses_id === selectedExpenseId).length;
		setCurrentExpense((prev) => ({ ...prev, transaction_count: transactionCount }));
	}, [transactions, selectedExpenseId]);

	const onRefresh = useCallback(async () => {
		try {
			setRefresh(true);
			await getTransactions().finally(() => setRefresh(false));
		} catch (error) {
			console.error("Failed to refresh data.");
		}
	}, [getTransactions]);

	const prepareNumericForDB = (displayValue) => {
		let normalized = displayValue.replace(/\./g, "").replace(/,/g, ".");
		return parseFloat(normalized);
	};

	useEffect(() => {
		const transactionCount = transactions.filter((tr) => tr.expenses_id === selectedExpenseId).length;
		setCurrentExpense((prev) => ({ ...prev, transaction_count: transactionCount }));
	}, [transactions, selectedExpenseId]);

	const handleUpdateExpense = async () => {
		if (!editableExpenseName.trim()) {
			alert("Navn kan ikke være tomt.");
			return;
		}
		const normalizedTotalBudgetExpense = prepareNumericForDB(editableTotalBudgetExpense);
		if (!normalizedTotalBudgetExpense || isNaN(normalizedTotalBudgetExpense) || normalizedTotalBudgetExpense <= 0) {
			alert("Venligst, indtast et gyldigt udgiftsbeløb grænse.");
			return;
		}

		console.log("Forsøger at opdatere udgifter med:", {
			name: editableExpenseName,
			budget: editableTotalBudgetExpense,
			icon: editableExpenseIcon,
			color: editableExpenseColor,
		});
		try {
			await updateExpense(
				selectedExpenseId,
				editableExpenseName,
				normalizedTotalBudgetExpense,
				editableExpenseIcon,
				editableExpenseColor
			);
			const updatedExpense = {
				...currentExpense,
				name: editableExpenseName,
				total_budget_expense: normalizedTotalBudgetExpense,
				icon: editableExpenseIcon,
				color: editableExpenseColor,
			};
			setUpdateExpenseVisible(false);
			setCurrentExpense(updatedExpense);
			getExpenses();
		} catch (error) {
			alert("Opdatering af transaktion mislykkedes: ", error.message);
		}
	};

	const openUpdateExpenseModal = () => {
		setEditableExpenseName(selectedExpense.name);
		setEditableTotalBudgetExpense(String(selectedExpense.total_budget_expense));
		setUpdateExpenseVisible(true);
	};

	const handleDeleteExpense = async (id) => {
		try {
			const message = await deleteExpense(id);
			Alert.alert("Udgift slettet", message, [{ text: "OK", onPress: () => navigation.goBack() }]);
		} catch (error) {
			Alert.alert("Error", error);
		}
	};

	const handleCreateTransaction = async () => {
		if (!transactionName.trim()) {
			alert("Navnet kan ikke være tomt.");
			return;
		}
		const normalizedAmount = prepareNumericForDB(transactionAmount);
		if (!normalizedAmount || isNaN(normalizedAmount) || normalizedAmount <= 0) {
			alert("Venligst, indtast et gyldigt beløb.");
			return;
		}
		if (transactionNote.trim().length > 20) {
			alert("Transaktions note kan ikke være længere end 20 tegn.");
			return;
		}

		setLoadingTransactionCreationAndUpdating(true);
		try {
			await createTransaction(transactionName, normalizedAmount, transactionNote, selectedExpenseId);
			setTransactionName("");
			setTransactionAmount("");
			setTransactionNote("");
			setCreateTransactionVisible(false);
			getTransactions();
		} finally {
			setLoadingTransactionCreationAndUpdating(false);
		}
	};

	const handleUpdateTransaction = async () => {
		if (!transactionName.trim()) {
			alert("Navnet kan ikke være tomt.");
			return;
		}
		const normalizedAmount = prepareNumericForDB(transactionAmount);
		if (!normalizedAmount || isNaN(normalizedAmount) || normalizedAmount <= 0) {
			alert("Venligst, indtast et gyldigt beløb.");
			return;
		}
		if (transactionNote.trim().length > 20) {
			alert("Transaktions note kan ikke være længere end 20 tegn.");
			return;
		}
		setLoadingTransactionCreationAndUpdating(true);
		try {
			await updateTransaction(
				currentTransaction.id,
				transactionName,
				normalizedAmount,
				transactionNote,
				selectedExpenseId
			);
			setTransactionName("");
			setTransactionAmount("");
			setTransactionNote("");
			setLoadingTransactionCreationAndUpdating(false);
			setUpdateTransactionVisible(false);
			getTransactions();
		} finally {
			setLoadingTransactionCreationAndUpdating(false);
		}
	};

	const openCreateTransactionModal = () => {
		setTransactionName("");
		setTransactionAmount("");
		setTransactionNote("");
		setCreateTransactionVisible(true);
	};

	const openUpdateTransactionModal = (transaction) => {
		setCurrentTransaction(transaction);
		setTransactionName(transaction.name);
		setTransactionAmount(String(transaction.amount));
		setTransactionNote(transaction.note);
		setUpdateTransactionVisible(true);
	};

	const handleDeleteTransaction = async (id) => {
		try {
			await deleteTransaction(id);
			getTransactions();
		} catch (error) {
			Alert.alert("Error", error);
		}
	};

	const renderTransactions = ({ item }) => {
		const date = new Date(item.created_at);
		const monthName = MONTH_NAMES[date.getMonth()];
		const yearShort = date.getFullYear();

		return (
			<TouchableOpacity style={styles.transactionItemsContainer} onPress={() => openUpdateTransactionModal(item)}>
				<View style={styles.transactionItemsLeft}>
					<Text style={styles.transactionItemsName}>{item.name}</Text>
					<Text style={styles.transactionItemsNote}>{item.note}</Text>
					<Text style={styles.transactionItemsDate}>{`${monthName} ${yearShort}`}</Text>
				</View>

				<View style={styles.transactionItemsRight}>
					<TouchableOpacity style={styles.deleteTransactionBtn} onPress={() => handleDeleteTransaction(item.id)}>
						<Entypo name="cross" size={24} color={colors.BLACK} />
					</TouchableOpacity>
					<Text style={styles.transactionItemsAmount}>
						-{FormatNumber(item.amount)} {userProfile.valutaName}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" />
			{loadingData ? (
				<ActivityIndicator size="large" style={{ marginVertical: "50%" }} color={colors.DARKGRAY} />
			) : (
				<>
					{/* HEADER */}
					<View style={styles.headingContainer}>
						<View style={styles.headingItems}>
							<TouchableOpacity onPress={() => navigation.goBack()}>
								<Entypo name="chevron-thin-left" size={24} color={colors.BLACK} />
							</TouchableOpacity>
							<Text style={styles.heading}>Transaktioner</Text>

							<TouchableOpacity onPress={() => openUpdateExpenseModal()}>
								<MaterialIcons name={"edit"} size={24} color={colors.DARKGRAY} />
							</TouchableOpacity>
						</View>

						<View style={styles.headingSubContainer}>
							<View style={styles.expenseIconContainer}>
								<View style={[styles.expensesIcon, { backgroundColor: currentExpense.color }]}>
									<FontAwesome name={currentExpense.icon} size={44} color={colors.WHITE} />
								</View>
							</View>
							<View style={styles.expenseDetails}>
								<Text style={styles.expenseName}>{currentExpense.name}</Text>
								<Text style={styles.expenseItemText}>
									{currentExpense.transaction_count} transaktion
									{currentExpense.transaction_count !== 1 ? "s" : ""}
								</Text>
							</View>
							<TouchableOpacity
								style={styles.deleteExpenseBtn}
								onPress={() => handleDeleteExpense(selectedExpenseId)}
							>
								<MaterialIcons name="remove-circle" size={28} color={colors.RED} />
							</TouchableOpacity>
						</View>

						<ProgressBar
							totalSpentExpense={currentExpense.total_spent_expense}
							totalBudgetExpense={currentExpense.total_budget_expense}
						/>
					</View>
					{/* END */}

					{/* Transactions */}
					<View style={styles.transactionsContainer}>
						<Text style={styles.transactionHeading}>Dine transaktioner</Text>

						<KeyboardAwareFlatList
							enableOnAndroid={true}
							extraScrollHeight={150}
							data={transactions.filter((tr) => tr.expenses_id === selectedExpenseId)}
							renderItem={renderTransactions}
							keyExtractor={(tr) => `${tr.id}`}
							ListEmptyComponent={
								<Text style={{ marginVertical: "2%", marginLeft: "6%" }}>Ingen transaktioner fundet.</Text>
							}
							ListFooterComponent={
								<View style={styles.createTransactionContainer}>
									<TouchableOpacity
										style={styles.createTransactionBtnContainer}
										onPress={openCreateTransactionModal}
									>
										<Text style={styles.createTransactionNameInput}>Ny transaktion</Text>
										<AntDesign name="pluscircle" size={24} color={colors.DARKGRAY} />
									</TouchableOpacity>
								</View>
							}
							refreshControl={
								<RefreshControl
									refreshing={refresh}
									onRefresh={onRefresh}
									colors={colors.DARKGRAY}
									tintColor={colors.DARKGRAY}
								/>
							}
						/>
					</View>
					{/* END */}

					{/* Update Expense Modal */}
					{updateExpenseVisible && (
						<UpdateExpense
							loading={loading}
							updateExpenseVisible={updateExpenseVisible}
							currentExpense={currentExpense}
							editableExpenseName={editableExpenseName}
							setEditableExpenseName={setEditableExpenseName}
							editableTotalBudgetExpense={editableTotalBudgetExpense}
							setEditableTotalBudgetExpense={setEditableTotalBudgetExpense}
							editableExpenseIcon={editableExpenseIcon}
							setEditableExpenseIcon={setEditableExpenseIcon}
							editableExpenseColor={editableExpenseColor}
							setEditableExpenseColor={setEditableExpenseColor}
							handleUpdateExpense={handleUpdateExpense}
							onClose={() => setUpdateExpenseVisible(false)}
						/>
					)}
					{/* END */}

					{/* Add Transaction Modal */}
					{createTransactionVisible && (
						<>
							<AddTransaction
								loading={loadingTransactionCreationAndUpdating}
								createTransactionVisible={createTransactionVisible}
								transactionName={transactionName}
								setTransactionName={setTransactionName}
								transactionAmount={transactionAmount}
								setTransactionAmount={setTransactionAmount}
								transactionNote={transactionNote}
								setTransactionNote={setTransactionNote}
								handleCreateTransaction={handleCreateTransaction}
								onClose={() => setCreateTransactionVisible(false)}
							/>
						</>
					)}
					{/* END */}

					{/* Update Transaction Modal */}
					{updateTransactionVisible && (
						<UpdateTransaction
							loading={loadingTransactionCreationAndUpdating}
							updateTransactionVisible={updateTransactionVisible}
							transactionName={transactionName}
							setTransactionName={setTransactionName}
							transactionAmount={transactionAmount}
							setTransactionAmount={setTransactionAmount}
							transactionNote={transactionNote}
							setTransactionNote={setTransactionNote}
							handleUpdateTransaction={handleUpdateTransaction}
							onClose={() => setUpdateTransactionVisible(false)}
						/>
					)}
					{/* END */}
				</>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	overlayStyle: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
	},
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
	expenseInput: {
		width: "80%",
		marginLeft: "3%",
		marginVertical: "3%",
		fontSize: 22,
		fontWeight: "bold",
	},
	expenseIconContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	expenseDetails: {},
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
	deleteExpenseBtn: {
		marginLeft: "auto",
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
		alignItems: "center",
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
		// justifyContent: "space-between",
	},
	transactionItemsRight: {
		marginLeft: "5%",
		// justifyContent: "space-between",
	},
	transactionItemsName: {
		fontSize: 18,
		fontWeight: "bold",
		color: colors.DARKGRAY,
	},
	transactionItemsNote: {
		fontSize: 16,
		color: colors.DARKGRAY,
	},
	transactionItemsDate: {
		fontSize: 14,
		color: colors.DARKGRAY,
	},
	transactionItemsAmount: {
		fontSize: 20,
		fontWeight: "bold",
		color: colors.RED,
	},
	deleteTransactionBtn: {
		marginLeft: "auto",
	},

	createTransactionContainer: {
		marginHorizontal: "20%",
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
		color: colors.DARKGRAY,
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
});

export default Expenses;
