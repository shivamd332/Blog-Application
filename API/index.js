import express from "express";
import mongoose from "mongoose";
import userRoutes from "./Routes/user.routes.js";
import authRoutes from "./Routes/auth.routes.js";
import postRoutes from "./Routes/post.routes.js"
import cookieParser from "cookie-parser"; // cookie-parser package is used for accessing the cookie
import commentRouter from './Routes/comment.routes.js'
import dotenv from "dotenv";

dotenv.config();
const app = express();
mongoose
  .connect(process.env.MONGODBPASSKEY)
  .then(() => {
    console.log("Our Mongodb database is connected");
  })
  .catch((err) => {
    console.log(err);
  });
// const __dirname=path.resolve();
  app.listen(3000, () => {
    console.log("Server is running on port 3000!!");
  });
  app.use(express.json());// express.json() allow us to send json to backend or allow json as the input to the backend
  app.use(cookieParser());

  app.use("/api/auth", authRoutes);// this route is for signup signin purpose
app.use("/api/user", userRoutes);// this route is for update signout purpose
app.use('/api/post',postRoutes);// this route is for creating post purpose
app.use('/api/comment',commentRouter);//this router is for creting comment in our db


//Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
