import firebase from '@react-native-firebase/app'

export const firebaseConfig = {
    apiKey: "AIzaSyCup-kl-01z28xPPLr1brfYQCFH5PwXWrw",
    authDomain: "e-commerce-app-df4d1.firebaseapp.com",
    databaseURL: "https://e-commerce-app-df4d1-default-rtdb.firebaseio.com",
    projectId: "e-commerce-app-df4d1",
    storageBucket: "e-commerce-app-df4d1.appspot.com",
    messagingSenderId: "390077738469",
    appId: "1:390077738469:web:fe4e0934bf3392a523d30c",
    measurementId: "G-GV2M5RZLVN"
};

export const firebaseConfig2 = {
    apiKey: "AIzaSyBJ57pZGlHz2SpI0n6znBLWgwUJkBvrcc0",
    authDomain: "mt-react-f099d.firebaseapp.com",
    databaseURL: "https://mt-react-f099d-default-rtdb.firebaseio.com",
    projectId: "mt-react-f099d",
    storageBucket: "mt-react-f099d.appspot.com",
    messagingSenderId: "941565730225",
    appId: "1:941565730225:web:ff045714e88bc2c0053190"
}


const config = { name: 'SECONDARY_APP' };

export const secondaryApp = async () => {
    return await firebase.initializeApp(firebaseConfig2, config)
}
