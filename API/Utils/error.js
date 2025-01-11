export const errorHandler=(statusCode,message)=>{
     // this function is simply getting the error from the various part of the backend file and generating a new error object and returning it to the part from where the error came
     const error= new Error();
     error.statusCode=statusCode;
     error.message=message;
     return error;
}