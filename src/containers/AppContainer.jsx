import HomeContainer from './HomeContainer.jsx'
import {Container, Nav, Navbar} from 'react-bootstrap'
import {useContext, useState} from 'react'
import {RootContext} from '../utils/context.js'
import ChangePasswordModalComponent from '../components/ChangePasswordModalComponent.jsx'

export default function AppContainer() {
  const root = useContext(RootContext)

  const [changePasswordModal, setChangePasswordModal] = useState(false)

  return (
    <>
      <ChangePasswordModalComponent
        show={changePasswordModal}
        setShow={setChangePasswordModal}
      />

      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Navbar bg='dark' expand='lg' variant={'dark'}>
          <Container>
            <Navbar.Brand href='/'>Кербен</Navbar.Brand>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='ms-auto'>
                <Nav.Link href='#' onClick={() => setChangePasswordModal(true)}>
                  Сменить пароль
                </Nav.Link>
                <Nav.Link href='#' onClick={() => root.signOut()}>
                  Выйти
                </Nav.Link>
                {/*<NavDropdown title='Dropdown' id='basic-nav-dropdown'>*/}
                {/*  <NavDropdown.Item href='#action/3.1'>Action</NavDropdown.Item>*/}
                {/*  <NavDropdown.Item href='#action/3.2'>*/}
                {/*    Another action*/}
                {/*  </NavDropdown.Item>*/}
                {/*  <NavDropdown.Item href='#action/3.3'>*/}
                {/*    Something*/}
                {/*  </NavDropdown.Item>*/}
                {/*  <NavDropdown.Divider />*/}
                {/*  <NavDropdown.Item href='#action/3.4'>*/}
                {/*    Separated link*/}
                {/*  </NavDropdown.Item>*/}
                {/*</NavDropdown>*/}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <HomeContainer />
      </div>
    </>
  )
}
