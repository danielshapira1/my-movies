import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { auth, firestore } from "../config/firebase";
import { signOut } from "firebase/auth";
import { fetchByTitle } from "../api/API";
import { addDoc, collection } from "firebase/firestore";

const Home = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Get the current user
  const user = auth.currentUser;

  const fetchData = async () => {
    if (searchQuery) {
      try {
        console.log("Sending API request with searchQuery:", searchQuery);
        const response = await fetchByTitle(searchQuery);
  
        if (!response || response?.Response === "False") {
          // Check if the API returned an error response or no response
          console.log("API Error Response:", response?.Error);
          setSearchResults([]);
        } else {
          console.log("API Response:");
        const titlesAndTypes = response.Search.map((result) => ({
          title: result.Title,
          type: result.Type,
        }));
        console.log(titlesAndTypes);
  
          // Filter the results to find entries that start with the search query
          const filteredResults = response.Search.filter((result) =>
            result.Title.toLowerCase().startsWith(searchQuery.toLowerCase())
          );
  
          // Limit the results to the first 5 items
          const firstFiveResults = filteredResults.slice(0, 5);
  
          setSearchResults(firstFiveResults);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
        setSearchResults([]);
      }
    } else {
      // If the search query is empty, reset the search results
      setSearchResults([]);
    }
  };
  

  useEffect(() => {
    let timeoutId;

    const handleSearch = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fetchData, 2000);
    };

    handleSearch();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const onSearchQueryChange = (text) => {
    setSearchQuery(text);
  };

  const onSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("Login"); 
      })
      .catch((error) => console.log(error));
  };

  const openResultPopup = (result) => {
    setSelectedResult(result);
    setIsModalVisible(true);
  };

  const closeResultPopup = () => {
    setSelectedResult(null);
    setIsModalVisible(false);
  };

  const addToFavorites = async () => {
    const { imdbID, Title, Poster, Type, Year } = selectedResult;
    const user = auth.currentUser;

    try {
      const docRef = await addDoc(collection(firestore, "favorites"), {
        imdbID,
        Title,
        Poster,
        Type,
        Year,
        userId: user.uid,
      });

      console.log("Favorite movie added successfully!");
      const favorite = {
        id: docRef.id,
        imdbID,
        Title,
        Type,
        Poster,
        Year,
      };
      setFavorites([...favorites, favorite]);
    } catch (error) {
      console.log("Error adding favorite movie:", error);
    }
  };

  const renderSearchResults = () => {
    return (
      <ScrollView style={styles.drawerContainer}>
        {searchResults.map((result) => (
          <TouchableOpacity
            key={result.imdbID}
            style={styles.resultItem}
            onPress={() => openResultPopup(result)}
          >
            <Text style={styles.resultTitle}>{result.Title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderResultPopup = () => {
    if (!selectedResult) {
      return null;
    }

    return (
      <Modal visible={isModalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.resultPopup}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeResultPopup}
            >
              <FontAwesome name="close" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={addToFavorites}
            >
              <FontAwesome name="heart" size={24} color="red" />
            </TouchableOpacity>
            <Text style={styles.resultTitle}>{selectedResult.Title}</Text>
            {selectedResult.Poster && (
              <Image
                source={{ uri: selectedResult.Poster }}
                style={styles.resultImage}
              />
            )}
            <Text style={styles.resultDescription}>
              Year: {selectedResult.Year}
            </Text>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#1976D2" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#9E9E9E"
          value={searchQuery}
          onChangeText={onSearchQueryChange}
        />
      </View>
      {searchResults.length > 0 ? (
        renderSearchResults()
      ) : (
        <Text style={styles.welcomeText}>Welcome Home</Text>
      )}
      <TouchableOpacity onPress={onSignOut} style={styles.logoutButton}>
        <MaterialIcons name="logout" size={24} color="white" />
      </TouchableOpacity>
      {renderResultPopup()}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#141a29", 
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1976D2",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#1976D2",
  },
  drawerContainer: {
    borderWidth: 1,
    borderColor: "#1976D2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    maxHeight: 300,
    overflow: "scroll",
  },
  favoriteItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  favoriteText: {
    marginLeft: 10,
    fontSize: 16,
  },
  resultImage: {
    width: 250,
    height: 250,
    marginBottom: 10,
    borderRadius: 10,
  },
  resultItem: {
    marginBottom: 10,
    backgroundColor: "#1e2c4d", 
    borderRadius: 10,
    padding: 10,
  },
  resultTitle: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
  },
  welcomeText: {
    fontWeight: "bold",
    color: "#D4AF37",
    fontSize: 25,
  },
  logoutButton: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
   
  },
  resultPopup: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  resultDescription: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
});
