import firebase from 'firebase/compat/app'
import { getDatabase, ref, get, child  } from "firebase/database";
import "firebase/compat/firestore";
// import px from "../../src/data.json";
console.log("hello from fb");
// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  apiKey: "AIzaSyB4ACkiOuK81PwW_2PtyIjxdmCq84YQN3c",
  authDomain: "trading-signals-cc1e9.firebaseapp.com",
  databaseURL: "https://trading-signals-cc1e9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "trading-signals-cc1e9",
  storageBucket: "trading-signals-cc1e9.appspot.com",
  messagingSenderId: "915194033834",
  appId: "1:915194033834:web:5ff9365a7a05b1bb6782d3",
  measurementId: "G-J9S1YFMRVQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
const fb = ref(getDatabase());
console.log(db)
const docref = "test/ICICIBANK"



const get_signals_history = async (ticker) => {
  let signals = []
  console.log("fetching signals for: ", ticker)
  await db.collection(`test/${ticker}/patterns`).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.data());
        signals.push(doc.data())
    });
  });
  return signals
}


const get_price_data = async (ticker) => {
  console.log("getting price data for: ", ticker)
  let ts = []
  await get(child(fb,`prices/daily/stocks/asia/india/${ticker}`)).then((snapshot) => {
    if (snapshot.exists()) {
      // console.log(snapshot.val());
      const data = snapshot.val();
      console.log("got data for ", ticker)
      // console.log(data)
      for (var key in data) {
        // const ds = key.split("-");
        // const time = new Date()
        // console.log(new Date(key));
        ts.push(data[key])
      }
      ts = ts.slice(-300)
      for (let index in ts){
        ts[index]['close'] = ts[index]['adjclose']
        ts[index]['time'] = ts[index]['date_utc']
        delete ts[index]['adjclose']
        delete ts[index]['date_utc']
        delete ts[index]['date']
        delete ts[index]['volume']
      }
      // console.log(ts)
      return(ts)
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.log(error)
  })
  return ts
}

export {
  get_signals_history,
  get_price_data
}