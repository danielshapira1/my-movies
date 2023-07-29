import { View, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import Login from "./screens/login";
import Signup from "./screens/signup";
import Home from "./screens/home";
import FavoritesScreen from "./screens/FavoritesScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      defaultScreenOptions={Home}
      screenOptions={{
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: "#E50914", // Netflix red when active
        tabBarInactiveTintColor: "#B9B9B9", // Light grey when inactive
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="favorite" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      defaultScreenOptions={Login}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      authenticatedUser ? setUser(authenticatedUser) : setUser(null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <BottomTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    borderTopWidth: 0,
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: "#141414", 
  },
});
