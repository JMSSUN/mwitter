import AuthForm from 'components/AuthForm';
import { firebaseInstance, authService } from 'fbase';
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Auth = () => {      
    const onSocialClick = async (event) => {
        const {target:{name}} = event;
        let provider;
        if(name === "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if(name === "github") {
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }
        await authService.signInWithPopup(provider);
    };

    return (
        <div className="authContainer">
            <FontAwesomeIcon
                icon={faTwitter}
                color={"#04AAFF"}
                size="3x"
                style={{ marginBottom: 30 }}
            />
            <AuthForm />
            <div className="authBtns">
                <button name="google" onClick={onSocialClick} className="authBtns">Continue with Google <FontAwesomeIcon icon={faGoogle} /></button>
                <button name="github" onClick={onSocialClick} className="authBtns">Continue with GitHub <FontAwesomeIcon icon={faGithub} /></button>
            </div>
        </div>
    );
}
export default Auth;