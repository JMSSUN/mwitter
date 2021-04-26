import { dbService, storageService } from 'fbase';
import React, { useEffect, useState } from 'react';
import {v4 as uuidv4} from 'uuid';
import Mweet from 'components/Mweet';

const Home = ({userObj}) => {
    const [mweet, setMweet] = useState("");
    const [mweets, setMweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    // const getMweets = async() => {
    //     const dbMweets = await dbService.collection("mweets").get();
    //     dbMweets.forEach((document) => {
    //         const mweetObject = {
    //             ...document.data(),
    //             id: document.id
    //         }
    //         setMweets(prev => [mweetObject, ...prev]); // 가장 최근 data부터 
    //     });
    // }
    useEffect(() => {
        // getMweets();
        //orderBy("createdAt","desc").
        dbService.collection("mweets").onSnapshot(snapshot => {
            const mweetArray = snapshot.docs.map(doc => ({
                id:doc.id, 
                ...doc.data(),
            }));
            setMweets(mweetArray);
        });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if(attachment != "") { // 첨부파일 있을 때
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
            
        }
        const mweetObj = {
            text: mweet,
            createdAt: Date.now(),
            createrId: userObj.uid,
            attachmentUrl
        };

        await dbService.collection("mweets").add(mweetObj);
        setMweet("");
        setAttachment("");
    };

    const onChange = (event) => {
        const { target:{value}} = event;
        setMweet(value);
    };

    const onFileChange = (event) => {
        // console.log(event.target.files);
        const {
            target: {files},
        } = event; // event 안에서 target 안에서 파일을 받아오는 것 
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            // console.log(finishedEvent);
            const {
                currentTarget: {result}
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment("");

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={mweet} onChange={onChange} type="text" placeholder="What's on your mind" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Mweet" />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" /> 
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
            </form>
            <div>
                {mweets.map((mweet) => (
                    <Mweet key={mweet.id} mweetObj={mweet} isOwner={mweet.createrId === userObj.uid}/>
                ))}
            </div>
        </div>
    );
};

export default Home;