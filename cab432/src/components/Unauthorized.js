import { Button } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
    
    const navigate = useNavigate()

    function handleReturn() {
        navigate("/")
    }

    return(
    <React.Fragment>
        <div>
            <p>
                Error 401: Unauthorized
            </p>
        </div>
        <Button onClick={() => handleReturn()}>Go back</Button>
    </React.Fragment>
    )
}

