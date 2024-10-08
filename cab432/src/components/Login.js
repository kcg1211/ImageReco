import { Input, Stack, Box, Flex, Button, Container, Text } from '@chakra-ui/react'
import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import style from 'css/Login.module.css'

function Login() {

    const API_URL = process.env.REACT_APP_API_URL;

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
                console.log(API_URL)
                const response = await axios.post(`${API_URL}/users/login`, { username, password });
                localStorage.setItem('token', response.data.token);
                setMessage('Login successful!');
                navigate('/main');
            } catch (error) {
                console.log(error.response.data.message)
                setMessage('Login failed: ' + error.response.data.message);
            }
};

    return (
        <React.Fragment>
            <div className={`${style.background}`}>
                <Container borderRadius="md">
                    <Flex align="center" justify="center" direction="column" width="100%" minHeight="100vh">
                        <Stack spacing={5} px={16} py={8} bg="rgba(51, 51, 51, 0.8)" borderRadius={20}>
                            <Box as="h2" textAlign="center">
                                <Text fontSize='xl' color='white'>Image Recognition</Text>
                            </Box>
                            <Box>
                                <form onSubmit={handleSubmit}>
                                    <Stack spacing={5}>
                                        <div>
                                            <Input
                                                placeholder='Username'
                                                value={username} 
                                                onChange={handleUsernameChange} 
                                                bg="white"
                                            />
                                            {errors.username && <Text color='white'>{errors.username}</Text>}
                                        </div>
                                        <div>
                                            <Input 
                                                type='password'
                                                placeholder='Password'
                                                value={password} 
                                                onChange={handlePasswordChange}
                                                bg="white"
                                            />
                                            {errors.password && <Text color='white'>{errors.password}</Text>}
                                        </div>
                                        <Button type="submit" >Login</Button>
                                        <Text color='white'>{message}</Text>
                                    </Stack>
                                </form>
                            </Box>
                        </Stack>
                    </Flex>
                </Container>
            </div>
        </React.Fragment>
    );
}




export default Login;