import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { supabase } from "../../../utils/supabase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../../utils/colors";
import loginBg from "../../../assets/images/ChooseAvatarScreen.png";
import logo2 from "../../../assets/images/logo2.png";

import ExecuteBtn from "../../../components/Buttons/executeBtn";
import TextBtn from "../../../components/Auth/textBtn";

const Login = ({ navigation }) => {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const signInWithEmail = async () => {
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		if (error) Alert.alert(error.message);
		setLoading(false);
	};

	return (
		<KeyboardAwareScrollView style={{ backgroundColor: colors.WHITE }}>
			<LinearGradient colors={["#FD608A", "#FE9395", "#FFF"]} style={styles.container}>
				<Image source={loginBg} style={styles.bgImage} />
				<View style={styles.subContainer}>
					<Image source={logo2} style={styles.logo} />
					<Text style={styles.heading}>Welcome back!</Text>
					<Text style={styles.subheading}>Please, sign in your account</Text>

					<View style={styles.textInputContainer}>
						<Text style={styles.headingInput}>Email</Text>
						<View style={styles.textInput}>
							<TextInput label="Email" placeholder="email@address.com" onChangeText={(text) => setEmail(text)} value={email} autoCapitalize={"none"} />
						</View>

						<Text style={styles.headingInput}>Password</Text>
						<View style={styles.textInput}>
							<TextInput label="Password" placeholder="password" onChangeText={(text) => setPassword(text)} value={password} autoCapitalize={"none"} />
						</View>
					</View>

					<ExecuteBtn execFunction={signInWithEmail} btnText={"Continue"} />
					<TextBtn navigation={navigation} navigateTo={"SignUp"} text={"Not a Member yet?"} colorText={colors.BLACK} btnText={"SIGN UP"} />
				</View>
			</LinearGradient>
		</KeyboardAwareScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	bgImage: {
		width: 200,
		height: 400,
		marginTop: 70,
		borderWidth: 5,
		borderRadius: 20,
		borderColor: "black",
	},
	logo: {
		alignSelf: "center",
		width: 50,
		height: 50,
		marginTop: 10,
	},
	heading: {
		marginTop: 25,
		textAlign: "center",
		fontSize: 30,
		fontWeight: "bold",
	},
	subheading: {
		marginTop: 5,
		textAlign: "center",
		fontSize: 12,
	},
	subContainer: {
		width: "100%",
		height: "100%",
		marginTop: -130,
		padding: 20,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		backgroundColor: colors.WHITE,
	},
	headingInput: {
		margin: 5,
		fontSize: 14,
	},
	textInputContainer: {
		marginTop: 30,
	},
	textInput: {
		width: "100%",
		marginBottom: 20,
		padding: 15,
		borderRadius: 10,
		backgroundColor: colors.LIGHT,
	},
});

export default Login;
