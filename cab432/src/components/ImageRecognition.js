import React, { useState, useEffect } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import axios from 'axios';
import { Spinner, Flex, Button } from '@chakra-ui/react';

function ImageRecognition({ setRecognitionCompleted, recognitionCompleted }) {
  const [model, setModel] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [imageSrc, setImageSrc] = useState(null);
  const [predictions, setPredictions] = useState([]);

  const loadModel = async() => {
    setIsModelLoading(true)
    try{
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
      setIsModelLoading(false)
    }
    catch(error) {
      console.log(error)
      setIsModelLoading(false)
    }
  }

  useEffect(() => {
    loadModel();
  }, []);


  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post('http://192.168.56.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      console.log(response.data.file);
      const imageURL = 'http://192.168.56.1:5000' + response.data.file;
      setImageSrc(imageURL);
      console.log(imageURL);
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

  const recognizeImage = async () => {
    if (model && imageSrc) {
      const imageElement = new Image();
      imageElement.crossOrigin = 'anonymous';
      imageElement.src = imageSrc;
  
      imageElement.onload = async () => {
        const token = localStorage.getItem('token');
        const predictions = await model.classify(imageElement);
        setPredictions(predictions);

        try {
          const response = await axios.post('http://192.168.56.1:5000/prediction_result', {
            imageUrl: imageSrc,
            predictions: predictions.map(prediction => ({
              className: prediction.className,
              probability: prediction.probability
            })),
          }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
  
          console.log('Predictions saved:', response.data);
          setRecognitionCompleted(!recognitionCompleted);
        } catch (error) {
          console.error('Error saving predictions:', error);
        }
      };
  
      imageElement.onerror = (error) => {
        console.error('Error loading image:', error);
      };
    }
  };

  if (isModelLoading) {
    return (
    <div>
      <Flex>
        <Spinner />
        <h2>Model is being loaded...</h2>
      </Flex>
    </div>
    )
  }
  return (
    <div>
      {/* only accepting image files*/}
      <input type="file" onChange={handleFileChange} />
      {imageSrc && (
        <div>
          <img id="uploaded-image" src={imageSrc} alt="Uploaded"/>
          <Button onClick={recognizeImage}>Recognize Image</Button>
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