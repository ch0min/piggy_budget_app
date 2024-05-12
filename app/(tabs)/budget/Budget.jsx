import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Alert, StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { useUser } from "../../../context/UserContext";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import colors from "../../../utils/colors";
// import { RefreshControl } from "react-native";
import Header from "../../../components/headers/Header";
import PieGraph from "../../../components/graphs/PieGraph";
import { FontAwesome, MaterialIcons, Feather, AntDesign, Entypo } from "@expo/vector-icons";

const Budget = ({ navigation }) => {
	const {
		session,
		expenseAreas,
		getExpenseAreas,
		createExpenseArea,
		updateExpenseArea,
		deleteExpenseArea,
		expenses,
		getExpenses,
		transactions,
	} = useUser();
	const inputRef = useRef(null);
	const [showCheckmark, setShowCheckmark] = useState(false);
	const [expenseAreaName, setExpenseAreaName] = useState("");

	const [editableExpenseAreas, setEditableExpenseAreas] = useState([]);
	const [editableId, setEditableId] = useState(null);

	useFocusEffect(
		useCallback(() => {
			if (session) {
				getExpenseAreas();
				getExpenses();
			}
		}, [session])
	);

	useEffect(() => {
		setEditableExpenseAreas(expenseAreas.map((area) => ({ ...area, editableName: area.name })));
	}, [expenseAreas]);

	const handleCreateExpenseArea = async () => {
		if (!expenseAreaName.trim()) {
			alert("Area name can't be empty.");
			return;
		}
		await createExpenseArea(expenseAreaName);
		setExpenseAreaName("");
		setShowCheckmark(false);
		getExpenseAreas();
	};

	const handleUpdateExpenseAreaName = (id, newName) => {
		const updatedAreas = editableExpenseAreas.map((area) => {
			if (area.id === id) {
				return { ...area, editableName: newName };
			}
			return area;
		});
		setEditableExpenseAreas(updatedAreas);
	};

	const saveUpdatedExpenseArea = async (id) => {
		const area = editableExpenseAreas.find((area) => area.id === id);
		if (area) {
			await updateExpenseArea(id, area.editableName);
			setEditableId(null);
			getExpenseAreas();
		}
	};

	const handleDeleteExpenseArea = async (id) => {
		try {
			const message = await deleteExpenseArea(id);
			Alert.alert("Area removed", message, [{ text: "OK" }]);
			getExpenseAreas();
		} catch (error) {
			Alert.alert("Error", error);
		}
	};

	const handleExpense = (exp) => {
		navigation.navigate("Expenses", { selectedExpense: exp });
	};

	const handleAddExpense = (area) => {
		navigation.navigate("AddExpense", { selectedExpenseArea: area });
	};

	const renderExpenseAreas = ({ item }) => (
		<View style={styles.expenseAreaItem}>
			<View style={styles.expenseAreaHeader}>
				{editableId === item.id ? (
					<View style={styles.expenseAreaHeaderEdit}>
						<TouchableOpacity onPress={() => handleDeleteExpenseArea(item.id)}>
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
						<Text style={styles.expenseAreaTotalBudget}>(Total: {item.total_budget})</Text>
					</>
				)}
				<TouchableOpacity
					style={styles.expenseAreaUpdateIcons}
					onPress={() => {
						if (editableId === item.id) {
							saveUpdatedExpenseArea(item.id);
							setEditableId(null);
						} else {
							setEditableId(item.id);
						}
					}}
				>
					{editableId === item.id ? (
						<AntDesign name={"check"} size={28} color={colors.DARKGRAY} />
					) : (
						<MaterialIcons name={"edit"} size={24} color={colors.DARKGRAY} />
					)}
				</TouchableOpacity>
			</View>
			<View style={styles.horizontalLine} />
			<FlatList
				data={expenses.filter((exp) => exp.expense_areas_id === item.id)}
				renderItem={renderExpenses}
				keyExtractor={(exp) => `${exp.id}`}
				ListEmptyComponent={
					<Text style={{ marginTop: "5%", marginLeft: "4%" }}>No expenses found for this area.</Text>
				}
			/>
			<View style={styles.addExpenseBtnContainer}>
				<TouchableOpacity style={styles.addExpenseBtn} onPress={() => handleAddExpense(item)}>
					<View style={styles.addBtn}>
						<Entypo name="plus" size={20} color="black" />
					</View>
					<Text style={styles.addExpenseText}>Add expense</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderExpenses = ({ item }) => {
		const expenseTransactions = transactions.filter((tr) => tr.expenses_id === item.id);
		const totalSpent = expenseTransactions.reduce((acc, tr) => acc + parseFloat(tr.amount), 0);

		return (
			<TouchableOpacity style={styles.expensesContainer} onPress={() => handleExpense(item)}>
				<View style={[styles.expensesIcon, { backgroundColor: item.color }]}>
					<FontAwesome name={item.icon} size={14} color={colors.WHITE} />
				</View>
				<View style={styles.expensesTextContainer}>
					<Text style={styles.expensesName}>{item.name}</Text>
					<View style={styles.expensesBudgetNameBox}>
						<Text style={styles.expensesTotalSpent}>{totalSpent} /</Text>
						<Text style={styles.expensesMaxBudgetName}> {item.max_budget}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			<Header session={session} />

			<View style={styles.graphContainer}>
				<PieGraph />
			</View>

			<KeyboardAwareFlatList
				data={expenseAreas}
				renderItem={renderExpenseAreas}
				keyExtractor={(item) => item.id}
				ListFooterComponent={
					<View style={styles.createExpenseAreaContainer}>
						<TextInput
							ref={inputRef}
							style={styles.createExpenseAreaInput}
							placeholder="New expense area"
							onChangeText={setExpenseAreaName}
							value={expenseAreaName}
							onFocus={() => {
								setShowCheckmark(false);
							}}
							onBlur={() => {
								setShowCheckmark(true);
							}}
						/>
						{showCheckmark && expenseAreaName.length > 0 && (
							<TouchableOpacity onPress={handleCreateExpenseArea}>
								<AntDesign name="check" size={26} color={colors.BLACK} />
							</TouchableOpacity>
						)}
					</View>
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	graphContainer: {
		marginTop: -75,
		paddingHorizontal: "3%",
		zIndex: 1,
	},

	horizontalLine: {
		borderBottomWidth: 1,
		borderBottomColor: colors.LIGHT,
		opacity: 0.5,
	},
	createExpenseAreaContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginHorizontal: "5%",
		marginVertical: "5%",

		padding: 20,
		borderRadius: 15,
		backgroundColor: colors.WHITE,

		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 1,
	},
	expenseAreaHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	expenseAreaHeaderEdit: {
		flexDirection: "row",
	},
	createExpenseAreaInput: {
		width: "90%",
		fontSize: 22,
		fontWeight: "bold",
		color: colors.DARKGRAY,
		// backgroundColor: "red",
	},
	expenseAreaItem: {
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

	// Expenses
	expensesContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		marginHorizontal: "1.5%",
		padding: "1%",

		borderBottomWidth: 0.5,
		borderBottomColor: colors.LIGHT,
	},
	expensesTextContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	expensesName: {
		flexShrink: 1,
		fontSize: 16,
	},
	expensesBudgetNameBox: {
		flexDirection: "row",
		marginVertical: "2%",
		padding: "5%",
		borderRadius: 5,
		backgroundColor: "#F4F4F4",
	},
	expensesTotalSpent: {
		flexShrink: 1,
		fontSize: 16,
	},
	expensesMaxBudgetName: {
		flexShrink: 1,
		fontSize: 16,
		fontWeight: "bold",
	},
	expensesIcon: {
		alignItems: "center",
		justifyContent: "center",
		marginRight: "3%",
		width: 30,
		height: 30,
		borderRadius: 37.5,
	},
	addExpenseBtnContainer: {
		marginTop: "5%",
		marginLeft: "2%",
	},
	addExpenseBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	addExpenseText: {
		marginRight: "55%",
		fontSize: 18,
		color: colors.BLACK,
	},
	addBtn: {
		alignItems: "center",
		justifyContent: "center",
		width: 30,
		height: 30,
		marginRight: "3%",
		borderRadius: 37.5,
		backgroundColor: colors.LIGHT,
	},
});

export default Budget;
