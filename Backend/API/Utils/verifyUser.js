import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; // here we accessing the token that is given to  the user by the help cookie-parser npm package in index file
  if (!token) return next(errorHandler(401, "Unauthorized"));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // jwt.verify () verifythe user based on the token saved in the browser cookie
    if (err) return next(errorHandler(401, "Unauthorized"));
    req.user=user;
    next(); // we are moving to the next function
  });
};

// in this file we are simply verifying the user by token present in the browser
