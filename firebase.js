import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCfi5jyV73ZwUAglxEl4JyFDsBov5wFfOg",
    authDomain: "whatsapp-clone-ba471.firebaseapp.com",
    projectId: "whatsapp-clone-ba471",
    storageBucket: "whatsapp-clone-ba471.appspot.com",
    messagingSenderId: "427103901807",
    appId: "1:427103901807:web:46765092c8482a5a61159a",
    measurementId: "G-42XBF3D773",
};

const app = !firebase.apps.length ?
    firebase.initializeApp(firebaseConfig) :
    firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();
export { db, auth, provider };