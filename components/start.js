import { StyleSheet, View, Text, Button, TextInput, TouchableOpacity, ImageBackground, Image, Alert } from "react-native";
import { useState } from "react";
import BackgroundImage from "../assets//Background-Image.png";
import TextIcon from "../assets/user.png";
import { getAuth, signInAnonymously } from "firebase/auth";
import { useNetInfo } from "@react-native-community/netinfo";

const StartScreen = ({ navigation, auth }) =>{

    const auth = getAuth();
    const [name, setName]= useState('');
    const [selectedColor, setSelectedColor]=useState('#090C08');

    const connectionStatus = useNetInfo(); 

    const handleStartChat = () => {
        if (!name.trim()) {
            Alert.alert("Please enter a name.");
            return;
        }

        if (!connectionStatus.isConnected) {
            Alert.alert("You are offline! Please connect to the internet to start chatting.");
            return;
        }


        signInAnonymously(auth)
            .then(userCredential => {
                const user = userCredential.user;
                navigation.navigate('Chat', { userId: user.uid, name, color: selectedColor, isConnected: connectionStatus.isConnected });
            })
            .catch(error => {
                Alert.alert("Authentication Error", error.message);
            });
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={BackgroundImage} style={styles.image}>
                <Text  style={styles.appTitle}>Chat App</Text>
                <View style={styles.inputContainer}>
                    <View style={styles.inputView}>
                        <Image source={TextIcon} style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            value={name}
                            onChangeText={setName}
                            placeholder="Your Name"
                            placeholderTextColor="#75708380"
                        />
                    </View>

                    <Text style={styles.chooseColorContainer}>Choose Background Color:</Text>
                    <View style={styles.colorOptions}>
                        {["#090C08", "#474056", "#8A95A5", "#B9C6AE"].map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[styles.colorCircle, { backgroundColor: color, borderWidth: selectedColor === color ? 3 : 1 }]}
                                onPress={() => setSelectedColor(color)}
                            />
                        ))}
                    </View>

                    <TouchableOpacity 
                        onPress={handleStartChat} 
                        style={styles.button}
                        disabled={!connectionStatus.isConnected}
                        >
                         <Text style={styles.buttonText}>
                            {connectionStatus.isConnected ? "Start Chatting" : "Offline"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center'
    },
    textInput: {
        width: "88%",
        padding: 15,
        borderWidth: 0,
        marginTop: 15,
        marginBottom: 15,
        alignItems: "center",
        width: "88%",
      },
      button: {
        backgroundColor: '#757083',
        padding: 15,
        borderRadius: 5,
        width:"100%",
        alignItems:"center",
        marginTop: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight:"600",
       
    },
    appTitle: {
        position: "absolute",
        top: 80,
        color: '#FFFFFF',
        fontSize: 45,
        fontWeight: "600",
        width: "100%",
        textAlign:"center"
    },
    inputContainer: {
        width: "88%",
        height: "44%",
        backgroundColor: "white",
        padding: 20,
        marginTop: 300,
   
       
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5
    },
    inputView: {
        marginTop: 1,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        padding: 6,
        height: 60

    },
    colorOptions: {
       flexDirection: "row",
       alignItems:"flex-start",
       gap: 15,
       marginBottom:20
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ccc"
     },
     chooseColorContainer:{
        justifyContent:"left",
        color:"#757083",
        fontWeight: "300",
        fontSize:16,
        marginBottom:15
        
     },
     image: {
        flex: 1,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
     },
     inputIcon: {
        width: 20,
        height: 20,
        color: 'black'
     }
     
});

export default StartScreen;