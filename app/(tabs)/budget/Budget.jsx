import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { useUser } from "../../../context/UserContext";
import colors from "../../../utils/colors";
// import { RefreshControl } from "react-native";
import OverviewHeader from "../../../components/headers/OverviewHeader";
import PieGraph from "../../../components/graphs/PieGraph";

import { FontAwesome, MaterialIcons, AntDesign } from "@expo/vector-icons";

const Budget = () => {
	const { session, user, expenseAreas, getExpenseAreas, createExpenseArea } = useUser();
	const [inputActive, setInputActive] = useState(false);

	const [expenseAreaName, setExpenseAreaName] = useState("");
	const inputRef = useRef(null);

	useEffect(() => {
		getExpenseAreas();
	}, []);

	const handleCreateExpenseArea = async () => {
		if (!expenseAreaName.trim()) {
			alert("Area name can't be empty.");
			return;
		}
		await createExpenseArea(expenseAreaName);
		setExpenseAreaName("");
		inputRef.current?.blur();
		getExpenseAreas();
	};

	const renderExpenseAreas = ({ item }) => (
		<View style={styles.expenseAreaItem}>
			<Text style={styles.expenseAreaText}>{item.name}</Text>
			<View style={styles.horizontalLine} />
		</View>
	);

	return (
		<View style={styles.container}>
			<OverviewHeader session={session} />
			<View style={styles.graphContainer}>
				<PieGraph />
			</View>

			<FlatList
				data={expenseAreas}
				renderItem={renderExpenseAreas}
				keyExtractor={(item) => item.id}
				ListFooterComponent={
					<View style={styles.createExpenseAreaContainer}>
						<TextInput
							ref={inputRef}
							style={styles.createExpenseAreaInput}
							placeholder="New expense area"
							onFocus={() => setInputActive(true)}
							onBlur={() => setInputActive(expenseAreaName.length > 0)}
							onChangeText={(text) => {
								setInputActive(text.length > 0);
								setExpenseAreaName(text);
							}}
							value={expenseAreaName}
						/>
						{inputActive && (
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
	createExpenseAreaContainer: {
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
	createExpenseAreaInput: {
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
	expenseAreaText: {
		marginVertical: "3%",
		fontSize: 22,
		fontWeight: "bold",
	},
	horizontalLine: {
		borderBottomWidth: 1,
		borderBottomColor: colors.DARKGRAY,
		opacity: 0.5,
	},
});

export default Budget;
