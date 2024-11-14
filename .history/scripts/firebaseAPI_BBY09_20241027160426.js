//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyBiM6PhAQn73fyi2kGCRuujR1lb_jz2PAI",
    authDomain: "comp1800-bby-09.firebaseapp.com",
    projectId: "comp1800-bby-09",
    storageBucket: "comp1800-bby-09.appspot.com",
    messagingSenderId: "453868759388",
    appId: "1:453868759388:web:78e6b9deb8512ebf353999"
  };

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();