import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/esm/Button';

function JoinRoomPage() {
    const [state, setState] = useState({
        roomCode:"",
        error:""
    });
    const navigate = useNavigate();

    const roomCodeChange = (e) => {
        setState( prevState => {
             return{...prevState, roomCode:e.target.value}
        });
    }

    const roomButtonPressed = () => {
        const requestOptions = {
            method : "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                code: state.roomCode
            })
        };
        fetch("/api/join-room", requestOptions).then((response) => {
            if (response.ok) {
                navigate(`/room/${state.roomCode}`)
            } else {
                setState( prevState => {
                    return{...prevState, error:"Room not found."}
                })
            }
        }).catch((error) => {
            console.log(error);
        })
    }


    return ( 
        <Container style={{width:"40vw"}} className="text-center">
            {state.error && <Alert variant='danger'>{state.error}</Alert>}
            <Row>
                <Col>
                    <h1>Join a Room</h1>
                </Col>
            </Row>
            <Row>
                <Col className='p-2'>
                    <Form.Group>
                        <Form.Control 
                            className='text-center' 
                            type='text' 
                            placeholder='Enter The Room Code'
                            value={state.roomCode}
                            onChange={roomCodeChange}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col className='p-2'>
                    <Button onClick={roomButtonPressed}>ENTER ROOM</Button>
                </Col>
            </Row>
            <Row>
                <Col className='p-2'>
                    <Button href='/'>BACK</Button>
                </Col>
            </Row>
        </Container>
     );

    
}


export default JoinRoomPage;