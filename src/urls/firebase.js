import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDZnNzVFUiYhJuEdB5YDaC9PlXWI8pvdfc",
    authDomain: "swriel-e95ba.firebaseapp.com",
    projectId: "swriel-e95ba",
    storageBucket: "swriel-e95ba.appspot.com",
    messagingSenderId: "336261800140",
    appId: "1:336261800140:web:a6b6d67abb7dcdefc12269",
    measurementId: "G-4JGN3G3K15"
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
export default storage;