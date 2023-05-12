import HomeContainer from './HomeContainer.jsx'
import {Container, Nav, Navbar} from 'react-bootstrap'
import {useContext, useState} from 'react'
import {RootContext} from '../utils/context.js'
import ChangePasswordModalComponent from '../components/ChangePasswordModalComponent.jsx'
import {Button, Modal, Form} from 'react-bootstrap'
import {MdDeleteForever} from 'react-icons/md'
import {GrEdit} from 'react-icons/gr'

export default function AppContainer() {
  const root = useContext(RootContext)

  const [changePasswordModal, setChangePasswordModal] = useState(false)

  const [showModal, setShowModal] = useState(false)

  const handleButtonClick = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <>

      <ChangePasswordModalComponent
        show={changePasswordModal}
        setShow={setChangePasswordModal}
      />
      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Navbar bg='dark' expand='lg' variant={'dark'}>
          <Container>
            <Navbar.Brand href='/'>Панель управления Кербен</Navbar.Brand>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='ms-auto'>
                <Nav.Link onClick={handleButtonClick}>
                  Оператор
                </Nav.Link>
                <Nav.Link href='#' onClick={() => setChangePasswordModal(true)}>
                  Сменить пароль
                </Nav.Link>
                <Nav.Link href='#' onClick={() => root.signOut()}>
                  Выйти
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <HomeContainer />
      </div>
      <Modal className='oper-conteiner' show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Операторы</Modal.Title>
        </Modal.Header>
        <Modal.Body className='oper-name'>
          <p
            style={{fontSize:'20px'}}
          >Оператордун аты жону</p>
          <div>
            <GrEdit
              style={{
                fontSize: '25px',
                cursor: 'pointer',
                marginLeft:'20px'
              }}
            />
            <MdDeleteForever style={{
              fontSize: '30px',
              cursor: 'pointer',
              color: 'red',
              marginLeft:'20px'
            }} />
          </div>

        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>
            Закрыть
          </Button>
          <Button variant='primary' onClick={handleButtonClick}>
            Оператор кошуу
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
