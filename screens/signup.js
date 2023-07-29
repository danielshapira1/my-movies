import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";



export default function Signup({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const db = getFirestore();


  const handleSignup = () => {
    if (email !== "" && password !== "" && age >= 18) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const userId = user.uid; // Use the Firebase user ID
  
          const usersCollectionRef = collection(db, "users");
          const userData = { id: userId, email: user.email, age };
          addDoc(usersCollectionRef, userData)
            .then(() => console.log("User added to Firestore successfully!"))
            .catch((err) => console.error("Error adding user to Firestore: ", err));
        })
        .catch((err) => Alert.alert("Error in Signup", err.message));
    } else {
      Alert.alert("Signup Error", "You must be 18 or older to sign up.");
    }
  };
  

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          autoFocus={true}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          secureTextEntry={true}
          autoCorrect={false}
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          value={age}
          onChangeText={(text) => setAge(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
            Sign Up
          </Text>
        </TouchableOpacity>
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Text style={{ color: "gray", fontWeight: "600", fontSize: 14 }}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: "#f57c00", fontWeight: "600", fontSize: 14 }}>
              {" "}
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141a29",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#D4AF37",
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  
  form: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: "#edb347",
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
});
