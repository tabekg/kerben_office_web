import HomeContainer from './HomeContainer.jsx'
import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap'
import {useContext, useState} from 'react'
import {RootContext} from '../utils/context.js'
import ChangePasswordModalComponent from '../components/ChangePasswordModalComponent.jsx'
import {LANGUAGES} from '../utils/config.js'
import {useTranslation} from 'react-i18next'
import OperatorsModalComponent from '../components/OperatorsModalComponent.jsx'

export default function AppContainer() {
  const root = useContext(RootContext)
  const {t} = useTranslation()

  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [operatorsModal, setOperatorsModal] = useState(false)

  return (
    <>
      <ChangePasswordModalComponent
        show={changePasswordModal}
        setShow={setChangePasswordModal}
      />
      <OperatorsModalComponent
        show={operatorsModal}
        setShow={setOperatorsModal}
      />

      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Navbar bg='dark' expand='lg' variant={'dark'}>
          <Container>
            <Navbar.Brand href='/'>{t('kerben_control_panel')}</Navbar.Brand>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='ms-auto'>
                {/*<Nav.Link onClick={handleButtonClick}>Оператор</Nav.Link>*/}
                <NavDropdown
                  title={
                    root.shipmentsType === 'active'
                      ? t('activeShipments')
                      : t('archivedShipments')
                  }
                  id='change-archive-type-dropdown'
                >
                  <NavDropdown.Item
                    href='#'
                    onClick={() => root.setShipmentsType('active')}
                  >
                    {t('activeShipments')}
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href='#'
                    onClick={() => root.setShipmentsType('archive')}
                  >
                    {t('archivedShipments')}
                  </NavDropdown.Item>
                </NavDropdown>
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
                <Nav.Link href='#' onClick={() => setOperatorsModal(true)}>
                  {t('operators')}
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
    </>
  )
}
