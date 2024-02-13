import React, { useState, useEffect } from "react";
import "./index.css";

function WeddingPicture({ picturePath }) {
  return (
    <div className="flex justify-center h-screen">
      <img className="justify-center rounded" src={picturePath} alt="Wedding" />
    </div>
  );
}

function QrCodeHeader({ headerText }) {
  return (
    <div class="App-header">
      <h1 className="text-center text-black text-3xl">{headerText}</h1>
    </div>
  );
}

function fetchImagePath(setImageCallback) {
  const apiUrl = "http://localhost:8080/get_random_file";

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
      console.error("Error fetching image path:", error);
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
  const [headerText, setHeaderText] = useState("Ladda upp era bilder här!");
  const [weddingPicturePath, setPicturePath] = useState("/WeddingImages/IMG_3884.jpeg");

  // Wrap fetchImagePath call to provide it with setPicturePath
  const handleButtonClick = () => fetchImagePath(setPicturePath);

  useEffect(() => {
    // Fetch the initial image path
    fetchImagePath(setPicturePath);

    // Set an interval to update the image path every 10 seconds
    const interval = setInterval(() => {
      fetchImagePath(setPicturePath);
    }, 10000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
   }, []);

   useEffect(() => {
  	console.log(`Updated picture path: ${weddingPicturePath}`);
   }, [weddingPicturePath]);

  return (
    <div class="bg-gray-600">
      {/* <QrCodeHeader headerText={headerText} /> */}
      {/* <TestButton onButtonClick={handleButtonClick} /> */}
      <WeddingPicture picturePath={weddingPicturePath} />
    </div>
  );
}

export default App;

