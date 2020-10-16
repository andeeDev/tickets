import React, {useContext} from 'react';
import Register from "../../components/Auth/Register/Register";
import StickMessage from "../../components/StickMesage/StickMessage";
import ErrorContext from "../../context/ErrorContext/ErrorContext";

const RegisterPage = () => {
    const {error, setError} = useContext(ErrorContext);

    return (
        <>
        <Register setError={setError}/>
        {error ?
            <StickMessage setError={setError} error={error} /> :
            null}
        </>
        );
}

export default RegisterPage;
