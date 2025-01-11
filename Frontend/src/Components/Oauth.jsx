import React from "react";
import { Button } from "flowbite-react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice.js";
import {useNavigate} from 'react-router-dom'
function Oauth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      //    console.log(resultsFromGoogle);
      // by this you can send data to backend
      const res = await fetch("api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          userProfilePicUrl: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/')
      }
      console.log(
        "this console if from Oauth.jsx in which data is coming from the backend after sending the data fetched from google  " +
          data
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Button
        type="button"
        outline
        gradientDuoTone="tealToLime"
        onClick={handleGoogleClick}
      >
        <FcGoogle className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>
    </>
  );
}

export default Oauth;
