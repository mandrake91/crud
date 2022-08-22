import firebase from 'firebase/app' 
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAGsXiR8VMFUBGJxLnoR_AAGoqn3GUciAQ",  
    authDomain: "crud-47159.firebaseapp.com",  
    projectId: "crud-47159",  
    storageBucket: "crud-47159.appspot.com",  
    messagingSenderId: "222843314085",  
    appId: "1:222843314085:web:2b31b0298de6588ffc524c"  
  }

export const firebaseApp = firebase.initializeApp(firebaseConfig)
  