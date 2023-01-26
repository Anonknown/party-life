import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Cookies from 'js-cookie';



function CreateRoomPage(props) {

    const navigate = useNavigate();

    const [state, setState] = useState({
        guestCanPause: props.guestCanPause,
        votesToSkip: props.votesToSkip,
        successMsg: "",
        errorMsg: "",
        });

    const setGuestCanPause = (e) => {
        setState( prevState => {
            return {...prevState, guestCanPause:e.target.value === 'true' ? true:false}
        })
    }

    const setVotesToSkip = (e) => {
        setState( prevState => {
            return {...prevState, votesToSkip:e.target.value}
        })
    }

    const handleCreateRoomPressed = () => {
        const requestOptions = {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
                votes_to_skip:state.votesToSkip,
                guest_can_pause:state.guestCanPause
            })
        };
        fetch("/api/create-room", requestOptions).then((response) =>
        response.json()
        ).then((data) => navigate(`/room/${data.code}`));
    };

    /*function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');*/

    const csrftoken = Cookies.get('csrftoken');

    const handleUpdateRoomPressed = () => {
        const requestOptions = {
            method:"PATCH",
            headers:{
                "Content-Type":"application/json",
                'X-CSRFToken': csrftoken},
            body: JSON.stringify({
                guest_can_pause:state.guestCanPause,
                votes_to_skip:state.votesToSkip,
                code:props.roomCode
            })
        };
        fetch("/api/update-room", requestOptions)
        .then((response) => {
            if (response.ok) {
                setState( prevState => {
                    return{...prevState, successMsg:"Room updated successfully"}
                })
            } else {
                setState( prevState => {
                    return {...prevState, errorMsg:"Error updating room"}
                })
            }
        })
    }

    const title = props.update ? "Update Room" : "Create a Room";

    const renderCreateButtons = (
        <Container>
            <Row>
                <Col className='d-flex justify-content-center p-2'>
                    <Button onClick={handleCreateRoomPressed} variant='primary'>CREATE A ROOM</Button>
                </Col>
            </Row>
            <Row>
                <Col className='d-flex justify-content-center p-2'>
                    <Button href='/' variant='danger'>BACK</Button>
                </Col>
            </Row>
        </Container>
    );

    const renderUpdateButtons = (
        <Container>
            <Row>
                <Col className='d-flex justify-content-center p-2'>
                    <Button onClick={handleUpdateRoomPressed} variant='primary'>UPDATE ROOM</Button>
                </Col>
            </Row>
        </Container>
    )

    return ( 
        <Container style={{width:"40vw"}}>
            <Row>
                <Col>
                    {state.errorMsg && <Alert variant='danger'>{state.errorMsg}</Alert>}
                    {state.successMsg && <Alert variant='success'>{state.successMsg}</Alert>}
                </Col>
            </Row>
            <Row className='d-flex justify-content-center text-center'>
                <Col>
                    <h1>{title}</h1>
                    <p>Guest Contorl of Playback State</p>
                </Col>
            </Row>
            <Form>
                <Row className='d-flex justify-content-center text-center'>
                    <Form.Group  controlId="guestCanPauseTrue">
                        <Col className='d-flex justify-content-center'>
                            <Form.Check
                                type="radio"
                                id="play"
                                name="control"
                                value="true"
                                checked={state.guestCanPause === true}
                                onChange={setGuestCanPause}
                            />
                            <Form.Label>Play/Pause</Form.Label>
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="guestCanPauseFalse">
                        <Col className='d-flex justify-content-center'>
                            <Form.Check
                                type="radio"
                                id="no-control"
                                name="control"
                                value="false"
                                checked={state.guestCanPause === false}
                                onChange={setGuestCanPause}
                            />
                            <Form.Label>No Control</Form.Label>
                        </Col>
                    </Form.Group>
                </Row>
                <Row>
                    <Col className='d-flex justify-content-center text-center'>
                        <Form.Group>
                            <Form.Control 
                                className='text-center' 
                                type='number' 
                                defaultValue={state.votesToSkip} 
                                min="1"
                                onChange={setVotesToSkip}
                            />
                            <Form.Label><small>Votes Required to Skip Song</small></Form.Label>
                        </Form.Group>
                    </Col>
                </Row>
                {props.update ? renderUpdateButtons : renderCreateButtons}
            </Form>

        </Container>
     );
};

CreateRoomPage.defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update:false, 
    roomCode:null,
}

export default CreateRoomPage;