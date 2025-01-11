import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: {
      type: String,
      default: "https://avatar.iran.liara.run/public/boy?username=Ash",
    },
    isAdmin: { type: Boolean, default: false }, //isAdmin is created so that we can user admin or not
  },
  { timestamps: true } // this is store at the time of creation because to capture the time of creation or time of update of a user for later sorting
);
const User = mongoose.model("User", userSchema);
export default User;
