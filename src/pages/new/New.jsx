import "./new.scss";
import { Navbar } from "../../components/navbar/Navbar";
import { Sidebar } from "../../components/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const New = ({ inputs, title }) => {
  // To upload Image
  const [file, setFile] = useState("");

  // this is used to monitor the and store the value of the input
  const [data, setData] = useState({});

  //
  const [percentage, setPercentage] = useState(null);

  // this is to upload the image immediately to the storage after selecting the image
  useEffect(() => {
    const uploadFile = () => {
      // this is to create a unique name, to prevent the overwrite of files with same names "file.name"
      const name = new Date().getTime() + file.name;
      console.log(name);

      // going back to firebase docs
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPercentage(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prevData) => ({ ...prevData, img: downloadURL }));
          });
        }
      );
    };
    // if there's a file, we will call this function
    file && uploadFile();
  }, [file]);

  console.log(data);

  // this is used with the onChange method to take values written in the input the storing it to data state
  const handleInput = (e) => {
    // we can reach the data from the formSource
    const id = e.target.id;
    const value = e.target.value;

    // the spread operator "...data" is used here to keep the previous and add more value
    setData({ ...data, [id]: value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      // "data.email and data.password" are used since "data" above is the state managing inputs
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      // setDoc is used instead of addDoc becasue we have our custom id
      await setDoc(doc(db, "users", res.user.uid), {
        ...data,
        timestamp: serverTimestamp(),
      });
      console.log(res.id);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1 className="title">{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleAdd}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  onChange={(e) => {
                    // This is to take the first file
                    setFile(e.target.files[0]);
                  }}
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                />
              </div>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleInput}
                  />
                </div>
              ))}
              <button
                disabled={percentage !== null && percentage < 100}
                type="submit"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
