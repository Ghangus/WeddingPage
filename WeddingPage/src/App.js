import React, { useState, useEffect } from "react";
import "./index.css";

function PictureAsPath({ picturePath }) {
  return (
    <div class="overflow-hidden w-screen h-screen flex justify-center items-center">
      <img
        class="w-full h-full object-scale-down"
        src={picturePath}
        alt="Wedding"
      />
    </div>
  );
}

function PictureAsFile({ picture }) {
  return (
    <div class="overflow-hidden w-screen h-screen flex justify-center items-center">
      <img
        class="w-full h-full object-scale-down"
        src={picture}
        alt="Wedding"
      />
    </div>
  );
}

function QrCodeHeader() {
  return (
    <div class="flex gap-4 absolute  p-4 rounded-md right-4 bottom-4">
      <div class="p-4 bg-white rounded-md max-w-52 backdrop-blur">
        <h1 className="text-black text-xl">
          Skanna och ladda upp era bilder! 📷
        </h1>
      </div>
      <div class="p-1 bg-white rounded-md backdrop-blur">
        <img
          class="rounded object-contain w-20"
          src={"qr_code_newtechcarlsson.png"}
          alt="Wedding"
        />
      </div>
    </div>
  );
}

function fetchImagePath(setImageCallback) {
  const apiUrl = "http://localhost:8080/get_random_file";
  const image1 = "/defaultImages/IMG_3946.png";
  const image2 = "/defaultImages/IMG_3951.jpg";

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      console.log("Fetched image path:", `/WeddingImages/${data}`);
      setImageCallback(`/WeddingImages/${data}`);
    })
    .catch((error) => {
      console.error("Error fetching image path using default images:", error);
      // return Math.random() > 0.5
      //   ? setImageCallback(image1)
      //   : setImageCallback(image2);
    });
}

function downladPicture(setImageCallback) {
  // const apiUrl = "http://localhost:8080/get_file";
  const apiUrl = "http://192.168.50.36:8080/get_file";
  const timestampedURL = apiUrl + "?timestamp=" + new Date().getTime();
  console.log("downladPicture fron URL: ", apiUrl);
  fetch(timestampedURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.blob();
    })
    .then((data) => {
      var imageUrl = URL.createObjectURL(data);
      setImageCallback(imageUrl);
    })
    .catch((error) => {
      console.error("Error fetching image path using default images:", error);
    });
}

function TestButton({ onButtonClick }) {
  return (
    <div className="flex justify-center">
      <button
        className="flex justify-center bg-gray-300 text-black py-2 px-4 hover:bg-gray-500 rounded"
        onClick={onButtonClick}
      >
        Test
      </button>
    </div>
  );
}

function App() {
  const [weddingPicturePath, setPicturePath] = useState(
    "/WeddingImages/IMG_3884.jpeg",
  );
  // const [pictureFile, setPictureFile] = useState(null);
  const [showDev, setShowDev] = useState(false);

  // Wrap fetchImagePath call to provide it with setPicturePath
  const handleButtonClick = () => fetchImagePath(setPicturePath);

  useEffect(() => {
    // Fetch the initial image path
    //fetchImagePath(setPicturePath);
    downladPicture(setPicturePath);

    // Set an interval to update the image path every 10 seconds
    const interval = setInterval(() => {
      // fetchImagePath(setPicturePath);
      downladPicture(setPicturePath);
    }, 10000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log(`Updated picture path: ${weddingPicturePath}`);
  }, [weddingPicturePath]);

  return (
    <div class="bg-black flex items-center">
      <div class="absolute flex gap-2 items-center top-3 right-3 transition">
        {showDev && <div class="bg-white/50 rounded-md px-4 py-1">hej</div>}
        <div
          class="rounded-full p-2 text-white hover:bg-gray-300/30 cursor-pointer"
          onClick={() => setShowDev(!showDev)}
        >
          ⚙️
        </div>
      </div>
      <PictureAsPath picturePath={weddingPicturePath} />
      <QrCodeHeader headerText />
    </div>
  );
}

export default App;
