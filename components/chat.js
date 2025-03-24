import { useEffect, useState } from 'react';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import {
	getDoc,
	collection,
	addDoc,
	onSnapshot,
	query,
	orderBy,
} from 'firebase/firestore';
import {
	StyleSheet,
	View,
	Text,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ route, navigation, db, isConnected, storage }) => {
	const [messages, setMessages] = useState([]);
	const { name, backgroundColor, userID } = route.params;

	const onSend = (newMessages) => {
		addDoc(collection(db, 'messages'), newMessages[0]);
	};

	const renderInputToolbar = (props) => {
		if (isConnected) return <InputToolbar {...props} />;
		else return null;
	};

	const renderCustomActions = (props) => {
		return (
			<CustomActions
				userID={userID}
				storage={storage}
				{...props}
			/>
		);
	};

	const renderCustomView = (props) => {
		const { currentMessage } = props;
		if (currentMessage.location) {
			return (
				<MapView
					style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
					region={{
						latitude: currentMessage.location.latitude,
						longitude: currentMessage.location.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				/>
			);
		}
		return null;
	};

	const renderBubble = (props) => {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					right: {
						backgroundColor: '#000',
					},
					left: {
						backgroundColor: '#FFF',
					},
				}}
			/>
		);
	};

	useEffect(() => {
		navigation.setOptions({ title: name });

		let unsubMessages;
		if (isConnected === true) {
			if (unsubMessages) unsubMessages();
			unsubMessages = null;

			const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
			unsubMessages = onSnapshot(q, (documentsSnapshot) => {
				let newMessages = [];
				documentsSnapshot.forEach((doc) => {
					newMessages.push({
						id: doc.id,
						...doc.data(),
						createdAt: new Date(doc.data().createdAt.toMillis()),
					});
				});
				cacheMessages(newMessages);
				setMessages(newMessages);
			});
		} else loadCachedMessages();

		// Clean up code
		return () => {
			if (unsubMessages) unsubMessages();
		};
	}, [isConnected]);

	const cacheMessages = async (messagesToCache) => {
		try {
			await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
		} catch (error) {
			console.log(error.message);
		}
	};

	const loadCachedMessages = async () => {
		const loadCachedMessages = (await AsyncStorage.getItem('messages')) || [];
		setMessages(JSON.parse(cachedMessages));
	};

	return (
		<View style={[styles.container, { backgroundColor: backgroundColor }]}>
			<GiftedChat
				messages={messages}
				renderBubble={renderBubble}
				renderInputToolbar={renderInputToolbar}
				onSend={(messages) => onSend(messages)}
				renderActions={renderCustomActions}
				renderCustomView={renderCustomView}
				user={{
					_id: userID,
					name: name,
				}}
			/>
			{Platform.OS === 'android' ? (
				<KeyboardAvoidingView behavior="height" />
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default Chat;
