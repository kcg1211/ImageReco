import React, { useState, useEffect } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import axios from 'axios';
import { Spinner, Flex, Button, Box, Spacer } from '@chakra-ui/react';
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "JPEG", "PNG", "GIF"];

function ImageRecognition({ setRecognitionCompleted, recognitionCompleted }) {

  const API_URL = process.env.REACT_APP_API_URL;

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

  // Image file upload with username being passed to backend to create directory
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      console.log(response.data.file);
      const imageURL = `${API_URL}` + response.data.file;
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

  const handleChange = (file) => {
    handleFileUpload(file);
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
          const response = await axios.post(`${API_URL}/prediction_result`, {
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
    <Box>
      <Flex>
        <Spinner mr={3} />
        <h2>Model is being loaded...</h2>
      </Flex>
    </Box>
    )
  }
  return (
    <Box maxH='80vh' mb={6}>
      {/* only accepting image files*/}
      <FileUploader handleChange={handleChange} name="file" types={fileTypes} />

        {imageSrc && (
          <React.Fragment>
            <Box mt={6} mb={6}>
              <img id="uploaded-image" src={imageSrc} alt="Uploaded" style={{maxHeight:"60vh"}}/>
            </Box>
            <Flex>
              <Button onClick={recognizeImage}>Recognize Image</Button>
              <Spacer />
                {predictions && predictions.map((prediction, index) => (
                  <React.Fragment>
                    <Flex>
                      <p key={index}><b>{prediction.className}: </b><br></br>
                      {Math.round(prediction.probability * 100)}%</p>
                    </Flex>
                    <Spacer />
                  </React.Fragment>
                ))}
            </Flex>
          </React.Fragment>
        )}

    </Box>
  );
}

export default ImageRecognition;