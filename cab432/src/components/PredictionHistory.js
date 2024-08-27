import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PredictionHistory({ recognitionCompleted }) {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://192.168.56.1:5000/prediction_history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log(response.data.predictions);
      const reversedHistory = [...response.data.predictions].reverse();
      setHistory(reversedHistory);
    } catch (error) {
      console.error('Error fetching prediction history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [recognitionCompleted]);

  return (
    <div>
      <h1>Prediction History</h1>
      {history.length === 0 && <p>No prediction history available.</p>}
      {history.map((item, index) => (
        <div key={index}>
          <h3>Image:</h3>
          <img src={item.imageUrl} alt="Predicted" width="200px"/>
          <h3>Predictions:</h3>
          <p>
            {item.predictions[0].className}: {Math.round(item.predictions[0].probability * 100)}%
          </p>
        </div>
      ))}
    </div>
  );
}

export default PredictionHistory;