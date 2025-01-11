import React, { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TextInput, Button, Alert, Modal } from "flowbite-react";
import { FaRegUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { TbFaceIdError } from "react-icons/tb";
import { GrUpdate } from "react-icons/gr";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa6";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import { RiDeleteBin6Line } from "react-icons/ri";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
export default function Dashprofile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null); // this state is made so that we track the image file uploaded or not
  const [imageFileUrl, setImageFileUrl] = useState(null); // this state is made so that we change the profile as the img uploaded by user can't directly change the profilePic
  const [imageFileUploadingProgess, setImageFileUploadingProgess] =
    useState(null); // state track the how much file is uploaded
  const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
  const [formDataUpdate, setFormDataUpdate] = useState({}); // this state will handle the whatever data user update in there profile
  const [imageFileUploading, setImageFileUploading] = useState(false); // this state is made so that we track image file is in uploading phase or not
  const [updateUserSuccess, setupdateUserSuccess] = useState(null); // this state is made so to tell the update made by user is successfully updated
  const [updateUserError, setupdateUserError] = useState(null); //this state is made so to tell the update made by user is not updated successfully
  const [showModel, setShowModel] = useState(false);
  const filePickerRef = useRef(); //due to useRef() whenever we click on profile pic it will automatically open the file manager for profile pic selection

  const handleImageChange = (event) => {
    let file = event.target.files[0];
    if (file) {
      setImageFile(file); // due to this we are simply setting the file uploaded to the state
      setImageFileUrl(URL.createObjectURL(file)); // URL.createObjectURL() create a url for the image file
    }
  };
  // console.log(imageFileUrl);
  const uploadImage = async () => {
    // this is firebase code that take photo that we provide and produce a link for it
    //     service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write:if
    //       request.resource.size<2*1024*1024&&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true);
    setImageFileUploadingError(null);
    const storage = getStorage(app); // for this code visit react&nextjs project with sahand video 4:28:27
    const fileName = new Date().getTime() + imageFile.name; // filename is created with unquie name date and time is merged with the image name
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progess = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgess(progess.toFixed(0)); // toFixed() simply fix the decimal value
      },
      (error) => {
        setImageFileUploadingError(
          "Could not upload your image(file must be less than 2MB)"
        );
        setImageFileUploadingProgess(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormDataUpdate({ ...formDataUpdate, profilePic: downloadUrl }); //...formdataupdate will hold all the previous data that is there
          setImageFileUploading(false);
        });
      }
    );
  };
  // console.log(imageFileUploadingProgess, imageFileUploadingError);

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const handleChange = (event) => {
    // this function simply will handle the changes made in the input tag so that it can used for updating the data
    setFormDataUpdate({
      ...formDataUpdate,
      [event.target.id]: event.target.value,
    }); // event.target.id:event.target.value will update the formData respect to there id like event.target.username:event.target.value
    // console.log(event.target);
  };

  const handleSubmit = async (event) => {
    setupdateUserSuccess(null);
    setupdateUserError(null);
    event.preventDefault();
    if (Object.keys(formDataUpdate).length === 0) {
      //Object.keys(formData).length===0 checks the  formDataUpdate state is empty or we can say object is empty or not
      setupdateUserError("No changes is made");
      return;
    }
    if (imageFileUploading) {
      setupdateUserError("Please wait for image to upload");
      return;
    }
    try {
      dispatch(updateStart());
      // in the below code we send the data to backend from the frontend
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataUpdate),
      });
      // in the above code we send the data to backend from the frontend
      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setupdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setupdateUserSuccess("User  updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setupdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      dispatch(deleteUserStart());
      const response = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <section className="max-w-lg mx-auto p-3 w-full">
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={filePickerRef}
            hidden
          />
          <div
            className=" relative w-32 h-32 cursor-pointer self-center overflow-hidden"
            onClick={() => {
              filePickerRef.current.click();
            }}
          >
            {/* filePickerRef.current.click() due to this whenever we click on profile pic it refer to input tag with type=file*/}
            {imageFileUploadingProgess && (
              <CircularProgressbar
                value={imageFileUploadingProgess || 0}
                text={`${imageFileUploadingProgess}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  },
                  path: {
                    stroke: `rgba(62,152,199,${imageFileUploadingProgess / 100
                      })`,
                  },
                }}
              />
            )}
            <img
              src={imageFileUrl || currentUser.profilePic} // imageFileUrl fill replace the currentprofilepic when we upload a new profilepic
              alt="userImg"
              className="w-full h-full  rounded-full object-cover border-8 border-[lightgray]"
            />
          </div>
          {imageFileUploadingError && (
            <Alert color="failure" icon={TbFaceIdError}>
              <span className="font-medium">Info alert!</span>{" "}
              {imageFileUploadingError}
            </Alert>
          )}
          <TextInput
            type="text"
            id="username"
            icon={FaRegUser}
            placeholder="username"
            defaultValue={currentUser.username}
            onChange={handleChange}
          />
          <TextInput
            type="email"
            id="email"
            icon={MdEmail}
            placeholder="email"
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
          <TextInput
            type="password"
            id="password"
            icon={RiLockPasswordFill}
            placeholder="password"
            onChange={handleChange}
          />
          <Button
            type="submit"
            gradientDuoTone="pinkToOrange"
            disabled={loading || imageFileUploading}
          >
            <GrUpdate className="mr-2 h-5 w-5" />
            {loading ? "Loading..." : "Update"}
          </Button>
          {currentUser.isAdmin && (
            <Link to={'/create-post'}>
              <Button type="button" className="w-full" gradientDuoTone="purpleToPink">
                Create post
              </Button>
            </Link>
          )}
        </form>
        <div className="text-red-500 flex justify-between my-2">
          <span
            className="cursor-pointer"
            onClick={() => {
              setShowModel(true);
            }}
          >
            Delete account
          </span>
          <span className="cursor-pointer" onClick={handleSignOut}>
            Sign Out
          </span>
        </div>
        {updateUserSuccess && (
          <Alert color="success" icon={FaRegThumbsUp}>
            <span className="font-medium">Info alert!</span> {updateUserSuccess}
          </Alert>
        )}
        {updateUserError && (
          <Alert color="failure" icon={FaRegThumbsDown}>
            <span className="font-medium">Info alert!</span> {updateUserError}
          </Alert>
        )}
        {error && (
          <Alert color="failure" icon={FaRegThumbsDown}>
            <span className="font-medium">Info alert!</span> {error}
          </Alert>
        )}
        <Modal
          show={showModel}
          size="md"
          onClose={() => setShowModel(false)}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <RiDeleteBin6Line className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete your account?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteUser}>
                  {"Yes, I'm sure"}
                </Button>
                <Button color="gray" onClick={() => setShowModel(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </section>
    </>
  );
}
