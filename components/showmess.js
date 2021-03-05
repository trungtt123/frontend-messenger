import { useState, useEffect } from 'react';
function ShowMess(props) {
    const tmpdata = props.data;
    const amountOfText = 10;
    const [data, setData] = useState(
        (tmpdata.length < amountOfText)
            ? tmpdata
            : tmpdata.slice(tmpdata.length - amountOfText, tmpdata.length)
    );
    const [seeMore, setSeeMore] = useState();
    const [countSeeMore, setCountSeeMore] = useState(2);
    const userID = props.userID;
    const handleClickItem = (e) => {
        var cur = `time-${e.target.id}`;
        console.log(cur);
        document.getElementById(cur).style.display = 'inline';
        setTimeout(() => {
            document.getElementById(cur).style.display = 'none';
        }, 3000);
    }
    // need fix .................
    const handleFixString = (st) => {
        var maxChar = 30;
        var check = false;
        var tmp = '';
        for (var i = 0; i < st.length; i++) {
            tmp += st[i];
            //console.log(tmp);
            if (i < maxChar) {

                if (st[i] === ' ') {
                    check = true;

                }
            } else if (i === maxChar) {
                if (check === false) {
                    tmp += ' ';
                }
                check = false;
                maxChar += maxChar;
            }
        }
        return tmp;
    }
    // Handle see more mess - create by CrackerT
    const handleOnClickSeeMore = () => {
        if (tmpdata.length - amountOfText * countSeeMore < 0) {
            setSeeMore('none');
            setData(tmpdata);
        }
        else {
            setData(tmpdata.slice(tmpdata.length - amountOfText * countSeeMore, tmpdata.length));
            setCountSeeMore(countSeeMore + 1);
        }
    }
    useEffect(() => {
        if (tmpdata.length < amountOfText) {
            setData(tmpdata);
            setSeeMore('none');
        }
        else {
            setData(tmpdata.slice(tmpdata.length - amountOfText, tmpdata.length));
            setSeeMore('block');
        }
    }, [tmpdata]);
    var elm = data.map((item, index) => {
        //item.data = handleFixString(item.data);

        const dateObject = new Date(item.time)
        var timeparse = dateObject.toLocaleString("en-US");
        var cur1 = `time-item-${index}`;
        var cur2 = `item-${index}`;
        if (item.userid === userID) {
            return <div key={index}>

                <div  style={{ width: '100%', textAlign: 'center' }}>
                    <span id={cur1} style={{ display: 'none' }}>{timeparse}</span>
                </div>

                <div className="d-flex flex-row p-3">
                    <div className="chat ml-auto p-3" id={cur2} onClick={(e) => handleClickItem(e)}>
                        {item.data}
                    </div>
                </div>
            </div> 
        }
        else {
            return <div key={index}>
                <div  style={{ width: '100%', textAlign: 'center' }} >
                    <span className="ml-auto" id={cur1} style={{ display: 'none' }}>{timeparse}</span>
                </div>
                <div  className="d-flex flex-row p-3" >
                    {/* <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png" width={30} height={30} /> */}
                    <div className="chat ml-2 p-3" id={cur2} onClick={(e) => handleClickItem(e)}>
                        {item.data}
                    </div>

                </div>
            </div>
        }
    });
    return (
        <>
            <div className="see-more text-center" id="see-more" style={{ display: seeMore }} onClick={() => handleOnClickSeeMore()}>
                Xem thêm tin nhắn cũ...
                </div>
            {elm}
        </>
    )
}

export default ShowMess;

