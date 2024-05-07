import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useUser } from "../../context/UserContext";
import colors from "../../utils/colors";

import CenterAddBtn from "../../components/buttons/centerAddBtn";
import Overview from "./overview/Overview";
import Budget from "./budget/Budget";
import AddExpense from "./expenses/AddExpense";
import AddCategory from "./categories/AddCategory";
import Profile from "./profile/Profile";
import Settings from "./settings/Settings";

const Tab = createBottomTabNavigator();

const HomeTabs = ({ navigation }) => {
	const { loading, session } = useUser();

	return (
		<View style={styles.container}>
			<Tab.Navigator
				initialRouteName="Budget" // Change
				screenOptions={{
					headerShown: false,
					tabBarActiveTintColor: colors.SECONDARY,
					tabBarInactiveTintColor: colors.DARKGRAY,
					tabBarStyle: {
						borderTopWidth: 0,
					},
				}}
			>
				<Tab.Screen name="Overview" children={() => <Overview session={session} />} />
				<Tab.Screen name="Budget" component={Budget} />
				{/* <Tab.Screen
					name="AddExpense"
					children={() => <AddExpense navigation={navigation} />}
					options={{
						tabBarButton: () => <CenterAddBtn onPress={() => navigation.navigate("AddExpense")} />,
					}}
				/> */}
				<Tab.Screen name="Profile" component={Profile} />
				<Tab.Screen name="Settings" component={Settings} />
			</Tab.Navigator>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default HomeTabs;
