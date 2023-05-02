import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useState} from 'react'
import {isDisabled} from 'bootstrap/js/src/util'

function MyVerticallyCenteredModal(props) {
  const [password,setPassword] = useState('')
  const [newPassword,setNewPassword] = useState('')
  const [newPassword2,setNewPassword2] = useState('')
  const pswrd = 'secret'
  const isDisabled =!newPassword || !newPassword2;
  const succes = () => {
    if (password === pswrd && newPassword === newPassword2){
      alert('Пароль успешно изменен');
    } else {
      alert('Неправильный текущий пароль');
    }
    props.onHide
  }
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Сменить пароль
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Текущий пароль</h6>
        <input className={'inp-'} type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <p style={{opacity:'70%'}}>P.S. Создайте надeжный пароль чтобы  <br/>защитить аккаунт от злоумышленников</p>
        <h6>Новый пароль</h6>
        <input className={'inp-'} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
        <h6 style={{marginTop:'20px'}}>Подтвердите пароль</h6>
        <input className={'inp-'} type="password" value={newPassword2} onChange={(e) => setNewPassword2(e.target.value)}/>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={succes} disabled={isDisabled}>Подтвердить</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default MyVerticallyCenteredModal