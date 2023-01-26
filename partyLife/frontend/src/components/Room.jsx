import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/esm/Button';
import CreateRoomPage from './CreateRoomPage';


function Room(props) {
    const [state, setState] = useState({
        votesToSkip:2,
        guestCanPause:false,
        isHost:false,
    })
    const [settings, setSettings] = useState(false)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (!settings) {
            fetch("/api/get-room" + "?code=" + params.roomCode)
            .then((response) => {
                if (!response.ok) {
                    navigate("/")
                }
                return response.json()
            })
            .then((data) => {
                setState( prevState => {
                    return {...prevState, 
                        votesToSkip:data.votes_to_skip,
                        guestCanPause:data.guest_can_pause,
                        isHost:data.is_host
                    }
                })
            })
        }
        
      }, [settings]);


    const leaveButtonPressed = () => {
    const requestOptions = {
        method:"POST",
        headers: {"Content-Type":"application/json"},
    }
    fetch("/api/leave-room", requestOptions).then((_response) => {
        navigate("/");
    });
    }

    const updateShowSettings = (e) => {
        setSettings(settings === false ? true:false);
    };

    const settingsButton = (
        <Button variant={settings && 'danger' || 'primary'} onClick={updateShowSettings}>
            {settings && "CLOSE" || "Settings"}
        </Button>
    )

    const renderSettings = (
        <div>
            <Row>
                <Col>
                    <CreateRoomPage 
                        update={true} 
                        votesToSkip={state.votesToSkip} 
                        guestCanPause={state.guestCanPause}
                        roomCode={params.roomCode}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    {settingsButton}
                </Col>
            </Row>
        </div>
    );


    const renderSettingsButton = (
        <Row>
            <Col>
                {settingsButton}
            </Col>
        </Row>
    );
    

    if (settings) {
        return renderSettings;
    }
    return ( 
        <div>
            <Row className='p-2'>
                <Col>
                    <h4>Code: {params.roomCode} </h4>
                </Col>
            </Row>
            <Row className='p-2'>
                <Col>
                    <h6>Votes: {state.votesToSkip} </h6>
                </Col>
            </Row>
            <Row className='p-2'>
                <Col>
                    <h6>Guest Can Pause: {state.guestCanPause.toString()} </h6>
                </Col>
            </Row>
            <Row className='p-2'>
                <Col>
                    <h6>Host: {state.isHost.toString()} </h6>
                </Col>
            </Row>
            {state.isHost && renderSettingsButton}
            <Row className='p-2'>
                <Col>
                    <Button variant='danger' onClick={leaveButtonPressed}>LEAVE ROOM</Button>
                </Col>
            </Row>
        </div>
    );
}

export default Room;
