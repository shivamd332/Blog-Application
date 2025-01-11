import { errorHandler } from "../Utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../Model/user.model.js";
const test = (req, res) => {
  res.json({ message: "API is working" });
};
export { test };

// Update made by user are tracked

export const updateUser = async (req, res, next) => {
  // console.log(req.user);

  // req.user.id come from the cookie store and req.params.userId from the request that the user requested

  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(
        errorHandler(400, "Password must be greater than 6 character")
      );
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20)
      return next(errorHandler(400, "Username must between 7 to 20 character"));
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, `Username can't contain space`));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, `Usename must be Lowercase`));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/))
      return next(errorHandler(400, "Username cannot have special character"));
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePic: req.body.profilePic,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
// deleting a User based on the  there userId >> Normal User
// this deleteUser function will also help the admin to delete the specify user from the DB >> Admin
export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin&&(req.user.id !== req.params.userId)) {
    return next(
      errorHandler(403, "You are not allowed to delete this account")
    );
  }
  try {
    // by this code you delete the user from the db
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User is deleted");
  } catch (error) {
    next(error);
  }
};

//signout functionality
export const signoutUser = (req, res, next) => {
  try {
    res.clearCookie('access_token').status(200).json("User has signout")
  } catch (error) {
    next(error)
  }
}
// this function will get the user data from the db for showing purpose to the admin
export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not an Admin, Hence you are not allowed to see all user"))
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;// here we are just setting the start index that we getting from the frontend
    const limit = parseInt(req.query.limit) || 7;//here we are just setting the limit that we getting from the frontend
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;
    const users = await User.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);//we are finding all the users in db that are present
    //userWithoutPassword is an array which store the each and every user that are present in db.
    //But we are separating the password and then storing in userWithoutPassword array
    const userWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    })
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthUser = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    })
    res.status(200).json({
      users: userWithoutPassword,
      totalUsers,
      lastMonthUser
    })

  } catch (error) {
    next(error)
  }
}

// this getUser can be access by anyone whether he is admin or not.
export let getUser=async (req,res,next)=>{
  try {
    const user=await User.findById(req.params.userId);
    if(!user){
      return next(errorHandler(404,"User not found"));
    }
    const {password,...rest}=user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error)
  }
}