import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link,useNavigate} from "react-router-dom";
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";
import Oauth from "../Components/Oauth";

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [errMessage, setErrMessage] = useState(null);// this state is made so that we can notify the user that an error occurred
  const [loading, setLoading] = useState(false);//this state is simply made so that we can display the loading effect
  const navigate=useNavigate()// useNavigate hook of react-router-dom is used to take the user to another page without the reload
  const handleChange = (evt) => {
    const { id, value } = evt.target;
    setFormData({ ...formData, [id]: value.trim() });
  };
  console.log(formData);
  const handleSubmit = async (evt) => {
    evt.preventDefault(); // this funtion allow us to not refresh the page so that the data filled will stay
    if (!formData.username || !formData.email || !formData.password) {
      return setErrMessage("Please fill all the filed");
    }
    try {
      setLoading(true);
      setErrMessage(null);//this is cleaning the previous error that was there
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) return setErrMessage(data.message);

      setLoading(false);
      if(res.ok) navigate('/sign-in')
    } catch (error) {
      setErrMessage(error.message);
      setLoading(false);
    }
  };
  return (
    <>
      <section className="min-h-screen mt-20 border-4 border-green-600">
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
              <Label value="Username" />
              <TextInput
                type="text"
                placeholder="Enter your Username"
                id="username"
                onChange={handleChange}
              />
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

              <Button pill gradientDuoTone="purpleToBlue" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner color='failure' aria-label="Spinner button example" size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
              <Oauth/>
            </form>
            <div className=" flex gap-2 text-sm my-2">
              <span className="font-semibold">Have an account?</span>
              <Link to="/sign-in" className="text-blue-600">
                SignIn
              </Link>
            </div>
            {errMessage && (
              <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-medium">{errMessage}</span>
              </Alert>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
