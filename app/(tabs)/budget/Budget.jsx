import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { useUser } from "../../../context/UserContext";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import colors from "../../../utils/colors";
// import { RefreshControl } from "react-native";
import OverviewHeader from "../../../components/headers/OverviewHeader";
import PieGraph from "../../../components/graphs/PieGraph";
import { FontAwesome, MaterialIcons, AntDesign, Entypo } from "@expo/vector-icons";

const Budget = ({ navigation }) => {
	const { session, expenseAreas, getExpenseAreas, createExpenseArea, expenses, getExpenses } = useUser();
	const inputRef = useRef(null);
	const [showCheckmark, setShowCheckmark] = useState(false);

	const [expenseAreaName, setExpenseAreaName] = useState("");

	useEffect(() => {
		getExpenseAreas();
		getExpenses();
		console.log(expenses);
	}, [session]);

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

	const handleAddExpense = (area) => {
		navigation.navigate("AddExpense", { selectedExpenseArea: area });
	};

	const renderExpenseAreas = ({ item }) => (
		<View style={styles.expenseAreaItem}>
			<Text style={styles.expenseAreaText}>{item.name}</Text>
			<View style={styles.horizontalLine} />
			<FlatList data={expenses} renderItem={renderExpenses} keyExtractor={(item) => item.id} />
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

	const renderExpenses = ({ item }) => (
		<View style={styles.expenseItem}>
			<Text style={styles.expenseText}>
				{item.name} - {item.max_budget}
			</Text>
		</View>
	);

	return (
		<View style={styles.container}>
			<OverviewHeader session={session} />
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
		padding: 20,
	},
	horizontalLine: {
		borderBottomWidth: 1,
		borderBottomColor: colors.DARKGRAY,
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
	expenseAreaText: {
		marginVertical: "3%",
		fontSize: 22,
		fontWeight: "bold",
	},
	expenseItem: {
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
	expenseText: {
		marginVertical: "3%",
		fontSize: 22,
		fontWeight: "bold",
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
