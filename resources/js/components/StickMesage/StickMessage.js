import React, {useContext, useEffect, useState} from "react";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ErrorContext from "../../context/ErrorContext/ErrorContext";
import getFirstError from "../../constants/getFirstError";

const StickMessage = ({error,setError, open: openProps}) => {
    const [thisError, setThisError] = useState(error);
    let timeoutId;
    let errorMessage;

    if(thisError) {
        switch (thisError.response.status) {
            case 401:
                errorMessage = 'Not authorized';
                break;
            case 422:
                errorMessage = getFirstError(error.response.data.errors);
                break;
            case 403:
                errorMessage = 'Forbiden';
                break;
            case 400:
                errorMessage = 'Bad request, problems with url';
                break;
            case 500:
                errorMessage = 'Server error occurred';
                break;
        }
    }

    useEffect(() => {
        setThisError(error);
        timeoutId = setTimeout(() => setThisError(null), 6000);
        const clear = () => {
            clearTimeout(timeoutId);
            setThisError(null)
        }
        return clear;
    }, [error])


    const handleClose = () => {

        clearTimeout(timeoutId);
        setThisError(null);
    };

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }
    //autoHideDuration={6000}
    return (
        <Snackbar open={!!thisError} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
                {errorMessage}
            </Alert>
        </Snackbar>
    );
}

export default StickMessage;
