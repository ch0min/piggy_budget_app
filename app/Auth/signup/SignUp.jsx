import React, { useState } from "react";
import { Alert, StyleSheet, View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import { supabase } from "../../../utils/supabase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../../utils/colors";
import arrowLeft from "../../../assets/images/arrowLeft.png";
import logo2 from "../../../assets/images/logo2.png";

import ExecuteBtn from "../../../components/Buttons/executeBtn";
import TextBtn from "../../../components/Auth/textBtn";

import { Button, Input } from "react-native-elements";

const SignUp = ({ navigation }) => {
	const [loading, setLoading] = useState(false);

	// const [firstName, setFirstName] = useState("");
	// const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	// const [avatarUrl, setAvatarUrl] = useState("");

	const signUpWithEmail = async () => {
		setLoading(true);
		const {
			data: { session },
			error,
		} = await supabase.auth.signUp({
			// firstName: firstName,
			// lastName: lastName,
			email: email,
			password: password,
			// avatarUrl: avatarUrl,
		});

		if (error) Alert.alert(error.message);
		if (!session) Alert.alert("Please check your inbox for email verification.");
		setLoading(false);
	};

	return (
		<KeyboardAwareScrollView contentContainerStyle={styles.container}>
			<View style={styles.headerContainer}>
				<TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
					<Image style={styles.arrowLeft} source={arrowLeft} />
				</TouchableOpacity>
				<Image style={styles.logo} source={logo2} />
			</View>
			<Text style={styles.heading}>Create your Account</Text>

			<View style={styles.subContainer}>
				<View style={styles.textInputContainer}>
					{/* <Text style={styles.headingInput}>First Name</Text>
					<View style={styles.textInput}>
						<TextInput label="FirstName" placeholder="ex. John" onChangeText={(text) => setFirstName(text)} value={firstName} autoCapitalize={"words"} />
					</View>

					<Text style={styles.headingInput}>Last Name</Text>
					<View style={styles.textInput}>
						<TextInput label="LastName" placeholder="ex. Doe" onChangeText={(text) => setLastName(text)} value={lastName} autoCapitalize={"words"} />
					</View> */}

					<Text style={styles.headingInput}>Email</Text>
					<View style={styles.textInput}>
						<TextInput label="Email" placeholder="ex. email@address.com" onChangeText={(text) => setEmail(text)} value={email} autoCapitalize={"none"} />
					</View>

					<Text style={styles.headingInput}>Password</Text>
					<View style={styles.textInput}>
						<TextInput label="Password" placeholder="**********" onChangeText={(text) => setPassword(text)} value={password} autoCapitalize={"none"} />
					</View>
				</View>
				<ExecuteBtn execFunction={signUpWithEmail} btnText={"Sign Up"} />
				<TextBtn navigation={navigation} navigateTo={"Login"} text={"Already a Member?"} colorText={colors.BLACK} btnText={"SIGN IN"} />
			</View>
		</KeyboardAwareScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: colors.WHITE,
	},
	headerContainer: {
		flexDirection: "row",
		width: "100%",
		alignItems: "center",
		justifyContent: "space-between",
		margin: 65,
	},
	arrowLeft: {
		width: 30,
		height: 30,
		marginLeft: 50,
	},
	logo: {
		width: 35,
		height: 35,
		marginRight: 50,
	},
	heading: {
		fontSize: 28,
		fontWeight: "bold",
		color: colors.BLACK,
	},
	subContainer: {
		width: "100%",
		height: "100%",
		padding: 20,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		backgroundColor: colors.WHITE,
	},
	textInputContainer: {
		marginTop: 30,
	},
	headingInput: {
		margin: 5,
		fontSize: 14,
	},
	textInput: {
		width: "100%",
		marginBottom: 20,
		padding: 15,
		borderRadius: 10,
		backgroundColor: colors.LIGHT,
	},
});

export default SignUp;
