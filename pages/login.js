import { useState } from 'react';
import { api_url } from '../api_url';
import io from 'socket.io-client';
import Router from 'next/router';
const Login = () => {
    const home = io(api_url + '/home');
    const [username, setUserName] = useState('');
    const [password, setPassWord] = useState('');
    const handleClickSignUpHere = () => {
        Router.push({
            pathname: '/signup'
        });
    }
    const handleSetUserName = (e) => {
        setUserName(e.target.value);
        e.preventDefault();
    }
    const handleSetPassWord = (e) => {
        setPassWord(e.target.value);
        e.preventDefault();
    }
    const handleSubmit = async () => {
        var data = {
            username: username,
            password: password
        }
        if (username === '' || password === '') {
            alert('Sai tên đăng nhập hoặc mật khẩu');
            return;
        }

        home.emit('client-send-home', {
            method: 'post',
            command: 'userlogin',
            obj: data
        });
        home.on('userpostuserlogin', (res) => {
            if (res.user === null) {
                alert('Tài khoản không tồn tại hoặc sai mật khẩu');
                return;
            }
            else {
                Router.push({
                    pathname: '/home',
                    query: { userid: res.user._id }
                });
            }
        });

    }
    return (
        <>
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-5 mx-auto">
                            <div id="first">
                                <div className="myform form ">
                                    <div className="logo mb-3">
                                        <div className="col-md-12 text-center">
                                            <h1>Login</h1>
                                        </div>
                                    </div>
                                    <div className="login">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Username</label>
                                            <input type="username" name="username" className="form-control" id="username" aria-describedby="emailHelp" placeholder="Enter Username"
                                                onChange={(e) => handleSetUserName(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Password</label>
                                            <input type="password" name="password" id="password" className="form-control" aria-describedby="emailHelp" placeholder="Enter Password"
                                                onChange={(e) => handleSetPassWord(e)} />
                                        </div>
                                        <div className="col-md-12 text-center ">
                                            <button type="submit" className=" btn btn-block mybtn btn-primary tx-tfm" onClick={() => handleSubmit()}>Login</button>
                                        </div>
                                        <br />
                                        <div className="form-group">
                                            <div className="text-center">Don't have account?</div>
                                            <div className="text-center font-italic" onClick={() => handleClickSignUpHere()}>
                                                Sign up here
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
export default Login;
