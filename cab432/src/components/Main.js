import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Main(){

    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const [token, setToken] = useState('')

    async function GetUsername() {
        try {
            const response = await axios.get('http://192.168.56.1:5000/users/protected', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            const responseUsername = response.data.username;
            // const error = response.data.message;
            setUsername(responseUsername);
            // setError(error)
        } catch (error) {
            console.error('Error fetching username:', error.response || error.message);
            // setError(error)
            setUsername('');
        }
    }

    // can't get token at the first load. Add try catch?
    useEffect(() => {
        const authToken = localStorage.getItem('token'); 
        if (authToken) {
            setToken(authToken);
          }
          else {
            //redirect to error page
          }
        GetUsername()
    }, []);

    return(
        <div>
            <h1>
                Main
                <p>Hi, {username}</p>
                <p>{error}</p>

            </h1>
        </div>
    )
}

