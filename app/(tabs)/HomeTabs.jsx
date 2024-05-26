import React from "react";
import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import colors from "../../constants/colors";
import { FontAwesome6, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";

import Overview from "./overview/Overview";
import Budget from "./budget/Budget";
import PiggyBank from "./piggy_bank/PiggyBank";

const Tab = createBottomTabNavigator();

const HomeTabs = ({ navigation }) => {
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
					name="Oversigt"
					children={() => <Overview navigation={navigation} />}
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
					name="Sparegris"
					component={PiggyBank}
					options={{
						tabBarIcon: ({ size, color }) => <FontAwesome6 name="piggy-bank" size={size} color={color} />,
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
