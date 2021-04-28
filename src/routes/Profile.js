import { authService, dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

const Profile = ({userObj, refreshUser}) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/"); // go home
    }
    const getMyMweets = async() => {
        const mweets = await dbService.collection("mweets").where("creatorId", "==", userObj.uid).orderBy("createdAt", "desc").get();
        // console.log(mweets.docs.map(doc => doc.data()));
    }
    useEffect(() => {
        getMyMweets();
    }, []);
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName : newDisplayName,
            });
            refreshUser();
        }
    };
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input onChange={onChange} type="text" placeholder="display name" value={newDisplayName} autoFocus className="formInput"/>
                <input type="submit" value="Update profile" className="formBtn" style={{ marginTop: 10, }}/>
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    );
}

export default Profile;