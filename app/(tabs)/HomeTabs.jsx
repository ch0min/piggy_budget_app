import React from "react";
import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useUser } from "../../context/UserContext";
import colors from "../../utils/colors";
import { FontAwesome, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";

import Overview from "./overview/Overview";
import Budget from "./budget/Budget";
import Profile from "./profile/Profile";
import Settings from "./settings/Settings";

const Tab = createBottomTabNavigator();

const HomeTabs = ({ navigation }) => {
	const { loading, session } = useUser();

	return (
		<View style={styles.container}>
			<Tab.Navigator
				initialRouteName="Overview" // Change
				screenOptions={{
					headerShown: false,
					tabBarActiveTintColor: colors.SECONDARY,
					tabBarInactiveTintColor: colors.DARKGRAY,
					tabBarStyle: {
						borderTopWidth: 0,
					},
				}}
			>
				<Tab.Screen
					name="Overview"
					children={() => <Overview session={session} />}
					options={{
						tabBarIcon: ({ size, color }) => <Entypo name="eye" size={size} color={color} />,
					}}
				/>
				<Tab.Screen
					name="Budget"
					component={Budget}
					options={{
						tabBarIcon: ({ size, color }) => (
							<MaterialCommunityIcons name="chart-arc" size={size} color={color} />
						),
					}}
				/>
				<Tab.Screen
					name="Profile"
					component={Profile}
					options={{
						tabBarIcon: ({ size, color }) => <FontAwesome name="user" size={size} color={color} />,
					}}
				/>
				<Tab.Screen
					name="Settings"
					component={Settings}
					options={{
						tabBarIcon: ({ size, color }) => <MaterialCommunityIcons name="tools" size={size} color={color} />,
					}}
				/>
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
