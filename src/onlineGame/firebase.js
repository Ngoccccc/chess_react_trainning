import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth"
const firebaseConfig = {
    apiKey: "AIzaSyClcnMU0sKTNdIyBrHFRjz-n8F29uUtggw",
    authDomain: "chess-react-1cdbf.firebaseapp.com",
    projectId: "chess-react-1cdbf",
    storageBucket: "chess-react-1cdbf.appspot.com",
    messagingSenderId: "46041415233",
    appId: "1:46041415233:web:aa950af1733166bc3a50c0",
    measurementId: "G-8RLMVXWY01",
    databaseURL: "https://chess-react-1cdbf-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getDatabase(app)