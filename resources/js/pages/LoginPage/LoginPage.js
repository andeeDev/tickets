import React, {useContext} from 'react';
import Login from "../../components/Auth/Login/Login";
import StickMessage from "../../components/StickMesage/StickMessage";
import {useHistory} from "react-router-dom";
import ErrorContext from "../../context/ErrorContext/ErrorContext";

const LoginPage = () => {
    const {error, setError} = useContext(ErrorContext);
    const history = useHistory();

    /*if(token) {
        history.push('/index');
    }*/
    return (
        <>
            <Login setError={setError}/>
        </>
    );
}

export default LoginPage;
