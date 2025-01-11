import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'; //  react quill css file
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import{useNavigate} from 'react-router-dom'
export default function CreatePost() {
  const [file, setFile] = useState(null); // this state is made for tracking any image files is uploaded by user or not
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
const navigate=useNavigate();
  const handleUploadImage = async () => {
    // this function is made for handling the image will be uploaded in the firebase so that url can be made
    try {
      if (!file) {
        setImageUploadError("Please select an Image");
        return;
      }
      setImageUploadError(null);
      const fileName = new Date().getTime() + "-" + file.name; // by this we just creating a file name which is unique and file is the state that is made so tracking the image uploaded or not
      const storage = getStorage(app); //firebase
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file); // here we are uploading the image to the firebase
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  const handleSumbit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setTimeout(()=>navigate(`/post/${data.slug}`),1000)
        setPublishError(null);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };
  return (
    <>
      <section className=" p-2 max-w-3xl min-h-screen mx-auto">
        <h1 className="  text-center text-3xl  font-semibold my-7">
          Create a Post
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSumbit}>
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              className="flex-1"
              id="title"
              type="text"
              placeholder="Title"
              required
              onChange={(event) => {
                setFormData({ ...formData, title: event.target.value });
              }}
            />
            <Select
              onChange={(event) =>
                setFormData({ ...formData, category: event.target.value })
              }
            >
              <option value="uncategorized"> Select Category</option>
              <option value="javascript">JS</option>
              <option value="ReactJS">ReactJS</option>
              <option value="NodeJs">NodeJs</option>
              <option value="Express">Express</option>
              <option value="MongoDB">MongoDB</option>
            </Select>
          </div>
          <div className="flex gap-4 items-center  justify-between border-4 border-teal-500 border-dotted p-3">
            <FileInput
              type="file"
              accept="image/*"
              onChange={(event) => {
                setFile(event.target.files[0]);
                console.log(event.target.files);
              }}
            />
            {/*event.target.files[0] is selecting the first image uploaded */}
            <Button
              type="button"
              outline
              size="sm"
              gradientMonochrome="success"
              onClick={handleUploadImage}
              disabled={imageUploadProgress}
            >
              {imageUploadProgress ? (
                <div className="w-16 h-16">
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}`}
                  />
                </div>
              ) : (
                "Upload Image"
              )}
            </Button>
          </div>
          {imageUploadError && (
            <Alert color="failure">{imageUploadError}</Alert>
          )}
          {formData.image && (
            <img
              src={formData.image}
              alt="Uploaded Image"
              className="w-full h-72 object-cover"
            />
          )}
          <ReactQuill
            onChange={(value) => {
              setFormData({ ...formData, content: value });
            }}
            theme="snow"
            placeholder="Write something"
            className="h-64 mb-10 text-col"
          />
          <Button type="submit" gradientDuoTone="greenToBlue">
            Publish
          </Button>
          {publishError && (
            <Alert color="failure" icon={HiInformationCircle}>
              <span className="font-medium">Info alert!</span> {publishError}
            </Alert>
          )}
          
        </form>
      </section>
    </>
  );
}
