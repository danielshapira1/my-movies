// import firebase from "firebase/app";
// import "firebase/firestore";
// import { auth, db } from "../config/firebase";

// export const addToFavorites = async (selectedResult) => {
//   const user = firebase.auth().currentUser;
//   if (user) {
//     const favoritesRef = firebase.firestore().collection("favorites");
//     const favorite = {
//       userId: user.uid,
//       title: selectedResult.title,
//       image: selectedResult.image,
//     };

//     try {
//       const docRef = await favoritesRef.add(favorite);
//       return docRef.id;
//     } catch (error) {
//       console.error("Error adding favorite:", error);
//       return null;
//     }
//   }
// };

// export const removeFromFavorites = (favoriteId) => {
//   const user = firebase.auth().currentUser;
//   if (user) {
//     firebase.firestore().collection("favorites").doc(favoriteId).delete();
//   }
// };

// export const getFavorites = async () => {
//   const user = firebase.auth().currentUser;
//   if (user) {
//     const favoritesSnapshot = await firebase
//       .firestore()
//       .collection("favorites")
//       .where("userId", "==", user.uid)
//       .get();

//     const favoriteMovies = favoritesSnapshot.docs.map((doc) => doc.data());
//     return favoriteMovies;
//   } else {
//     return [];
//   }
// };
