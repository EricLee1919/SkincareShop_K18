import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { signInWithGoogle, auth as firebaseAuth } from "../components/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const AuthContext = React.createContext();

const auth = getAuth();
const db = getFirestore(); // Initialize Firestore

const AuthProvider = (props) => {
  const [user] = useAuthState(auth);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async (uid) => {
      const userDoc = doc(db, "users", uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    };

    if (user) {
      console.log(user.uid); // user ID
      console.log(user.email); // user email
      console.log(user.displayName); // user display name
      console.log(user.photoURL); // user photo URL
      fetchUserData(user.uid).then((userData) => {
        if (userData) {
          const userWithRole = {
            user_id: user.uid,
            email: user.email,
            fullname: user.displayName,
            avatar: user.photoURL,
            role: userData.role, // Lấy role từ cơ sở dữ liệu
          };
          localStorage.setItem("userData", JSON.stringify(userWithRole));
          setAuthUser(userWithRole);
        }
      });
    } else {
      localStorage.removeItem("userData");
      setAuthUser(null);
    }
  }, [user]);

  const login = async () => {
    try {
      const result = await signInWithGoogle();
      localStorage.setItem("userChat", result);
      const user = result.user;
      if (user) { 
        const userData = await fetchUserData(user.uid);
        if (userData) {
          const userWithRole = {
            user_id: user.uid,
            email: user.email,
            fullname: user.displayName,
            avatar: user.photoURL,
            role: userData.role,
          };
          localStorage.setItem("userData", JSON.stringify(userWithRole));
          setAuthUser(userWithRole);
        }
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    auth.signOut();
    localStorage.removeItem("userData");
    setAuthUser(null);
  };

  const value = { user: authUser, login, logout };

  return <AuthContext.Provider value={value} {...props} />;
};

export { AuthContext, AuthProvider };
