import { useState, useEffect } from 'react';
import { api_url } from '../api_url';
import ShowMess from '../components/showmess';
import io from 'socket.io-client';
import ButtonControl from '../components/buttoncontrol';
const Messenger = () => {
    const messenger = io(api_url + '/messenger');
    const queryString = require('query-string');
    const [userID, setUserID] = useState();
    const [boxChatID, setBoxChatID] = useState();
    const [boxChatContent, setBoxChatContent] = useState();
    const [boxChatName, setBoxChatName] = useState();
    const GetBoxChat = async () => {
        messenger.emit('client-send-messenger', {
            method: 'get',
            command: 'getboxchat',
            obj: {
                boxchatid: boxChatID,
                userid: userID
            }
        });
        messenger.on("boxchatgetgetboxchat", (data) => {
            setBoxChatContent(data.index);
            setBoxChatName(queryString.parse(window.location.search).name);
        });
    }
    const CallApiUpdateBoxChat = async () => {
        var cur = document.getElementById("input-boxchat");
        var newMess = document.getElementById("input-boxchat").value.trim();
        cur.value = '';
        if (newMess === '') return;
        const d = new Date();
        const data = {
            time: d.getTime(),
            userid: userID,
            data: newMess,
        }
        messenger.emit('client-send-messenger', {
            method: 'put',
            command: 'updateboxchat',
            obj: {
                boxchatid: boxChatID,
                userid: userID,
                data: data
            }
        });
        messenger.on("boxchatputupdateboxchat", (data) => {
            GetBoxChat();
        });
    }
    useEffect(() => {
        setBoxChatID(queryString.parse(window.location.search).id);
        setUserID(queryString.parse(window.location.search).userid);
        GetBoxChat();
    }, [userID, boxChatID]);
    useEffect(() => {
        document.querySelector(".please-scroll").scrollTo(0, 10000);
    }, [boxChatContent]);
    var elm = undefined;
    if (boxChatContent !== undefined)
        elm = <ShowMess data={boxChatContent} userID={userID} />
    return (
        <>
            { <div className="messenger">
                <div className="d-flex flex-row justify-content-between p-3 adiv text-white fixed-top">
                    <ButtonControl data={boxChatName}/>
                </div>
                <div className="mt-5 please-scroll">
                    {elm}
                </div>
                <div className="input-chat px-3 mb-3 mt-auto fixed-bottom ">
                    <textarea className="form-control1 mr-auto d-inline-flex" id="input-boxchat" rows={1} placeholder="Nhập tin nhắn . . ." defaultValue={""}
                    />
                    <img className="float-right icon-send" src="https://icons-for-free.com/iconfiles/png/512/message+mobile+send+file+smartphone+talk+telegram+icon-1320193499208602297.png"
                        width={50} height={50}
                        onClick={() => CallApiUpdateBoxChat()} />
                </div>
            </div>}
        </>
    )
}
export default Messenger;
