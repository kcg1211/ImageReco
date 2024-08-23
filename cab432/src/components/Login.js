import { Input, Stack, Box, Flex, Button } from '@chakra-ui/react'
import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Handle input changes
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        if (e.target.value.trim() === "") {
            setErrors((prevErrors) => ({ ...prevErrors, username: "Enter a username" }));
        } else {
            setErrors((prevErrors) => {
                const { username, ...rest } = prevErrors;
                return rest;
            });
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (e.target.value.trim() === "") {
            setErrors((prevErrors) => ({ ...prevErrors, password: "Enter a password" }));
        } else {
            setErrors((prevErrors) => {
                const { password, ...rest } = prevErrors;
                return rest;
            });
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        let formErrors = {};

        if (!username) {
            formErrors.username = "Enter a username";
        }

        if (!password) {
            formErrors.password = "Enter a password";
        }

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            setErrors({});
            console.log("Form Submitted Successfully");
            userLogin() //API call
            
        }}

        async function userLogin() {
            try {
                const response = await axios.post('http://192.168.56.1:5000/users/login', { username, password });
                localStorage.setItem('token', response.data.token);
                setMessage('Login successful!');
                navigate('/main');
            } catch (error) {
                setMessage('Login failed: ' + error.response.data.message);
            }
};

    return (
        <React.Fragment>
            <Flex align="center" justify="center">
                <form onSubmit={handleSubmit}>
                    <Stack spacing={5}>
                        <div>
                            <Input
                                placeholder='Username'
                                value={username} 
                                onChange={handleUsernameChange} 
                            />
                            {errors.username && <p>{errors.username}</p>}
                        </div>
                        <div>
                            <Input 
                                type='password'
                                placeholder='Password'
                                value={password} 
                                onChange={handlePasswordChange} 
                            />
                            {errors.password && <p>{errors.password}</p>}
                        </div>
                        <Button type="submit" >Login</Button>
                    </Stack>
                </form>
            </Flex>
            <p>{message}</p>
        </React.Fragment>
    );
}




export default Login;