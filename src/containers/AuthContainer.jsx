import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { RootContext } from '../utils/context.js';
import requester from '../utils/requester.js';
import Logo from '../assets/logo.png';

import { useTranslation, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import translationEN from '../translations/en.json';
import translationFR from '../translations/fr.json';


// Инициализация i18next
i18n.use(initReactI18next).init({
     resources: {
          en: { translation: translationEN },
          fr: { translation: translationFR },
     },
     lng: 'en', // Язык по умолчанию
     fallbackLng: 'en', // Фallback-язык
     interpolation: {
          escapeValue: false, // Отключить экранирование HTML-символов
     },
});

export default function AuthContainer() {
     const root = useContext(RootContext);
     const { t } = useTranslation();

     const [phoneNumber, setPhoneNumber] = useState('+996');
     const [password, setPassword] = useState('');
     const [loading, setLoading] = useState(false);

     const signIn = () => {
          // Ваша логика входа
     };

     const changeLanguage = (lng) => {
          i18n.changeLanguage(lng);
     };

     return (
          <Row style={{ height: '100vh' }}>
               <div className="d-flex justify-content-center align-items-center">
                    <Col xl={3} xxl={3} lg={4} md={4} sm={10} xs={12}>
                         <Card
                              style={{
                                   background: 'rgba(8, 14, 44, 0.8)',
                                   boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                              }}
                              className="p-5"
                         >
                              <div className="d-flex justify-content-center align-items-center mb-3">
                                   <img src={Logo} alt="Logo Kerben" />
                              </div>
                              <h2 className="text-white text-center mb-4">
                                   {t('welcomeMessage')}
                              </h2>

                              <Form.Group className="mb-3" controlId="login">
                                   <Form.Label className="text-white">
                                        {t('phoneNumberLabel')}
                                   </Form.Label>
                                   <Form.Control
                                        className="w-100"
                                        type="text"
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        value={phoneNumber}
                                        disabled={loading}
                                        placeholder={t('phoneNumberPlaceholder')}
                                   />
                              </Form.Group>

                              <Form.Group className="mb-5" controlId="password">
                                   <Form.Label className="text-white">{t('passwordLabel')}</Form.Label>
                                   <Form.Control
                                        className="w-100"
                                        type="password"
                                        placeholder={t('passwordPlaceholder')}
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        disabled={loading}
                                   />
                              </Form.Group>

                              <div className="d-flex justify-content-center align-items-center">
                                   <Button
                                        disabled={loading || phoneNumber.length < 1 || password.length < 1}
                                        onClick={() => signIn()}
                                        className="px-5"
                                   >
                                        {loading ? t('loading') : t('signIn')}
                                   </Button>
                              </div>

                              <div className="d-flex justify-content-center align-items-center">
                                   <Button
                                        variant="primary"
                                        onClick={() => changeLanguage(i18n.language === 'en' ? 'fr' : 'en')}
                                        className="px-3 mt-3"
                                   >
                                        {t('changeLanguage')}
                                   </Button>
                              </div>
                         </Card>
                    </Col>
               </div>
          </Row>
     );
}

