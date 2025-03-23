import { View, StyleSheet, Platform, KeyboardAvoidingView, Alert } from "react-native";
import { useEffect, useState } from "react";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

const ChatScreen = ({ route, navigation, db, isConnected, storage }) => {
  const { userId, name, color } = route.params;
  const [messages, setMessages] = useState([]);


  useEffect(() => {
    navigation.setOptions({ title: name });

    let unsubscribe;

 //Load Cached Messages when offline
 const loadCachedMessages = async () => {
  try {
    const cachedMessages = await AsyncStorage.getItem("chat_messages") || "[]";
    setMessages(JSON.parse(cachedMessages));
  } catch (error) {
    console.error("Error loading cached messages:", error);
  }
};

if (isConnected) {
  if (unsubscribe) unsubscribe();

      const messagesRef = collection(db, "messages");
      const q = query(messagesRef, orderBy("createdAt", "desc"));

      unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt 
            ? (data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt.toMillis()))
            : new Date();

          return {
            _id: doc.id,
            text: data.text || "",
            createdAt: createdAt,
            user: data.user || { _id: "unknown" },
          };
        });

        setMessages(fetchedMessages);
        cacheMessages(fetchedMessages); //Cache messages
      },
      (error) => {
        console.error("Firestore error:", error);
        Alert.alert("Database Error", "Could not load messages");
      });
    } else {
      loadCachedMessages(); // Load from cache if offline
    }


    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isConnected]);

 //Cache Messages in AsyncStorage
 const cacheMessages = async (messagesToCache) => {
  try {
    await AsyncStorage.setItem("chat_messages", JSON.stringify(messagesToCache));
  } catch (error) {
    console.error("Error caching messages:", error);
  }
};

const onSend = async (newMessages = []) => {
  if (!isConnected) {
    Alert.alert("You are offline! Messages can't be sent.");
    return;
  }

  const message = newMessages[0];
  try {
    await addDoc(collection(db, "messages"), {
      _id: message._id,
      text: message.text,
      createdAt: serverTimestamp(),
      user: { _id: userId, name },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    Alert.alert("Error", "Failed to send message");
  }
};

//  Hide InputToolbar when offline
const renderInputToolbar = (props) => {
  if (isConnected) return <InputToolbar {...props} />;
  return null;
};


const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }

  const renderCustomActions = (props) => {
    return <CustomActions userID={userID} storage={storage} {...props} />;
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
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
  }



  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={messages => onSend(messages)}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        messagesContainerStyle={{ backgroundColor: color }}
        keyboardShouldPersistTaps="handled"
        user={{
          _id: userID,
          name
        }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  )
}






const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default ChatScreen;