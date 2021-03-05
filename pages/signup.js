import { useState } from 'react';
import { api_url } from '../api_url';
import io from 'socket.io-client';
import Router from 'next/router';
const Login = () => {
    const home = io(api_url + '/home');
    const handleClickLoginHere = () => {
        Router.push({
            pathname: '/login'
        })
    }
    const handleSubmit = async () => {

        var firstname = document.getElementById("firstname").value.trim();
        var lastname = document.getElementById("lastname").value.trim();
        var lastname = document.getElementById("lastname").value.trim();
        var address = document.getElementById("address").value.trim();
        var username = document.getElementById("username").value.trim();
        var password = document.getElementById("password").value.trim();

        home.emit('client-send-home',
            {
                method: 'get',
                command: `checkexistuserfromusername`,
                obj: { username: `${username}` }
            });
        home.on('usergetcheckexistuserfromusername', (user) => {
            if (user.exist === true) {
                alert('Tên đăng nhập đã tồn tại');
                return;
            }
            const data = {
                username: username,
                password: password,
                address: address,
                fullname: firstname + ' ' + lastname,
            }
            home.emit('client-send-home', { method: 'post', command: `createuser`, obj: data });
            home.on("userpostcreateuser", (data) => {
                Router.push({
                    pathname:  '/home',
                    query: { userid: data.userid }
                })
            })

        });
    }
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-5 mx-auto">
                        <div id="second">
                            <div className="myform form ">
                                <div className="logo mb-3">
                                    <div className="col-md-12 text-center">
                                        <h1>Signup</h1>
                                    </div>
                                </div>
                                <div className="registration">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">First Name</label>
                                        <input type="text" name="firstname" className="form-control" id="firstname" aria-describedby="emailHelp" placeholder="Enter Firstname"/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Last Name</label>
                                        <input type="text" name="lastname" className="form-control" id="lastname" aria-describedby="emailHelp" placeholder="Enter Lastname"/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Address</label>
                                        <input type="text" name="address" className="form-control" id="address" aria-describedby="emailHelp" placeholder="Enter Address"/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Username</label>
                                        <input type="username" name="username" className="form-control" id="username" aria-describedby="emaillHelp" placeholder="Enter Username"/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Password</label>
                                        <input type="password" name="password" id="password" className="form-control" aria-describedby="emailHelp" placeholder="Enter Password"/>
                                    </div>
                                    <div className="col-md-12 text-center mb-3">
                                        <button type="submit" className=" btn btn-block mybtn btn-primary tx-tfm" onClick={() => handleSubmit()}>
                                            Sign Up
                                        </button>
                                    </div>
                                    <div className="col-md-12 ">
                                        <div className="form-group">
                                            <div className="text-center font-italic" onClick={() => handleClickLoginHere()}>
                                                Already have an account?  
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
