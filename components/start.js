import { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Button,
	TextInput,
	TouchableOpacity,
	ImageBackground,
} from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { Alert } from 'react-native';

import imageBackground from '../assets/Background-Image.png';

const Start = ({ navigation }) => {
	const [name, setName] = useState('');
	const [backgroundColor, setBackgroundColor] = useState('');

	const auth = getAuth();
	const signInUser = () => {
		signInAnonymously(auth)
			.then((result) => {
				navigation.navigate('Chat', {
					name: name,
					backgroundColor: backgroundColor,
					userID: result.user.uid,
				});
				Alert.alert('Signed in Successfully!');
			})
			.catch((error) => {
				Alert.alert('Unable to sign in, try later again.');
			});
	};

	const colorOptions = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

	return (
		<View style={styles.container}>
			<ImageBackground
				source={imageBackground}
				style={styles.imageBackground}
				resizeMode="cover"
			>
				<Text style={styles.text}>Chat App</Text>
				<View style={styles.containerWhite}>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.textInput}
							value={name}
							onChangeText={setName}
							placeholder="Enter Your Name Here"
							placeholderTextColor="#757083"
						/>
					</View>
					<Text style={styles.text1}>Choose Background Color:</Text>
					<View style={styles.colorButtonsContainer}>
						{colorOptions.map((color) => (
							<TouchableOpacity
								key={color}
								style={[styles.colorButton, { backgroundColor: color }]}
								onPress={() => setBackgroundColor(color)}
							/>
						))}
					</View>
					<TouchableOpacity
						style={styles.startButton}
						onPress={signInUser}
					>
						<Text style={styles.startButtonText}>Start Chatting</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
		</View>
	);
};

// Styles for the Start component
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		flex: 1,
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	textInput: {
		flex: 1,
		marginLeft: 10,
		fontSize: 16,
		fontWeight: '300',
		color: '#757083',
	},
	containerWhite: {
		width: '80%',
		height: '40%',
		justifyContent: 'center',
		backgroundColor: 'white',
		bottom: 0,
		alignItems: 'center',
		marginBottom: '40%',
		marginLeft: 20,
	},
	text: {
		padding: '25%',
		flex: 6,
		fontSize: 45,
		fontWeight: '600',
		color: 'white',
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: '#757083',
		padding: 18,
		marginLeft: 20,
		marginRight: 20,
		marginTop: -10,
		marginBottom: 10,
	},
	text1: {
		fontSize: 16,
		color: '#757083',
		fontWeight: '300',
		marginTop: 10,
	},
	colorButtonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		margin: 20,
	},
	colorButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		margin: 10,
	},
	buttonStartChatting: {
		backgroundColor: '#757083',
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 20,
		marginTop: 10,
	},
	button: {
		backgroundColor: '#090C08',
	},
});

export default Start;
