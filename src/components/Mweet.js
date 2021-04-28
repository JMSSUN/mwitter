import { dbService, storageService } from 'fbase';
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Mweet = ({mweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newMweet, setNewMweet] = useState(mweetObj.text);

    const onDeleteClick = async() => {
        const ok = window.confirm("Are you sure you want to delete this mweet?");
        if(ok) {
            //delete
            await dbService.doc(`mweets/${mweetObj.id}`).delete();
            if(mweetObj.attachmentUrl !== "" ){
                await storageService.refFromURL(mweetObj.attachmentUrl).delete();
            }
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async(event) => {
        event.preventDefault();
        // console.log(mweetObj, newMweet);
        await dbService.doc(`mweets/${mweetObj.id}`).update({
            text:newMweet
        });
        setEditing(false);
    }
    const onChange = (event) => {
        const {
            target : {value},
        } = event;
        setNewMweet(value);
    }

    return (
       
        <div className="nweet">
           {editing ? (
            <>
                <form onSubmit={onSubmit}  className="container nweetEdit">
                    <input type="text" placeholder="Edit your mweet " value={newMweet} required onChange={onChange} autoFocus className="formInput"/> 
                    <input type="submit" value="Update Mweet" className="formBtn" />
                    <span onClick={toggleEditing} className="formBtn cancelBtn">Cancel</span>
                </form>
            </>
            ) : (
            <>
                <h4>{mweetObj.text}</h4>
                {mweetObj.attachmentUrl && <img src={mweetObj.attachmentUrl} />}
                {isOwner && (
                    <div class="nweet__actions">
                        <span onClick={onDeleteClick}>
                        <FontAwesomeIcon icon={faTrash} />
                        </span>
                        <span onClick={toggleEditing}>
                        <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                    </div>
                )}
            </>
           )
       }
       </div>
    )
};

export default Mweet;