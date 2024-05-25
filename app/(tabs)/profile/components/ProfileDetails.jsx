import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useUser } from "../../../../context/UserContext";
import colors from "../../../../constants/colors";
import PickerWheel from "../../../../components/modals/PickerWheel";
import { FontAwesome5, Ionicons, Fontisto, Entypo } from "@expo/vector-icons";

const ProfileDetails = () => {
	const { user, userProfile, signOut, valutas, getValutas, updateValuta } = useUser();
	const isUserVerified = user?.confirmed_at !== null;

	const [selectedValutaId, setSelectedValutaId] = useState(userProfile?.valuta_id || 1);
	const [valutaName, setValutaName] = useState(userProfile?.valuta?.name || "");
	const [valutaPickerVisible, setValutaPickerVisible] = useState(userProfile?.valuta_id);

	useEffect(() => {
		getValutas();
	}, []);

	const handleValuta = async (valutaId, valutaName) => {
		setSelectedValutaId(valutaId);
		setValutaName(valutaName);

		await updateValuta(valutaId);
	};

	return (
		<View style={styles.container}>
			<View style={styles.profileDetailsContainer}>
				<TouchableOpacity style={styles.btn} onPress={() => setValutaPickerVisible(true)}>
					<View style={styles.iconBox}>
						<FontAwesome5 name="money-bill-wave-alt" size={22} color={colors.BLACK} />
					</View>
					<Text style={styles.btnText}>Valuta</Text>
					<Entypo name="chevron-small-right" size={28} color={colors.BLACK} />
				</TouchableOpacity>

				<View style={styles.pickerContainer}>
					{valutaPickerVisible && (
						<PickerWheel
							pickerVisible={valutaPickerVisible}
							items={valutas}
							selectedValue={selectedValutaId}
							onValueChange={handleValuta}
							onClose={() => setValutaPickerVisible(false)}
						/>
					)}
				</View>

				<TouchableOpacity style={styles.btn}>
					<View style={styles.iconBox}>
						<FontAwesome5 name="user-check" size={22} color={colors.BLACK} />
					</View>
					<Text style={styles.btnText}>Verificering</Text>
					{isUserVerified ? (
						<Ionicons name="shield-checkmark" size={28} color="#50c878" />
					) : (
						<Entypo name="chevron-small-right" size={28} color={colors.BLACK} />
					)}
				</TouchableOpacity>

				<TouchableOpacity style={styles.btn}>
					<View style={styles.iconBox}>
						<Fontisto name="locked" size={24} color={colors.BLACK} />
					</View>
					<Text style={styles.btnText}>Skift kodeord</Text>
					<Entypo name="chevron-small-right" size={28} color={colors.BLACK} />
				</TouchableOpacity>

				<TouchableOpacity style={styles.btn} onPress={signOut}>
					<View style={styles.iconBox}>
						<Entypo name="log-out" size={24} color={colors.BLACK} />
					</View>
					<Text style={styles.btnText}>Log ud</Text>
					<Entypo name="chevron-small-right" size={28} color={colors.BLACK} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	profileDetailsContainer: {
		width: "100%",
		height: "100%",
		borderTopLeftRadius: 40,
		borderTopRightRadius: 40,
		backgroundColor: "#FFF",
	},
	btn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "5%",
	},
	iconBox: {
		width: 60,
		height: 60,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 8,
		backgroundColor: "#F3F2F5",
	},
	btnText: {
		flex: 1,
		marginLeft: "5%",
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default ProfileDetails;
