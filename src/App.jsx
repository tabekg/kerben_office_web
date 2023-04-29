import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import {VscAdd} from "react-icons/vsc";
import {VscChromeClose} from "react-icons/vsc";
import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';

function App() {
    const [showBlock, setShowBlock] = useState(false);
    const handleClick = () => {
        setShowBlock(true);
    };
    const handleClicсk = () => {
        setShowBlock(false);
    };
    const [todos, setTodos] = useState([]);
    const [inputText, setInputText] = useState('');

    function handleAddTodo() {
        if (inputText === '') return;
        setTodos([...todos, {text: inputText, completed: false}]);
        setInputText('');
    }

    function handleDeleteTodo(index) {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
    }

    function handleChangeInputText(event) {
        setInputText(event.target.value);
    }

    return (<>
        <div className="cont">
            <Navbar bg="light" expand="lg">
                <Container fluid>
                    <Navbar.Brand className={'kerben'} href="#">KERBEN</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll"/>
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{maxHeight: '100px'}}
                            navbarScroll
                        >
                            <Nav.Link href="#action1"></Nav.Link>
                        </Nav>
                        <Form className="d-flex">
                            <Button className="Button-nav" variant="outline-success">выйти</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div>

                <div className="cont2">
                    <div className="cont3">
                        <ol>
                            {todos.map((todo, index) => (
                                <li key={index}>
            <span
                style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                }}
                onClick={() => handleToggleComplete(index)}
            >
              {todo.text}
            </span>
                                    <button onClick={() => handleDeleteTodo(index)}>Удалить</button>
                                </li>
                            ))}
                        </ol>
                        <Card style={{width: '28rem', marginLeft: '30px'}}>
                            <ListGroup variant="flush">
                                <ListGroup.Item className={'todo-button'}>
                                    <Form className="d">
                                        <Button onClick={handleClick} className="Button" variant="outline-success">ДОБАВИТЬ
                                            ВОДИТЕЛЯ
                                            <VscAdd className={'icon'}/>
                                        </Button>
                                    </Form>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </div>
                    <div className="map"></div>
                </div>

            </div>


            <div>
                {showBlock && <div className="addman">
                    <div className="form">
                        <div className="block" onClick={handleClicсk}>
                            <VscChromeClose/>
                        </div>
                        <div className="name">
                            <div className="input">Аты
                                <input
                                    value={inputText}
                                    onChange={handleChangeInputText}
                                    placeholder={""}
                                    type="text"/>
                            </div>
                            <div className="input">

                            </div>
                        </div>
                        <div className="name1">
                            <button
                                onClick={handleAddTodo} className={'button1'}>Добавить
                            </button>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    </>)
}

export default App
