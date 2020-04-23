import Rebase  from 're-base';
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCkGmk1_j1CmSkdQrRfmBduVtQWOvOLWI0",
    authDomain: "catch-of-the-day-gabriel-ce4a3.firebaseapp.com",
    databaseURL: "https://catch-of-the-day-gabriel-ce4a3.firebaseio.com"
  })

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };

export default base;