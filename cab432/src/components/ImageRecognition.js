import React, { useState, useEffect } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import axios from 'axios';

function ImageRecognition() {
  const [model, setModel] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  // const handleImageUpload = (event) => {
  //   console.log(event);
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImageSrc(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const response = await axios.post('http://192.168.56.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error.response) {
        console.log('Server responded with a status:', error.response.status);
        console.log('Response data:', error.response.data);
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // async function gettingFile() {
  //   try {
  //     const response = await axios.get('http://192.168.56.1:5000/users/protected', {
  //         headers: {
  //             Authorization: `Bearer ${authToken}`
  //         }
  //     });
  //     console.log(response.data);
  //     const responseUsername = response.data.username;
  //     setUsername(responseUsername);
  // } catch (error) {
  //     console.error('Error fetching username:', error.response || error.message);
  //     setError('Invalid token. Redirecting to login...');
  //     setUsername('');
  //     navigate('/401'); // Redirect to the login page if the token is invalid
  // }
  // }

  const recognizeImage = async () => {
    if (model && imageSrc) {
      const imageElement = document.getElementById('uploaded-image');
      const predictions = await model.classify(imageElement);
      setPredictions(predictions);
    }
  };

  return (
    <div>
      <h1>Image Recognition</h1>
      {/* only accepting image files*/}
      <input type="file" onChange={handleFileChange} />
      {imageSrc && (
        <div>
          <img id="uploaded-image" src={imageSrc} alt="Uploaded" />
          <button onClick={recognizeImage}>Recognize Image</button>
        </div>
      )}
      <div>
        {predictions && predictions.map((prediction, index) => (
          <p key={index}>{prediction.className}: {Math.round(prediction.probability * 100)}%</p>
        ))}
      </div>
    </div>
  );
}

export default ImageRecognition;