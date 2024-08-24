import React, { useState, useEffect } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

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

  const handleImageUpload = (event) => {
    console.log(event);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
      <input type="file" accept="image/*" onChange={handleImageUpload} />
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