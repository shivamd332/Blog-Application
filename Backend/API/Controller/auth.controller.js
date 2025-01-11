import User from "../Model/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../Utils/error.js";
import jwt from "jsonwebtoken";

//Sign Up

const signup = async (req, res, next) => {
  const { username, email, password } = req.body; // we are getting the data whatever is coming form the frontend part
  if (
    !username ||
    !email ||
    !password ||
    !username === "" ||
    !email === "" ||
    !password === ""
  ) {
    next(errorHandler(400, "All filed are required")); // if nothing is provided by the user it will show the error
  }
  if(!email.includes('@gmail.com'))
    next(errorHandler(400,"Please Enter the valid mail"))
  const hashedPassword = bcryptjs.hashSync(password, 10);// we are hashing the password with the help of bcryptjs npm package and 10 is salt or we can it number times which is mixed with our password
  const newUser = new User({ username, email, password: hashedPassword }); // this is simply creating user in mongodb                       
  try {
    await newUser.save();// .save() is saving the data into the mongodb  database
    res.json("Signup success");
  } catch (error) {
    next(error); // it mode to the next() middleware in our case it's the function present in the index.js
  }
};

//Sign In
const signin = async (req, res, next) => {
  // next param is use for handling error
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "")
    return next(errorHandler(400, "All field are required")); // errorHandler is function to handle error
  try {
    const validUser = await User.findOne({ email });// through this line we looking into our db and checking if the user is present or not
    if (!validUser) {
      return next(errorHandler(401, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);// we are comparing the password provided by the user and hashpassword store in the db
    if (!validPassword) return next(401, "Invalid password");
    // from jwt we are creating token,which will be unique for every user and storing into the frontend
    const token = jwt.sign(
      {
        id: validUser._id,
        isAdmin:validUser.isAdmin
      },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = validUser._doc; // in this we separating the password from the rest of thing that are stored in db
    // and this rest is send to frontend
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json({ message: "Signin successful", user: rest });
  } catch (error) {
    next(error);
  }
};


const google = async (req, res, next) => {
  const { name, email, userProfilePicUrl } = req.body;
  try {
    const user = await User.findOne({ email }); //this is check the user present or not in database
    if (user) {
      //user is present
      const token = jwt.sign({ id: user.id,isAdmin:user.isAdmin }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc; //in this we sepreate the password and rest  data which is fetched from the database
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest); // by this code we are simply sending the status code,token,and sending the rest data which fetched form the db to frontend
    } else {
      //user Not present
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8); // by this code we are  just creating random password for the user as signin with google didn't created password
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: name.toLowerCase(),
        email: email,
        password: hashedPassword,
        profilePic: userProfilePicUrl,
      });
      await newUser.save(); // this code save the new user to db
      const token = jwt.sign({ id: user._id,isAdmin:newUser.isAdmin }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export { signup, signin, google };
