import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap'
import {LANGUAGES} from '../utils/config'
import {Outlet, useNavigate} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {useContext} from 'react'
import {RootContext} from '../utils/context'

const LayoutContainer = () => {

  const root = useContext(RootContext)
  const {t} = useTranslation()
  const navigate = useNavigate()

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <Navbar bg='dark' expand='lg' variant={'dark'}>
        <Container>
          <Navbar.Brand href='/'>{t('kerben_control_panel')}</Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <Nav.Link href='#' onClick={() => navigate('/invoices')}>
                Квитанции
              </Nav.Link>
              <Nav.Link href='#' onClick={() => navigate('/containers')}>
                Контейнер
              </Nav.Link>
              <Nav.Link
                href='#'
                onClick={() => navigate('/shipments/completed')}
              >
                Завершенные
              </Nav.Link>
              <Nav.Link href='#' onClick={() => navigate('/archive')}>
                {t('archivedShipments')}
              </Nav.Link>
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
              <Nav.Link
                href='#'
                onClick={() => root.setChangePasswordModal(true)}
              >
                {t('change_password')}
              </Nav.Link>
              <Nav.Link href='#' onClick={() => root.setOperatorsModal(true)}>
                {t('operators')}
              </Nav.Link>
              <Nav.Link href='#' onClick={() => root.signOut()}>
                {t('sign_out')}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  )
}

export default LayoutContainer
