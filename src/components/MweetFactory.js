import React, {useState} from 'react';
import {storageService, dbService} from 'fbase';
import {v4 as uuidv4} from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const MweetFactory = ({userObj}) => {
    const [mweet, setMweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (event) => {
        if (mweet === "") {
            return;
        }
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
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input className="factoryInput__input" value={mweet} onChange={onChange} type="text" placeholder="What's on your mind" maxLength={120} />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label for="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input  id="attach-file" type="file" accept="image/*" onChange={onFileChange} style={{ opacity: 0, }} />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img src={attachment} style={{ backgroundImage: attachment, }} /> 
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
            
        </form>
    )
}
export default MweetFactory;