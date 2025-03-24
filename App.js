import {
	StyleSheet,
	TextInput,
	View,
	Text,
	Alert,
	Button,
	LogBox,
} from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getStorage } from 'firebase/storage';

const Stack = createNativeStackNavigator();

import { initializeApp } from 'firebase/app';
import {
	getFirestore,
	disableNetwork,
	enableNetwork,
} from 'firebase/firestore';

import { useNetInfo } from '@react-native-community/netinfo';

import Start from './components/Start';
import Chat from './components/Chat';

const App = () => {
	// Your web app's Firebase configuration
	const firebaseConfig = {
		apiKey: 'AIzaSyBQxuMA1oT9GaVMpsusVnc7jUbwcG82fVc',
		authDomain: 'chat-app-ee378.firebaseapp.com',
		projectId: 'chat-app-ee378',
		storageBucket: 'chat-app-ee378.firebasestorage.app',
		messagingSenderId: '838671435693',
		appId: '1:838671435693:web:f0314f2910bebd23118324',
	};

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	const storage = getStorage(app);

	// Initialize Cloud Firestore and get a reference to the service
	const db = getFirestore(app);

	const connectionStatus = useNetInfo();
	useEffect(() => {
		if (connectionStatus.isConnected === false) {
			Alert.alert('Connection Lost!');
			disableNetwork(db);
		} else if (connectionStatus.isConnected === true) {
			enableNetwork(db);
		}
	}, [connectionStatus.isConnected]);

	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Start">
				<Stack.Screen
					name="Start"
					component={Start}
				/>
				<Stack.Screen name="Chat">
					{(props) => (
						<Chat
							isConnected={connectionStatus.isConnected}
							db={db}
							storage={storage}
							{...props}
						/>
					)}
				</Stack.Screen>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
