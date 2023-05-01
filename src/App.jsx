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
import Color from "./Color.jsx";
function App() {
    const [showBlock, setShowBlock] = useState(false);
    const [todos, setTodos] = useState([]);
    const [inputText, setInputText] = useState('');
    const open = () => {
        setShowBlock(true);
    };
    const close = () => {
        setShowBlock(false);
    };
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
                            navbarScroll>
                            <Nav.Link href="#action1"></Nav.Link>
                        </Nav>
                        <Form className="d-flex">
                            <Button className="Button-nav" variant="outline-success">выйти</Button>
                            <Button className="Button-nav" style={{fontSize:'10px', marginLeft:'5px'}} variant="outline-danger">сменить пароль</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div>
                <div className="cont2">
                    <div className="cont3">
                        <ol>
                            {todos.map((todo, index) => (<li key={index}>
            <span
                style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                }}
                onClick={() => handleToggleComplete(index)}
            >
              {todo.text}
            </span>
                                <Color/>
                                {/*<button onClick={() => handleDeleteTodo(index)}>Удалить</button>*/}
                            </li>))}
                        </ol>
                        <Card style={{width: '28rem', marginLeft: '30px'}}>
                            <ListGroup variant="flush">
                                <ListGroup.Item className={'todo-button'}>
                                    <Form className="d">
                                        <Button onClick={open} className="Button" variant="outline-success">ДОБАВИТЬ
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
                        <div className="block" onClick={close}>
                            <VscChromeClose/>
                        </div>
                        <div className="name">
                            <div className="input">
                                <form>
                                    <div className="space-y-12">
                                        <div className="border-b border-gray-900/10 pb-12">
                                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                <div className=" text-center sm:col-span-3">
                                                    <label htmlFor="first-name"
                                                           className="  block text-sm font-medium leading-6 text-gray-900">Логин</label>
                                                    <div className="mt-2">
                                                        <input
                                                            value={inputText}
                                                            onChange={handleChangeInputText}
                                                            placeholder={""}
                                                            className="block w-full
                                                               rounded-md border-0 py-1.5
                                                                text-gray-900 shadow-sm ring-1
                                                                 ring-inset ring-gray-300 placeholder:text-gray-400
                                                                 focus:ring-2 focus:ring-inset focus:ring-indigo-600
                                                                  sm:text-sm sm:leading-6"
                                                            type="text"/></div>
                                                </div>
                                                <div className=" text-center sm:col-span-3">
                                                    <label htmlFor="last-name"
                                                           className="block text-sm font-medium leading-6 text-gray-900">Пароль</label>
                                                    <div className="mt-2">
                                                        <input type="text" name="last-name" id="last-name"
                                                               autoComplete="family-name"
                                                               className="block w-full
                                                               rounded-md border-0 py-1.5
                                                                text-gray-900 shadow-sm ring-1
                                                                 ring-inset ring-gray-300 placeholder:text-gray-400
                                                                 focus:ring-2 focus:ring-inset focus:ring-indigo-600
                                                                  sm:text-sm sm:leading-6"/>
                                                    </div>
                                                </div>
                                                <div className=" text-center sm:col-span-4">
                                                    <label htmlFor="email"
                                                           className="block text-sm font-medium leading-6 text-gray-900">Фамилия и имя</label>
                                                    <div className="mt-2">
                                                        <input id="email" name="email" type="email" autoComplete="email"
                                                               className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-end gap-x-6"></div>
                                </form>
                            </div>
                            <div className="input">
                            </div>
                        </div>
                        <div className="name1">
                            <button
                                onClick={() => {
                                    handleAddTodo();
                                    close();
                                }}
                                className={'button1 mb-5 '}>Добавить
                            </button>
                        </div>
                    </div>

                </div>}
            </div>
        </div>
    </>)
}

export default App
