import React, { useEffect } from 'react';
import Container from "react-bootstrap/Container";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';
import CreateRoomPage from './CreateRoomPage';
import JoinRoomPage from './JoinRoomPage';
import Room from './Room';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



function HomePage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    fetch("/api/user-in-room")
    .then((response) => response.json())
    .then((data) => {
      //setRoomCode(data.code)
      if (data.code) {
        navigate(`/room/${data.code}`)
      }
    })
  }, []);


  function mainContent() {
    return(
      <Container>
        <Row className='p-2'>
            <Col>
              <h1>Party Life</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <ButtonGroup>
                <Button variant="warning" href='/create'>Create A Room</Button>
                <Button variant='primary' href='/join'>Join A Room</Button>
              </ButtonGroup>
            </Col>
          </Row>
      </Container>
    );
  }

//return 

    return (
      <div className='d-flex align-items-center justify-content-center' style={{height:"100vh"}}>
        <div className="App text-center">
            <Routes>
              <Route exact path='/' element={mainContent()} />
              <Route exact path='/create' element={<CreateRoomPage />}></Route>
              <Route exact path='/join' element={<JoinRoomPage />}></Route>
              <Route path='/room/:roomCode' element={<Room />}></Route>
            </Routes>

        </div>
      </div>
        
    );
  }
  
  export default HomePage;