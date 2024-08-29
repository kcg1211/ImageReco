import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Text, Flex, Card, CardHeader, CardBody, CardFooter, Stack, Heading, Button, Image } from "@chakra-ui/react";

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
            <Text fontSize='xl' fontWeight='bold' mb={4}>Prediction History</Text>
            <Box maxHeight="80vh" overflowY="scroll" >

                {history.length === 0 && <p>No prediction history available.</p>}
                {history.map((item, index) => (
                    <div key={index} style={{ marginBottom: '20px' }}>
                        <Flex flexWrap='wrap' gap='4'>
                            <Box maxW='container.sm'>
                                <img src={item.imageUrl} alt="Predicted" width="200px" />
                            </Box>
                            <Box alignItems='center' maxW='container.sm' flex='1' flexDir='column'>
                                <Text mb={3}>Prediction:</Text>
                                <Text fontSize='2xl'>
                                    {item.predictions[0].className}
                                </Text>
                                <Text mb={3}>
                                    {Math.round(item.predictions[0].probability * 100)}%
                                </Text>
                            </Box>
                        </Flex>
                        <hr></hr>
                    </div>
                ))}
            </Box>
        </div>
    );
}

export default PredictionHistory;