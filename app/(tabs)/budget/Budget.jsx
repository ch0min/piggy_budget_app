import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
	ActivityIndicator,
	RefreshControl,
	Alert,
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
	Keyboard,
} from "react-native";
import { useUser } from "../../../context/UserContext";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import colors from "../../../constants/colors";
import BudgetHeader from "./header/BudgetHeader";
import PieGraph from "../budget/components/PieGraph";
import MonthlyBudgetSwiper from "./months/MonthlyBudgetSwiper";
import FormatNumber from "../../../utils/formatNumber";
import { FontAwesome, MaterialIcons, AntDesign, Entypo } from "@expo/vector-icons";

const Budget = ({ navigation }) => {
	const {
		loading,
		setLoading,
		userProfile,
		loadingData,
		setLoadingData,
		refresh,
		setRefresh,
		currentMonth,
		setCurrentMonth,
		totalSpentMonth,
		totalBudgetMonth,
		budgetExists,
		setBudgetExists,
		createMonthlyBudget,
		expenseAreas,
		getExpenseAreas,
		createExpenseArea,
		updateExpenseArea,
		deleteExpenseArea,
		expenses,
		getExpenses,
	} = useUser();
	const inputRef = useRef(null);

	const [showCheckmark, setShowCheckmark] = useState(false);
	const [expenseAreaName, setExpenseAreaName] = useState("");
	const [colorIndex, setColorIndex] = useState(0);

	const [editableExpenseAreas, setEditableExpenseAreas] = useState([]);
	const [editableId, setEditableId] = useState(null);

	useFocusEffect(
		useCallback(() => {
			setLoading(true);
			setLoadingData(true);
			getExpenseAreas().finally(() => setLoadingData(false));
			getExpenses();
		}, [currentMonth])
	);

	useEffect(() => {
		setEditableExpenseAreas(expenseAreas.map((area) => ({ ...area, editableName: area.name })));
	}, [expenseAreas]);

	const onRefresh = useCallback(async () => {
		try {
			setRefresh(true);
			await getExpenseAreas().finally(() => setRefresh(false));
			await getExpenses();
		} catch (error) {
			console.error("Failed to refresh data.");
		}
	}, [getExpenseAreas, getExpenses]);

	const handleCreateExpenseArea = async () => {
		if (!expenseAreaName.trim()) {
			alert("Area name can't be empty.");
			return;
		}
		await createExpenseArea(expenseAreaName, currentMonth);
		Keyboard.dismiss();
		setExpenseAreaName("");
		setShowCheckmark(false);
		getExpenseAreas();
	};

	const handleUpdateExpenseAreaName = (id, newName) => {
		setLoading(true);

		const updatedAreas = editableExpenseAreas.map((area) => {
			if (area.id === id) {
				return { ...area, editableName: newName };
			}
			return area;
		});
		setLoading(false);

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
			await deleteExpenseArea(id);
			getExpenseAreas();
		} catch (error) {
			console.error("handleDeleteExpenseArea error", error);
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

			<View style={styles.horizontalLine} />
			<FlatList
				data={expenses.filter((exp) => exp.expense_areas_id === item.id)}
				renderItem={renderExpenses}
				keyExtractor={(exp) => `${exp.id}`}
				ListEmptyComponent={
					<Text style={{ marginTop: "5%", marginLeft: "4%" }}>Ingen udgifter fundet for dette område.</Text>
				}
			/>
			<View style={styles.addExpenseBtnContainer}>
				<TouchableOpacity style={styles.addExpenseBtn} onPress={() => handleAddExpense(item)}>
					<View style={styles.addBtn}>
						<Entypo name="plus" size={20} color="black" />
					</View>
					<Text style={styles.addExpenseText}>Tilføj udgift</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderExpenses = ({ item }) => (
		<TouchableOpacity style={styles.expensesContainer} onPress={() => handleExpense(item)}>
			<View style={[styles.expensesIcon, { backgroundColor: item.color }]}>
				<FontAwesome name={item.icon} size={14} color={colors.WHITE} />
			</View>
			<View style={styles.expensesTextContainer}>
				<Text style={styles.expensesName}>{item.name}</Text>
				<View style={styles.expensesBudgetNameBox}>
					<Text style={styles.expensesTotalSpent}>
						{FormatNumber(item.total_spent_expense)} {userProfile.valutaName} / {""}
					</Text>
					<Text style={styles.expensesTotalBudgetExpenseName}>
						{FormatNumber(item.total_budget_expense)} {userProfile.valutaName}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<BudgetHeader />

			{loadingData ? (
				<ActivityIndicator size="large" style={{ marginVertical: "50%" }} color={colors.DARKGRAY} />
			) : (
				<KeyboardAwareFlatList
					enableOnAndroid={true}
					keyboardShouldPersistTaps="always"
					scrollEventThrottle={50}
					data={expenseAreas}
					renderItem={renderExpenseAreas}
					keyExtractor={(item) => item.id}
					ListHeaderComponent={
						<View style={styles.graphContainer}>
							<MonthlyBudgetSwiper
								loading={loading}
								currentMonth={currentMonth}
								setCurrentMonth={setCurrentMonth}
							/>

							{budgetExists && expenseAreas === 0 && (
								<View style={styles.noExpenseAreas}>
									<Text style={styles.noExpenseAreasText}>Ingen udgiftsområder fundet for denne måned.</Text>
								</View>
							)}

							{expenseAreas.length > 0 && (
								<PieGraph
									totalSpentMonth={totalSpentMonth}
									totalBudgetMonth={totalBudgetMonth}
									expenseAreas={expenseAreas || []}
									expenses={expenses || []}
								/>
							)}

							<>
								{!budgetExists ? (
									<View style={styles.createBudgetContainer}>
										<Text style={styles.createBudgetHeading}>Kom igang med det samme!</Text>
										<Text style={styles.createBudgetSubheading}>Sæt op et nyt månedligt budget</Text>
										<TouchableOpacity
											style={styles.createBudgetButton}
											onPress={async () => {
												const budgetId = await createMonthlyBudget(currentMonth);
												if (budgetId) {
													setBudgetExists(true);
													getExpenseAreas();
												}
											}}
										>
											<Text style={styles.createBudgetBtnText}>Opret Budget</Text>
										</TouchableOpacity>
									</View>
								) : (
									<View style={styles.createExpenseAreaContainer}>
										<TextInput
											ref={inputRef}
											style={styles.createExpenseAreaInput}
											placeholder="Nyt udgiftsområde"
											onChangeText={setExpenseAreaName}
											value={expenseAreaName}
											onFocus={() => {
												setShowCheckmark(true);
											}}
										/>
										{showCheckmark && expenseAreaName.length > 0 && (
											<TouchableOpacity onPress={handleCreateExpenseArea}>
												<AntDesign name="check" size={26} color={colors.BLACK} />
											</TouchableOpacity>
										)}
									</View>
								)}
							</>
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
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	swiperContainer: {
		flex: 1,
	},
	graphContainer: {
		flex: 1,
	},
	horizontalLine: {
		borderBottomWidth: 1,
		borderBottomColor: colors.LIGHT,
		opacity: 0.5,
	},
	createBudgetContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		marginTop: "35%",
	},
	createBudgetHeading: {
		fontSize: 18,
		color: colors.DARKGRAY,
	},
	createBudgetSubheading: {
		fontSize: 22,
		color: colors.DARKGRAY,
	},
	createBudgetButton: {
		alignItems: "center",
		justifyContent: "center",
		width: "50%",
		marginTop: "5%",
		padding: "5%",
		borderRadius: 99,
		backgroundColor: colors.SECONDARY,
	},
	createBudgetBtnText: {
		fontSize: 14,
		textTransform: "uppercase",
		fontWeight: "bold",
		color: colors.WHITE,
	},
	noExpenseAreas: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: "10%",
	},
	noExpenseAreasText: {
		fontSize: 16,
		color: colors.BLACK,
	},
	createExpenseAreaContainer: {
		flexDirection: "row",
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
		padding: "3%",
		borderRadius: 5,
		backgroundColor: "#F4F4F4",
	},
	expensesTotalSpent: {
		flexShrink: 1,
		fontSize: 16,
	},
	expensesTotalBudgetExpenseName: {
		flexShrink: 1,
		fontSize: 16,
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
		marginRight: "58%",
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
