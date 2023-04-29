import Logo from "../assets/Group 1.png"
import { useState, useEffect } from 'react'




function Login() {
    const [error, setError] = useState(false)
    useEffect(() => {
        setError(true)
    }, []);
    return (
        <>

            <div className="main_div" style={{  }}>
                <div className="cont" style={{ display: 'flex', height: '100vh', width: '100%' }}>

                    <div className="cont2" style={{ width: '460px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px 15px' }}>

                        <div className="login" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <img src={Logo} alt="" />
                            <h1 className='text-4xl' style={{ textAlign: 'center' }}>Login to your Account</h1>
                            <label htmlFor="">Email</label>
                            <input
                                className="log"
                                placeholder="Your email"
                                type="text"
                                onChange={(event) => GetEmail(event.target.value)}
                                style={error ? { border: "2px solid red" } : {}}
                            />
                            <label htmlFor="">Password</label>
                            <input
                                className="log"
                                placeholder="Your password"
                                onChange={(event) => GetPass(event.target.value)}
                                onKeyDown={(e) => KeyEnter(e.code)}
                                type="password"
                                style={error ? { border: "2px solid red" } : {border: "2px solid black"}}
                            />
                            <div>
                                <p style={{cursor:'pointer', color:'white'}}>Forgot password?</p>
                            </div>
                            <button
                                style={{ backgroundColor: 'violet', color: 'white', width: '100%', fontSize: '18px' }}
                            >
                                Enter
                            </button>

                        </div>

                    </div>

                </div>
            </div>

        </>
    );
}

export default Login;