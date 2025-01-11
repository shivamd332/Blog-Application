import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Oauth from "../Components/Oauth";

export default function Signin() {
  const [formData, setFormData] = useState({});
  // const [errMessage, setErrMessage] = useState(null);
  // const [loading, setLoading] = useState(false);
  const {loading,error:errorMessage}=useSelector((state)=>state.user)// by useSelector() we are simply grabbing the global state loading and error attribute
  const dispatch = useDispatch();// and by useDispatch() we are able to the reducer that change global state of redux
  const navigate = useNavigate();
  const handleChange = (evt) => {
    const { id, value } = evt.target;    
    setFormData({ ...formData, [id]: value.trim() });
  };
  
  // console.log(formData);
  const handleSubmit = async (evt) => {
    evt.preventDefault(); // this funtion allow us to not refresh the page so that the data filled will stay
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the filed"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) dispatch(signInFailure(data.message));

      // setLoading(false);
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <>
      <section className="min-h-screen mt-20">
        <div className="flex max-w-3xl mx-auto flex-col md:flex-row md: items-center gap-5">
          {/*left side */}
          <div className="flex-1">
            <Link to="/" className=" dark:text-white text-4xl font-bold">
              <span className="px-2 py-1">MERN</span>
              Blog
            </Link>
            <p className="text-sm mt-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni
              similique amet nihil pariatur temporibus officiis, voluptatem sit
              quam eos neque accusamus. Quasi soluta sint tempora itaque. Enim
              totam temporibus nulla.
            </p>
          </div>
          {/*right side */}
          <div className="flex-1">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="Enter your Email"
                id="email"
                onChange={handleChange}
              />
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="Enter your Password"
                id="password"
                onChange={handleChange}
              />

              <Button pill gradientDuoTone="pinkToOrange" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner
                      color="failure"
                      aria-label="Spinner button example"
                      size="sm"
                    />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Signin"
                )}
              </Button>
              <Oauth/>
            </form>
            <div className=" flex gap-2 text-sm my-2">
              <span className="font-semibold"> Not have an account?</span>
              <Link to="/sign-up" className="text-blue-600">
                Signup
              </Link>
            </div>
            {errorMessage && (
              <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-medium">{errorMessage}</span>
              </Alert>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
