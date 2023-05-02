import {Col, Row} from 'react-bootstrap'
import MapComponent from '../components/MapComponent'
import {useEffect, useRef, useState} from 'react'
import requester from '../utils/requester'
import {VscChromeClose} from "react-icons/vsc";
import {BiColor} from "react-icons/all";
import Color from "../containers/Color";


export default function HomeContainer() {
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(0)

  const timeoutId = useRef(-1)

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
    setTodos([...todos, {text: inputText}]);
    setInputText('');
  }

  function handleChangeInputText(event) {
    setInputText(event.target.value);
  }

  useEffect(() => {
    fetchDrivers()

    return () => {
      if (timeoutId.current && timeoutId.current > -1) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [])

  const fetchDrivers = () => {
    requester
        .get('/office/driver')
        .then((res) => {
          if (res.status === 'success') {
            setDrivers(res.payload)
          }
          timeoutId.current = setTimeout(() => fetchDrivers(), 3000)
        })
        .catch(() => {
          timeoutId.current = setTimeout(() => fetchDrivers(), 3000)
        })
  }

  return (
      <>
        <Row
            style={{
              flexGrow: 1,
              gap: 0,
            }}
        >
          <Col lg={3} md={4} sm={12}>
            <div className={'driver-list'}>
              <div className="crool">
                <ol>
                  {drivers.map((g, i) => {
                    const isOnline =
                        g.payload &&
                        g.payload[0]?.timestamp > new Date().getTime() - 30000
                    return (
                        <div
                            key={i}
                            className={'driver-list-item'}
                            onClick={() => setSelectedDriver(g.id)}
                        >
                          <div>

                            <div style={{fontSize: 24}}>{g.full_name}
                            </div>
                            {g.payload ? (
                                <div>{new Date(g.payload[0].timestamp).toString()}</div>
                            ) : null}
                          </div>
                          <div
                              style={{
                                width: 20,
                                flexShrink: 0,
                                height: 20,
                                boxShadow: '1px 1px 1px grey',
                                backgroundColor: isOnline ? 'green' : 'red',
                                borderRadius: 10,
                              }}
                          />
                        </div>
                    )
                  })}
                  {todos.map((todo, index) => (

                      <li key={index}>
                                                    <span
                                                        style={{textDecoration: todo.completed ? 'line-through' : 'none',}}>
                                                        {todo.text}
                                                        </span>

                        <Color/>
                      </li>))}
                </ol>
              </div>

              <div
                  onClick={open}
                  className={' button2 driver-list-item justify-content-center'}
                  style={{color: 'white'}}
              >
                Добавить новый водитель
              </div>
            </div>
          </Col>
          <Col lg={9} md={8} sm={12}>
            <MapComponent
                // @ts-ignore
                selectedDriver={(drivers || []).find(
                    (g) => g.id === selectedDriver
                )}
                markers={drivers}
            />
          </Col>
          {showBlock && <div className="addman">
            <div className="form">
              <div className="x" onClick={close}>
                <VscChromeClose/>
              </div>
              <div className="name">
                <div className="input">
                  <form>
                    <div className="space-y-12">
                      <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                          <div className=" text-center sm:col-span-3">
                            <div className="login-name">Логин</div>
                            <div className="mt-2">
                              <input
                                  value={inputText}
                                  onChange={handleChangeInputText}
                                  placeholder={""}
                                  className=" dairs-input block w-full
                                                               rounded-md border-0 py-1.5
                                                                text-gray-900 shadow-sm ring-1
                                                                 ring-inset ring-gray-300 placeholder:text-gray-400
                                                                 focus:ring-2 focus:ring-inset focus:ring-indigo-600
                                                                  sm:text-sm sm:leading-6"
                                  type="text"/></div>
                          </div>
                          <div className=" text-center sm:col-span-3">
                            <div className="login-name">Пароль</div>
                            <div className="mt-2">
                              <input type="text" name="last-name" id="last-name"
                                     autoComplete="family-name"
                                     className=" dairs-input block w-full
                                                               rounded-md border-0 py-1.5
                                                                text-gray-900 shadow-sm ring-1
                                                                 ring-inset ring-gray-300 placeholder:text-gray-400
                                                                 focus:ring-2 focus:ring-inset focus:ring-indigo-600
                                                                  sm:text-sm sm:leading-6"/>
                            </div>
                          </div>
                          <div className=" text-center sm:col-span-4">
                            <div className="login-name">Фамилия и имя</div>
                            <div className="mt-2">
                              <input id="email" name="email" type="email"
                                     autoComplete="email"
                                     className=" dairs-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
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
                    className={'button2 mb-5 '}>Добавить
                </button>
              </div>
            </div>

          </div>}
        </Row>
      </>
  )
}
