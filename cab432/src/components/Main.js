import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Container, Flex, Text } from '@chakra-ui/react'
import ImageRecognition from 'components/ImageRecognition.js';
import PredictionHistory from 'components/PredictionHistory';

export default function Main(){

    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [recognitionCompleted, setRecognitionCompleted] = useState(false);

    const navigate = useNavigate(); 

    useEffect(() => {
        const authToken = localStorage.getItem('token'); 
        if (authToken) {
            setToken(authToken);
            GetUsername(authToken);
            setError('')
          }
          else {
            setError('No token found. Redirecting...');
            console.log(error);
            navigate('/401');//redirect to error page
          }
    }, [navigate]);

    async function GetUsername(authToken) {
        try {
            const response = await axios.get('http://192.168.56.1:5000/users/protected', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            console.log(response.data);
            const responseUsername = response.data.username;
            setUsername(responseUsername);
        } catch (error) {
            console.error('Error fetching username:', error.response || error.message);
            setError('Invalid token. Redirecting to login...');
            setUsername('');
            navigate('/401'); // Redirect to the login page if the token is invalid
        }
    }

    function handleLogout() {
        localStorage.removeItem('token');
        navigate('/'); // Redirect to login after logout
    }


    return(
        <div>
        <Container 
            maxW='100%' 
            display='flex' 
            justifyContent='space-between' 
            alignItems='center' 
            bg='#333333' 
            color='white' 
            py={3} 
            position="sticky"
            top={0}
            zIndex={1}
            mb={7}
        >
            <Flex alignItems='center'>
                <Text fontSize='xl' fontWeight='bold'>Image Recognition</Text>
            </Flex>
            <Flex alignItems="baseline">
                <Text mr={3}>Hi, {username}</Text>
                {error && <Text color="red.300">{error}</Text>}
                <Button variant='outline' onClick={handleLogout}>Logout</Button>
            </Flex>
        </Container>
        <Container maxW='container.xl'>
            <Flex justifyContent={"space-between"} gap='20'>
                <Box flex='0.6'>
                    <ImageRecognition setRecognitionCompleted={setRecognitionCompleted} recognitionCompleted={recognitionCompleted} />
                </Box>
                <Box flex='0.4'>
                    <PredictionHistory recognitionCompleted={recognitionCompleted} />
                </Box>
            </Flex>
        </Container>
        </div>
    )
}

