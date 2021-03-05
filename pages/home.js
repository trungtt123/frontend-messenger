import { useState, useEffect } from 'react';
import { api_url } from '../api_url';
import Router from 'next/router';
import io from 'socket.io-client';
import ButtonControl from '../components/buttoncontrol';
function Home(props) {
    const home = io(api_url + '/home');
    const queryString = require('query-string');
    const [isLoggedIn, setIsLoggedIn] = useState();
    const [userID, setUserID] = useState();
    const [listPerson, setListPerson] = useState();
    const [filterPerson, setFilterPerson] = useState();
    const [valueFilterPerson, setValueFilterPerson] = useState("1");
    const [searchFilterPerson, setSearchFilterPerson] = useState("");
    const handleChangeValueFilterPerson = (e) => {
        setValueFilterPerson(e.target.value);
    }
    const handleChangeSearchFilter = (e) => {
        setSearchFilterPerson(e.target.value)
    }
    const GetAllBoxChatID = async (userID) => {

    }
    const handleClickTheBoxChat = (boxchatid, boxchatname) => {
        Router.push({
            pathname: '/messenger',
            query: { id: boxchatid, name: boxchatname, userid: userID }
        });
    }
    const GetAllUsers = async () => {
        home.on('userpostaddfriend', (data) => {
            GetAllUsers(userID);
        });
        home.on('userpostunfriend', (data) => {
            GetAllUsers(userID);
        });
        home.emit('client-send-home', {
            method: 'get',
            command: 'allusers',
            obj: {
                userid: userID
            }
        });
        home.on('usergetallusers', (data) => {
            console.log(data.users);
            setListPerson(data.users);
        });
    }
    const handleClickButtonAddFriend = async (friendID, boxchatname) => {
        home.emit('client-send-home', {
            method: 'post',
            command: 'addfriend',
            obj: {
                userid: userID,
                friendid: friendID,
                boxchatname: boxchatname
            }
        });
    }
    const handleClickButtonUnfriend = async (friendID) => {
        home.emit('client-send-home', {
            method: 'post',
            command: 'unfriend',
            obj: {
                userid: userID,
                friendid: friendID,
            }
        });
    }
    const handleFilterPerson = () => {
        var elm = undefined;
        if (valueFilterPerson === "1") {
            elm = listPerson.map((item, index) => {
                if (item.person.fullname.search(searchFilterPerson) === -1) return undefined;
                if (item.person.relationship === "friend")
                    return <div key={index} className="item-person border rounded-pill">
                        <div className="item-person-name w-75 ml-2">
                            {item.person.fullname}
                        </div>
                        <div className="item-person-button-control">
                            <img src="/icon-chat.png"
                                alt="icon-chat" 
                                width={30}
                                height={30}
                                onClick={() => handleClickTheBoxChat(item.person.boxchatid, item.person.fullname)}
                            />
                            <img
                                src="/icon-friend.png"
                                alt="icon-friend"
                                width={30}
                                height={30}
                                onClick={() => handleClickButtonUnfriend(item.person._id)}
                            />
                        </div>
                    </div>
                return <div key={index} className="item-person border rounded-pill">
                    <div className="item-person-name w-75 ml-2">
                        {item.person.fullname}
                    </div>
                    <div className="item-person-button-control">
                        <img
                            src="/icon-add-friend.png"
                            alt="icon-add-friend"
                            width={30}
                            height={30}
                            onClick={() => handleClickButtonAddFriend(item.person._id, item.person.fullname)}
                        />
                    </div>
                </div>
            });
        }
        else
            if (valueFilterPerson === "2") {
                elm = listPerson.map((item, index) => {
                    if (item.person.fullname.search(searchFilterPerson) === -1) return undefined;
                    if (item.person.relationship !== 'friend') return undefined;
                    return <div key={index} className="item-person border rounded-pill">
                        <div className="item-person-name w-75 ml-2">
                            {item.person.fullname}
                        </div>
                        <div className="item-person-button-control">
                            <img
                                src="/icon-chat.png"
                                alt="icon-chat"
                                width={30}
                                height={30}
                                onClick={() => handleClickTheBoxChat(item.person.boxchatid, item.person.fullname)}
                            />
                            <img
                                src="/icon-friend.png"
                                alt="icon-friend"
                                width={30}
                                height={30}
                                onClick={() => handleClickButtonUnfriend(item.person._id)}
                            />
                        </div>
                    </div>
                });
            }
            else {
                elm = listPerson.map((item, index) => {
                    if (item.person.fullname.search(searchFilterPerson) === -1) return undefined;
                    if (item.person.relationship === 'friend') return undefined;
                    return <div key={index} className="item-person border rounded-pill">
                        <div className="item-person-name w-75 ml-2">
                            {item.person.fullname}
                        </div>
                        <div className="item-person-button-control">
                            <img
                                src="/icon-add-friend.png"
                                alt="icon-add-friend"
                                width={30}
                                height={30}
                                onClick={() => handleClickButtonAddFriend(item.person._id)}
                            />
                        </div>
                    </div>
                });
            }
        setFilterPerson(elm);
    }
    useEffect(() => {
        setUserID(queryString.parse(window.location.search).userid);
    }, []);
    useEffect(() => {
        if (userID !== undefined) {
            GetAllBoxChatID(userID);
            GetAllUsers(userID);
        }
    }, [userID]);
    useEffect(() => {
        if (listPerson !== undefined) {
            //handleFilterBoxChat();
            handleFilterPerson();
        }
    }, [valueFilterPerson, searchFilterPerson, listPerson]);
    return (
        <>
            <div className="d-flex flex-row justify-content-between p-3 adiv text-white">
                <ButtonControl data={"Home"} />
            </div>
            <div className="justify-content-between">
                <div className="px-3 mt-3">
                    <input type="search"
                        className="form-control border border-info rounded-pill mb-1"
                        placeholder={"🔎 Tìm kiếm..."}
                        onChange={(e) => handleChangeSearchFilter(e)}
                    />
                    <div className="select-group">
                        <select
                            className="form-select rounded-pill border border-info select-control"
                            value={valueFilterPerson}
                            onChange={(e) => handleChangeValueFilterPerson(e)}
                        >
                            <option value="1">Tất cả</option>
                            <option value="2">Bạn bè</option>
                            <option value="3">Người lạ</option>
                        </select>
                    </div>
                </div>
                <div className="px-3 mt-4">
                    <div className="list-friend">
                        {filterPerson}
                    </div>
                </div>

            </div>
        </>
    )
}
export default Home;

