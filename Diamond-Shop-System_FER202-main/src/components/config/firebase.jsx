import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  setDoc,
  getDoc,
} from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyA7sExMlaS4X-ReZV4mJb1jQS2LjORcsew",
  authDomain: "apitestcase-14266.firebaseapp.com",
  databaseURL:
    "https://apitestcase-14266-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "apitestcase-14266",
  storageBucket: "apitestcase-14266.appspot.com",
  messagingSenderId: "1068006808791",
  appId: "1:1068006808791:web:697cedf5d74084cab62492",
  measurementId: "G-RW0BF0Y9RF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("user_id", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      const userData = doc(db, "users", user.uid);
      await setDoc(userData, {
        user_id: user.uid,
        fullname: user.displayName,
        gender: "",
        avatar: user.photoURL,
        email: user.email,
        account_status: "",
        auth: "",
        authProvider: "google",
        phone: "",
        address_shipping: "",
        role: false,
      });
    }
    localStorage.setItem("user_id", user.uid);
    const userDataRef = doc(db, "users", user.uid);
    const userDataSnap = await getDoc(userDataRef);
    const userDataDoc = userDataSnap.data();
    localStorage.setItem("userData", JSON.stringify(userDataDoc));
    return { uid: user.uid, displayName: user.displayName };
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const userData = doc(db, "users", user.uid);
    await setDoc(userData, {
      user_id: user.uid,
      fullname: user.displayName,
      gender: "",
      avatar: user.photoURL,
      email: user.email,
      account_status: "",
      auth: "",
      authProvider: "google",
      phone: "",
      address_shipping: "",
      role: false,
    });
    localStorage.setItem("user_id", user.uid);
    const userDataRef = doc(db, "users", user.uid);
    const userDataSnap = await getDoc(userDataRef);
    const userDataDoc = userDataSnap.data();
    localStorage.setItem("userData", JSON.stringify(userDataDoc));
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
    // test
  }
};
const logout = () => {
  signOut(auth);
};

async function sendMessage(roomId, user, text) {
  try {
    await addDoc(collection(db, "chat-rooms", roomId, "messages"), {
      uid: user.uid,
      displayName: user.displayName,
      text: text.trim(),
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
  }
}

function getMessages(roomId, callback) {
  return onSnapshot(
    query(
      collection(db, "chat-rooms", roomId, "messages"),
      orderBy("timestamp", "asc")
    ),
    (querySnapshot) => {
      const messages = querySnapshot.docs.map((x) => ({
        id: x.id,
        ...x.data(),
      }));

      callback(messages);
    }
  );
}

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getMessages,
  sendMessage,
};
