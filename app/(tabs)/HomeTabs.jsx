import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useUser } from "../../context/UserContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "../../utils/colors";

import CenterAddBtn from "../../components/Buttons/centerAddBtn";

import Overview from "./overview/Overview";
import Budget from "./budget/Budget";
// import AddNewCategory from "./add_budget/AddNewCategory";
import Profile from "./profile/Profile";
import Settings from "./settings/Settings";

const Tab = createBottomTabNavigator();

const HomeTabs = ({ navigation }) => {
	const {loading, session} = useUser()
	

	return (
		<View style={styles.container}>
			<Tab.Navigator
				screenOptions={{
					headerShown: false,
					tabBarActiveTintColor: "#e91e63",
					tabBarInactiveTintColor: "gray",
					tabBarStyle: {
						borderTopWidth: 0,
					},
				}}
			>
				<Tab.Screen name="Overview" children={() => <Overview session={session} />} />
				<Tab.Screen name="Budget" component={Budget} />
				<Tab.Screen
					name="AddNewCategory"
					children={() => <AddNewCategory session={session} navigation={navigation} />}
					options={{
						tabBarButton: () => <CenterAddBtn onPress={() => navigation.navigate("AddNewCategory")} />,
					}}
				/>
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
