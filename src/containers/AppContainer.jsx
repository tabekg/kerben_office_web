import HomeContainer from './HomeContainer.jsx'
import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap'
import {useContext, useState} from 'react'
import {RootContext} from '../utils/context.js'
import ChangePasswordModalComponent from '../components/ChangePasswordModalComponent.jsx'
import {Button, Modal} from 'react-bootstrap'
import {MdDeleteForever} from 'react-icons/md'
import {GrEdit} from 'react-icons/gr'
import {LANGUAGES} from '../utils/config.js'
import {useTranslation} from 'react-i18next'

export default function AppContainer() {
  const root = useContext(RootContext)
  const {t} = useTranslation()

  const [changePasswordModal, setChangePasswordModal] = useState(false)

  const [showModal, setShowModal] = useState(false)

  const handleButtonClick = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const [blocks, setBlocks] = useState([])

  const addBlock = () => {
    const newBlock = {
      id: Date.now(), // Уникальный идентификатор блока
    }
    setBlocks([...blocks, newBlock])
  }
  const handleDeleteBlock = (id) => {
    const updatedBlocks = blocks.filter((block) => block.id !== id)
    setBlocks(updatedBlocks)
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
            <Navbar.Brand href='/'>{t('kerben_control_panel')}</Navbar.Brand>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='ms-auto'>
                <Nav.Link onClick={handleButtonClick}>Оператор</Nav.Link>
                <NavDropdown
                  title={
                    LANGUAGES.find((g) => g.code === root.language)?.title ||
                    'Сменить язык'
                  }
                  id='change-language-dropdown'
                >
                  {LANGUAGES.map((g, i) => (
                    <NavDropdown.Item
                      key={i}
                      href='#'
                      onClick={() => root.setLanguage(g.code)}
                    >
                      {g.title}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
                <Nav.Link href='#' onClick={() => setChangePasswordModal(true)}>
                  {t('change_password')}
                </Nav.Link>
                <Nav.Link href='#' onClick={() => root.signOut()}>
                  {t('sign_out')}
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <HomeContainer />
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Операторы</Modal.Title>
        </Modal.Header>
        <div className='oper-conteiner'>
          {blocks.map((block, index) => (
            <Modal.Body key={index} className='oper-name'>
              <p style={{fontSize: '20px'}}>Оператордун аты жону</p>
              <div>
                <GrEdit
                  style={{
                    fontSize: '25px',
                    cursor: 'pointer',
                    marginLeft: '20px',
                  }}
                />
                <MdDeleteForever
                  onClick={() => handleDeleteBlock(block.id)}
                  style={{
                    fontSize: '30px',
                    cursor: 'pointer',
                    color: 'red',
                    marginLeft: '20px',
                  }}
                />
              </div>
            </Modal.Body>
          ))}
        </div>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>
            Закрыть
          </Button>
          <Button variant='primary' onClick={addBlock}>
            Оператор кошуу
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
