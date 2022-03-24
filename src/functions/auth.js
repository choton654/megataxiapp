import auth from '@react-native-firebase/auth';
import { clearAll, storeData } from "./asyncStorage"

export const handleSignup = async (
    { email, password },
    { authDispatch, setIsLoading },
    { setEmail, setPassword, setConfirmPassword },
    { setIsEmailError, setIsPassError },
    { setIsEmailErrorMsg, setPassErrorMsg },
    navigation) => {
    try {
        setIsLoading(true)
        // const { user } = await createUserWithEmailAndPassword(webAuth, email, password)
        const { user } = await auth().createUserWithEmailAndPassword(email, password)
        authDispatch({ type: 'SIGN UP', payload: user })
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setIsLoading(false)
        navigation.navigate("Drawer", { screen: "Sign In" })
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            setIsEmailError(true)
            setIsEmailErrorMsg('That email address is already in use!')
        }
        if (error.codde === 'auth/weak-password') {
            setIsPassError(true)
            setPassErrorMsg('Too weak password')
        }
        if (error.code === 'auth/invalid-email') {
            setIsEmailError(true)
            setIsEmailErrorMsg('That email address is invalid!')
        }
        setIsLoading(false)
    }
}

export const handleLogin = async (
    email, password, { setEmail, setPassword }, setIsLoading, authDispatch,
    { setEmailError, setPasswordError, setLoginError }, navigation) => {
    try {
        setIsLoading(true)
        // const { user } = await signInWithEmailAndPassword(webAuth, email, password)
        const { user } = await auth().signInWithEmailAndPassword(email, password)
        authDispatch({ type: 'SIGN UP', payload: user })
        setIsLoading(false)
        storeData("user", user)
        setEmail("")
        setPassword("")
        if (user.displayName && user.phoneNumber) {
            navigation.navigate("Drawer", { screen: "Order Taxi" })
        } else if (!user.displayName) {
            navigation.navigate("Stack", { screen: "GetName" })
        } else if (!user.phoneNumber) {
            navigation.navigate("Stack", { screen: "GetPhone" })
        }

    } catch (error) {
        console.log(error.code);
        if (error.code === 'auth/user-not-found') {
            setLoginError("User doesn't exists");
        } else if (error.code === 'auth/invalid-email') {
            setEmailError('That email address is invalid!');
        } else if (error.code === 'auth/too-many-requests') {
            setLoginError("Tried too many times.")
        } else {
            setPasswordError('Wrong password');
        }
        setIsLoading(false)
    }
}

export const updateUser = async (displayName, setisLoading,
    navigation, authDispatch, hideDialog) => {
    try {
        setisLoading(true)

        // const userData = await getData()
        // const password = await AsyncStorage.getItem('password')
        // console.log(password);
        // const { user } = await signInWithEmailAndPassword(webAuth, userData.email, password)
        // await updateProfile(user, { displayName })

        await auth().currentUser.updateProfile({ displayName })
        setisLoading(false)
        console.log('user updated', auth().currentUser.displayName);
        authDispatch({ type: 'ADD DISPLAY NAME', payload: auth().currentUser.displayName })
        navigation !== undefined && navigation.navigate("Stack", { screen: "GetPhone" })
        hideDialog !== undefined && hideDialog()

    } catch (error) {
        console.log(error.code);
        setisLoading(false)
    }
}

export const updateUserPhone = async (phone, setisLoading, navigation,
    authDispatch, setPhoneError, setisVerifyCodeLoading) => {
    try {
        setisLoading !== undefined && setisLoading(true)
        setisVerifyCodeLoading !== undefined && setisVerifyCodeLoading(true)
        // const confirmation = await auth().signInWithPhoneNumber(`+91${phone}`);

        const confirmation = await auth().verifyPhoneNumber(phone)
            .on('state_changed', (phoneAuthSnapshot) => {
                console.log('State: ', phoneAuthSnapshot.state);
            }, (error) => {
                console.error("error", error.code);
                setisLoading !== undefined && setisLoading(false)
                setisVerifyCodeLoading !== undefined && setisVerifyCodeLoading(false)
                setPhoneError !== undefined && setPhoneError(error.code)
            }, (phoneAuthSnapshot) => {
                console.log('Success', phoneAuthSnapshot);
            })

        authDispatch({ type: "SET PHONEVERIFY CONFIRMATION", payload: confirmation.verificationId })

        setisLoading !== undefined && setisLoading(false)
        setisVerifyCodeLoading !== undefined && setisVerifyCodeLoading(false)
        navigation !== undefined && navigation.navigate("Stack", { screen: "ValidatePhone" })

    } catch (error) {
        console.log(error);
        setPhoneError !== undefined && setPhoneError(error.code)
        setisLoading(false)
    }
}

export const confirmCode = async (code, token,
    setisLoading, navigation, authDispatch, setCodeError) => {
    try {
        setisLoading(true)

        // const credential = PhoneAuthProvider.credential(
        //     token,
        //     code
        // );
        // const user = webAuth.currentUser
        // await updatePhoneNumber(user, credential)

        // await confirm.confirm(code);

        // await auth().signInWithCredential(credential)

        const credential = auth.PhoneAuthProvider.credential(token, code)
        await auth().currentUser.updatePhoneNumber(credential)
        console.log("phone no verified", auth().currentUser.phoneNumber);

        setisLoading(false)
        authDispatch({ type: "SET PHONEVERIFY CONFIRMATION", payload: null })
        authDispatch({ type: 'ADD PHONE NUMBER', payload: auth().currentUser.phoneNumber })

        navigation.navigate("Drawer", { screen: "Order Taxi" })

    } catch (error) {
        console.log('Invalid code.', error);
        if (error.code === "auth/invalid-verification-code") {
            setCodeError("Code is not valid")
        } else if (error.code === "auth/credential-already-in-use") {
            setCodeError("This phone no is already associated with a different user account.")
        } else if (error.code === "auth/session-expired") {
            setCodeError("The sms code has expired. Please re-send the verification code to try again.")
        }
        setisLoading(false)
    }
}

export const forgotPassword = async (email, setisLoading) => {
    try {
        setisLoading(true)
        // await sendPasswordResetEmail(webAuth, email)
        await auth().sendPasswordResetEmail(email)
        setisLoading(false)
    } catch (error) {
        console.log(error);
        setisLoading(false)
    }
}

export const resetPassword = async (email, oldPassword, newPassword,
    setPasswordError, setIsLoading, hideDialog) => {
    try {
        setIsLoading(true)
        await auth().signInWithEmailAndPassword(email, oldPassword)
        await auth().currentUser.updatePassword(newPassword)
        hideDialog()
        console.log("password updated");
        setIsLoading(false)
    } catch (error) {
        console.log(error);
        if (error.code === 'auth/wrong-password') {
            setPasswordError("Wrong password");
        }
        setIsLoading(false)
    }
}

export const signoutUser = async (navigation, authDispatch) => {
    try {
        // await signOut(webAuth)
        await auth().signOut()
        authDispatch({ type: 'LOG OUT' })
        clearAll()
        navigation.navigate("Drawer", { screen: "Order Taxi" })
    } catch (error) {
        console.log(error);
    }
}


    // const provider = new PhoneAuthProvider(auth);
        // const verificationId = await provider.verifyPhoneNumber(`+91${phone}`, recaptchaVerifier.current);
        // console.log("result", verificationId);
        // window.recaptchaVerifier = new RecaptchaVerifier(recaptchaVerifier.current, {
        //     'size': 'invisible',
        //     'callback': (response) => {
        //         // reCAPTCHA solved, allow signInWithPhoneNumber.
        //         console.log("response", response);
        //     }
        // }, auth);
        // const appVerifier = window.recaptchaVerifier
        // const confirmationResult = await signInWithPhoneNumber(auth, `+91${phone}`, recaptchaVerifier.current)
        // console.log("confirmationResult", confirmationResult);