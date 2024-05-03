import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useUser } from "../../../context/UserContext";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colors from "../../../utils/colors";
import logo2 from "../../../assets/images/logo2.png";
import arrowLeft from "../../../assets/images/arrowLeft.png";

import PrimaryExecBtn from "../../../components/Buttons/primaryExecBtn";
import TextBtn from "../../../components/Auth/textBtn";

const Login = ({ navigation }) => {
	const { loading, signIn } = useUser();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	const handleSignIn = async () => {
		if (!email || !password) {
			setMessage("Please enter both email and password");
			return;
		}
		const { error } = await signIn(email, password);
		if (error) {
			setMessage("Invalid email or password");
		}
	};

	return (
		<KeyboardAwareScrollView style={{ backgroundColor: colors.WHITE }}>
			<View style={styles.container}>
				<View style={styles.headerContainer}>
					<TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
						<Image style={styles.arrowLeft} source={arrowLeft} />
					</TouchableOpacity>
				</View>

				<Image source={logo2} style={styles.bgImage} />

				<View style={styles.subContainer}>
					<Text style={styles.heading}>Welcome back!</Text>
					<Text style={styles.subheading}>Please, sign in your account</Text>

					<View style={styles.textInputContainer}>
						<Text style={styles.headingInput}>Email</Text>
						<View style={styles.textInput}>
							<TextInput
								label="Email"
								placeholder="piggy@address.com"
								onChangeText={(text) => setEmail(text)}
								value={email}
								autoCapitalize={"none"}
							/>
						</View>

						<Text style={styles.headingInput}>Password</Text>
						<View style={styles.textInput}>
							<TextInput
								label="Password"
								placeholder="**********"
								onChangeText={(text) => setPassword(text)}
								value={password}
								secureTextEntry={true}
							/>
						</View>
					</View>

					{message ? <Text style={styles.message}>{message}</Text> : null}

					<View style={styles.btnContainer}>
						<PrimaryExecBtn execFunction={handleSignIn} btnText={"Login"} />
						<TextBtn
							navigation={navigation}
							navigateTo={"Signup"}
							text={"Not a Member yet?"}
							colorText={colors.BLACK}
							btnText={"SIGN UP"}
						/>
					</View>
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: colors.SECONDARY,
	},
	headerContainer: {
		flexDirection: "row",
		width: "100%",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: "15%",
	},
	arrowLeft: {
		width: 30,
		height: 30,
		marginLeft: "25%",
	},
	bgImage: {
		width: "75%",
		height: "75%",
		// width: 200,
		// height: 400,
		// marginTop: 70,
		// borderWidth: 5,
		// borderRadius: 20,
		// borderColor: "black",
	},
	heading: {
		marginTop: "5%",
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
		marginTop: -120,
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
	message: {
		textAlign: "left",
		fontSize: 14,
		color: colors.RED,
	},
});

export default Login;
