import { dbService, storageService } from 'fbase';
import React, { useState } from 'react';

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
       
        <div>
           {editing ? (
            <>
                <form onSubmit={onSubmit}>
                    <input type="text" placeholder="Edit your mweet " value={newMweet} required onChange={onChange} /> 
                    <input type="submit" value="Update Mweet" />
                    <button onClick={toggleEditing}>Cancel</button>
                </form>
            </>
            ) : (
            <>
                <h4>{mweetObj.text}</h4>
                {mweetObj.attachmentUrl && <img src={mweetObj.attachmentUrl} width="50px" height="50px"/>}
                {isOwner && (
                    <>
                        <button onClick={onDeleteClick}>Delete</button>
                        <button onClick={toggleEditing}>Edit</button>
                    </>
                )}
            </>
           )
       }
       </div>
    )
};

export default Mweet;