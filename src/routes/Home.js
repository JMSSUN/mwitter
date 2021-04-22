import { dbService } from 'fbase';
import React, { useEffect, useState } from 'react';

const Home = ({userObj}) => {
    const [mweet, setMweet] = useState("");
    const [mweets, setMweets] = useState([]);
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
        await dbService.collection("mweets").add({
            text: mweet,
            createdAt: Date.now(),
            createrId: userObj.uid
        });
        setMweet("");
    };

    const onChange = (event) => {
        const { target:{value}} = event;
        setMweet(value);
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={mweet} onChange={onChange} type="text" placeholder="What's on your mind" maxLength={120} />
                <input type="submit" value="Mweet" />
            </form>
            <div>
                {mweets.map((mweet) => (
                    <div key={mweet.id}>
                        <h4>{mweet.text}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;