import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Center, Container, Flex } from '@chakra-ui/react'
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
            <Container maxW='container.lg' display='flex' justifyContent={"space-between"}>
                <Flex alignItems={'center'}>
                    <h1>Image Recognition</h1>
                </Flex>
                <Flex alignItems="baseline">
                    <p>Hi, {username}</p>
                    {error && <p>{error}</p>}
                    <span>
                        <Button onClick={() => handleLogout()}>Logout</Button>
                    </span>
                </Flex>
            </Container>
            <Container maxW='container.lg'>
                <Flex justifyContent={"space-between"}>
                    <Box maxW={'500px'}>
                        <ImageRecognition setRecognitionCompleted={setRecognitionCompleted} recognitionCompleted={recognitionCompleted} />
                    </Box>
                    <Box w='400px'>
                        <PredictionHistory recognitionCompleted={recognitionCompleted} />
                    </Box>
                </Flex>
            
            </Container>
        </div>
    )
}

