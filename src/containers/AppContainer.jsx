import React from 'react'
import HomeContainer from './HomeContainer'
import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap'
import {BrowserRouter, Link, Routes,Route} from 'react-router-dom'
import AuthContainer from './AuthContainer.jsx'
import MyVerticallyCenteredModal from './Child.jsx'
export default function AppContainer() {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <BrowserRouter>
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <Navbar expand='lg'>
        <Container>
          <Navbar.Brand href='/'><img src="http://localhost:5174/src/assets/logo.png" style={{marginRight:10}} width={30} alt=""/>
            KERBEN</Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <button className={'password-btn'} onClick={() => setModalShow(true)}>Сменить пароль</button>
                <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                />
              <button className={'exit-btn'} as={Link} to={'/'}>Выйти</button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <HomeContainer/>
    </div>
      {/*<Routes>*/}
      {/*  <Route path={'/'} element={<AuthContainer/>}/>*/}
      {/*</Routes>*/}
    </BrowserRouter>
  )
}
