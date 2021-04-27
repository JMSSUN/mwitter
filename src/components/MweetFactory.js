import React, {useState} from 'react';
import {storageService, dbService} from 'fbase';
import {v4 as uuidv4} from 'uuid';

const MweetFactory = ({userObj}) => {
    const [mweet, setMweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if(attachment !== "") { // 첨부파일 있을 때
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
            
        }
        const mweetObj = {
            text: mweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
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

    return(
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
    )
}
export default MweetFactory;