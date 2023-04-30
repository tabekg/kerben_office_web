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
                            {todos.map((todo, index) => (<li key={index}>
            <span
                style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                }}
                onClick={() => handleToggleComplete(index)}
            >
              {todo.text}
            </span>
                                <button onClick={() => handleDeleteTodo(index)}>Удалить</button>
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
                                            <h2 className="text-base text-center font-semibold leading-7 text-gray-900">Personal
                                                Information</h2>
                                            <p className="mt-1 text-sm text-center leading-6 text-gray-600">Use a permanent address where you
                                                can receive mail.</p>

                                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                <div className=" text-center sm:col-span-3">
                                                    <label htmlFor="first-name"
                                                           className="block text-sm font-medium leading-6 text-gray-900">First
                                                        name</label>
                                                    <div className="mt-2">
                                                        <input
                                                            value={inputText}
                                                            onChange={handleChangeInputText}
                                                            placeholder={""}
                                                            type="text"/> </div>
                                                </div>

                                                <div className=" text-center sm:col-span-3">
                                                    <label htmlFor="last-name"
                                                           className="block text-sm font-medium leading-6 text-gray-900">Last
                                                        name</label>
                                                    <div className="mt-2">
                                                        <input type="text" name="last-name" id="last-name"
                                                               autoComplete="family-name"
                                                               className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                                    </div>
                                                </div>

                                                <div className=" text-center sm:col-span-4">
                                                    <label htmlFor="email"
                                                           className="block text-sm font-medium leading-6 text-gray-900">Email
                                                        address</label>
                                                    <div className="mt-2">
                                                        <input id="email" name="email" type="email" autoComplete="email"
                                                               className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                                    </div>
                                                </div>



                                                <div  className=" text-center col-span-full">
                                                    <label htmlFor="street-address"
                                                           className="block text-sm font-medium leading-6 text-gray-900">Street
                                                        address</label>
                                                    <div className="mt-2">
                                                        <input type="text" name="street-address" id="street-address"
                                                               autoComplete="street-address"
                                                               className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                                    </div>
                                                </div>

                                                <div className=" text-center sm:col-span-2 sm:col-start-1">
                                                    <label htmlFor="city"
                                                           className="block text-sm font-medium leading-6 text-gray-900">City</label>
                                                    <div className="mt-2">
                                                        <input type="text" name="city" id="city" autoComplete="address-level2"
                                                               className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                                    </div>
                                                </div>

                                                <div className=" text-center sm:col-span-2">
                                                    <label htmlFor="region"
                                                           className="block text-sm font-medium leading-6 text-gray-900">State /
                                                        Province</label>
                                                    <div className="mt-2">
                                                        <input type="text" name="region" id="region" autoComplete="address-level1"
                                                               className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                                    </div>
                                                </div>

                                                <div className=" text-center sm:col-span-2">
                                                    <label htmlFor="postal-code"
                                                           className="block text-sm font-medium leading-6 text-gray-900">ZIP /
                                                        Postal code</label>
                                                    <div className="mt-2">
                                                        <input type="text" name="postal-code" id="postal-code"
                                                               autoComplete="postal-code"
                                                               className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className=" text-center border-b border-gray-900/10 pb-12">
                                            <h2 className="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
                                            <p className="mt-1 text-sm leading-6 text-gray-600">We'll always let you know about
                                                important changes, but you pick what else you want to hear about.</p>

                                            <div className="mt-10 space-y-10">
                                                <fieldset>
                                                    <legend className="text-sm font-semibold leading-6 text-gray-900">By Email
                                                    </legend>
                                                    <div className="mt-6 space-y-6">
                                                        <div className="relative flex gap-x-3">
                                                            <div className="flex h-6 items-center">
                                                                <input id="comments" name="comments" type="checkbox"
                                                                       className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                                                            </div>
                                                            <div className="text-sm leading-6">
                                                                <label htmlFor="comments"
                                                                       className="font-medium text-gray-900">Comments</label>
                                                                <p className="text-gray-500">Get notified when someones posts a
                                                                    comment on a posting.</p>
                                                            </div>
                                                        </div>
                                                        <div className="relative flex gap-x-3">
                                                            <div className="flex h-6 items-center">
                                                                <input id="candidates" name="candidates" type="checkbox"
                                                                       className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                                                            </div>
                                                            <div className="text-sm leading-6">
                                                                <label htmlFor="candidates"
                                                                       className="font-medium text-gray-900">Candidates</label>
                                                                <p className="text-gray-500">Get notified when a candidate applies
                                                                    for a job.</p>
                                                            </div>
                                                        </div>
                                                        <div className="relative flex gap-x-3">
                                                            <div className="flex h-6 items-center">
                                                                <input id="offers" name="offers" type="checkbox"
                                                                       className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                                                            </div>
                                                            <div className="text-sm leading-6">
                                                                <label htmlFor="offers"
                                                                       className="font-medium text-gray-900">Offers</label>
                                                                <p className="text-gray-500">Get notified when a candidate accepts
                                                                    or rejects an offer.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                                <fieldset>
                                                    <legend className="text-sm font-semibold leading-6 text-gray-900">Push
                                                        Notifications
                                                    </legend>
                                                    <p className="mt-1 text-sm leading-6 text-gray-600">These are delivered via SMS
                                                        to your mobile phone.</p>
                                                    <div className="mt-6 space-y-6">
                                                        <div className="flex items-center gap-x-3">
                                                            <input id="push-everything" name="push-notifications" type="radio"
                                                                   className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                                                            <label htmlFor="push-everything"
                                                                   className="block text-sm font-medium leading-6 text-gray-900">Everything</label>
                                                        </div>
                                                        <div className="flex items-center gap-x-3">
                                                            <input id="push-email" name="push-notifications" type="radio"
                                                                   className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                                                            <label htmlFor="push-email"
                                                                   className="block text-sm font-medium leading-6 text-gray-900">Same
                                                                as email</label>
                                                        </div>
                                                        <div className="flex items-center gap-x-3">
                                                            <input id="push-nothing" name="push-notifications" type="radio"
                                                                   className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                                                            <label htmlFor="push-nothing"
                                                                   className="block text-sm font-medium leading-6 text-gray-900">No
                                                                push notifications</label>
                                                        </div>
                                                    </div>
                                                </fieldset>
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
