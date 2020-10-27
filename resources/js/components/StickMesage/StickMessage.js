import React, {useContext, useEffect, useReducer, useState} from "react";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import getFirstError from "../../constants/getFirstError";
import {connect} from 'react-redux';
import {addNewTicket, removeTicket, requestAllTickets, updateTicketsList} from "../../actions/TicketsActions";
import {clearError} from "../../actions/ErrorAction";
import rootReducer from "../../reducers/rootReducer";
import authReducer from "../../reducers/authReducer";

const StickMessage = ({clearError, ticketsLoadError, authError}) => {
    const [state, dispatch] = useReducer(authReducer);
    console.log('useReducer state', state);
    console.log('useReducer dis', dispatch);
    console.log(authError);
    console.log(ticketsLoadError);
    let timeoutId;
    let errorMessage;
    const error = ticketsLoadError || authError;

    if(error) {
        switch (error.status) {
            case 401:
                errorMessage = 'Not authorized';
                break;
            case 422:
                errorMessage = error.message
                //errorMessage = getFirstError(error.);
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
        //clearError(error);
        timeoutId = setTimeout(() => clearError(), 6000);
        const clear = () => {
            clearTimeout(timeoutId);
            //setThisError(null)
        }
        return clear;
    }, [error])


    const handleClose = () => {
        clearTimeout(timeoutId);
        clearError();
        //setThisError(null);
    };

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }
    //autoHideDuration={6000}
    return (
        <Snackbar open={!!error} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
                {errorMessage}
            </Alert>
        </Snackbar>
    );
}

const mapStateToProps = (state) => {
    return {
        authError: state.auth.error,
        ticketsLoadError: state.ticketsR.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearError: () => clearError(dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StickMessage);
