import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react'
import ImageRecognition from 'components/ImageRecognition.js';

export default function Main(){

    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
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
            <h1>
                Main
                <p>Hi, {username}</p>
                {error && <p>{error}</p>}
                <ImageRecognition />
                <Button onClick={() => handleLogout()}>Logout</Button>

            </h1>
        </div>
    )
}

