import VueFire from 'vuefire'
import Firebase from 'firebase'

let config = {
  apiKey: "AIzaSyCUOwdE9iUhiYf7QJoxIH8IloUNWQMZi7c",
  authDomain: "freetabletop.firebaseapp.com",
  databaseURL: "https://freetabletop.firebaseio.com",
  projectId: "freetabletop",
  storageBucket: "freetabletop.appspot.com",
  messagingSenderId: "979818624265"
};

var db = Firebase.initializeApp(config).database();
// var dbRef = db.ref();

export default db;


// import db from '../firebase';