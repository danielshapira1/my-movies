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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";


export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => console.log("Loged in successfully!"))
        .catch((err) => Alert.alert("Error in login", err.message));
    }
  };

  return (
    <View style={styles.container}>
      
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>Login</Text>
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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
            Log In
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
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={{ color: "#f57c00", fontWeight: "600", fontSize: 14 }}>
              {" "}
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
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