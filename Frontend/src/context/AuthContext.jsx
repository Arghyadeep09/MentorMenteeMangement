import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      // Extract user info from Firebase response
      const userData = {
        id: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        profilePic: result.user.photoURL,
      };

      setUser(userData); // Store in state
      localStorage.setItem("user", JSON.stringify(userData)); // Persist data
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("user"); // Clear stored user data
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")); // Retrieve stored user data
    if (storedUser) setUser(storedUser);

    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          profilePic: firebaseUser.photoURL,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Save in localStorage
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ googleSignIn, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
