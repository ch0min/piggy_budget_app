import React from "react";
import { ActivityIndicator, RefreshControl, StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import colors from "../../../../constants/colors";
import { MaterialIcons, AntDesign, Entypo } from "@expo/vector-icons";

import BudgetHeader from "./budgetHeader";
import BudgetExpensesList from "./budgetExpensesList";

const BudgetExpenseAreasList = ({
	loading,
	refresh,
	onRefresh,
	editableId,
	setEditableId,
	currentMonth,
	expenseAreaName,
	setExpenseAreaName,
	expenseAreas,
	getExpenseAreas,
	handleUpdateExpenseAreaName,
	handleDeleteExpenseArea,
	saveUpdatedExpenseArea,
	editableExpenseAreas,
	expenses,
	handleExpense,
	handleAddExpense,
}) => {
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
			<BudgetExpensesList item={item} expenses={expenses} handleExpense={handleExpense} />

			<View style={styles.addExpenseBtnContainer}>
				<TouchableOpacity style={styles.addExpenseBtn} onPress={() => handleAddExpense(item)}>
					<View style={styles.addBtn}>
						<Entypo name="plus" size={20} color={colors.BLACK} />
					</View>
					<Text style={styles.addExpenseText}>Tilføj udgift</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<KeyboardAwareFlatList
			enableOnAndroid={true}
			keyboardShouldPersistTaps="always"
			scrollEventThrottle={50}
			data={expenseAreas}
			renderItem={renderExpenseAreas}
			keyExtractor={(item) => item.id}
			ListHeaderComponent={
				<BudgetHeader
					loading={loading}
					currentMonth={currentMonth}
					expenseAreaName={expenseAreaName}
					setExpenseAreaName={setExpenseAreaName}
					expenseAreas={expenseAreas}
					getExpenseAreas={getExpenseAreas}
					expenses={expenses}
				/>
			}
			refreshControl={
				<RefreshControl
					refreshing={refresh}
					onRefresh={onRefresh}
					colors={[colors.DARKGRAY]}
					tintColor={colors.DARKGRAY}
				/>
			}
		/>
	);
};

const styles = StyleSheet.create({
	expenseAreaHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	expenseAreaHeaderEdit: {
		flexDirection: "row",
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

export default BudgetExpenseAreasList;
