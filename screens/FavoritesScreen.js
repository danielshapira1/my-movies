import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { auth, firestore } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const FavoritesScreen = () => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [favoriteShows, setFavoriteShows] = useState([]);

  const fetchFavorites = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(firestore, "favorites"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const favorites = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter favorite movies
        const movies = favorites.filter(
          (favorite) => favorite.Type === "movie"
        );
        setFavoriteMovies(movies);

        // Filter favorite shows
        const shows = favorites.filter((favorite) => favorite.Type === "series");
        setFavoriteShows(shows);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
      return () => {}; // Clean up function to prevent re-fetching on unfocus
    }, [fetchFavorites])
  );

  const removeFromFavorites = (favoriteId) => {
    if (auth.currentUser) {
      // Fetch the favorite data before removing it
      const favoriteToRemove = favoriteMovies.find(
        (favorite) => favorite.id === favoriteId
      );

      deleteDoc(doc(firestore, "favorites", favoriteId))
        .then(() => {
          console.log(`Favorite "${favoriteToRemove?.Title}" removed successfully`);
          // Set favoritesChanged to true to trigger fetchFavorites after removal
          fetchFavorites();
        })
        .catch((error) => {
          console.error("Error removing favorite:", error);
        });
    }
  };

  const renderMovieItem = ({ item }) => {
    const favoriteTitle =
      item.Title.length > 11 ? `${item.Title.slice(0, 11)}...` : item.Title;

    return (
      <TouchableOpacity
        style={styles.movieItem}
        onPress={() => removeFromFavorites(item.id)}
      >
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} ellipsizeMode="tail" numberOfLines={1}>
            {favoriteTitle}
          </Text>
          
        </View>
        <Image source={{ uri: item.Poster }} style={styles.posterImage} />
        <FontAwesome name="heart"  size={24} color="#E50914" style={styles.heartIcon} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      <View style={styles.horizontalBox}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {favoriteMovies.length > 0 ? (
            favoriteMovies.map((movie) => (
              <React.Fragment key={movie.id}>
                {renderMovieItem({ item: movie })}
              </React.Fragment>
            ))
          ) : (
            <Text style={styles.emptyText}>No favorite movies yet</Text>
          )}
        </ScrollView>
      </View>
      <View style={styles.horizontalBox}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {favoriteShows.length > 0 ? (
            favoriteShows.map((show) => (
              <React.Fragment key={show.id}>
                {renderMovieItem({ item: show })}
              </React.Fragment>
            ))
          ) : (
            <Text style={styles.emptyText}>No favorite shows yet</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#141a29", 
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#D4AF37", 
  },
  horizontalBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 70,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
  },
  posterImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  movieInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  movieTitle: {
    fontSize: 16,
    flex: 1,
    color: "#fff",
  },
  emptyText: {
    fontSize: 16,
    marginTop: 20,
    color: "#fff", // Set text color to white (#fff)
  },
  heartIcon: {
    marginLeft: 5,
  },
});

export default FavoritesScreen;
