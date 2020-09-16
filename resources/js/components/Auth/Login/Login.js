import React, {useContext, useEffect, useRef, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import './login.css';
import request from "../../../services/request";
import {Redirect, useHistory} from "react-router-dom";

import {connect} from "react-redux";



const Login = ({setError, dispatch,  ...props}) => {
    const [checked, setCheckbox] = useState(false);
    const history = useHistory();
    const toggleCheckbox = () => {
        setCheckbox(!checked);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch({
            type: 'FETCH_TOKEN_REQUEST'
        });
        const formData = new FormData(event.target);
        try {
            /*fetchWithAuth('')*/
            const {data} = await request({method: 'post', url: 'auth/login', data: formData});
            dispatch({
                type: 'FETCH_TOKEN_SUCCESS',
                payload: data
            });
            history.push('/profile');
        } catch (e) {
            dispatch({
                type: 'FETCH_TOKEN_FAILURE',
                payload: e
            });
        }

    }


    return (
        <>
            <div className='form-wrapper'>
                <form onSubmit={handleSubmit}
                      className='auth-form'>
                    <h2>Login</h2>
                    <div className='form-fields'>
                        <TextField id="email" name='email' label="Email" />
                        <TextField id="password" name='password' label="Password" />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={toggleCheckbox}
                                    name="remember_me"
                                    color="primary"
                                />
                            }
                            label="Запомнить меня"
                        />
                    </div>
                    <Button
                            type='submit'
                            variant="contained"
                            color="primary">
                        Log in
                    </Button>
                </form>
            </div>
        </>
    );
}
/*const mapDispatchToProps = dispatch => {
    return {
        success: (data) => dispatch({ type: 'FETCH_TOKEN_REQUEST', payload: data }),
        error: (error) => dispatch({ type: 'FETCH_TOKEN_FAILURE', payload: error }),
        loading: () => dispatch({ type: 'FETCH_TOKEN_SUCCESS' })
    }
}*/
const mapStateToProps = (state) => {
    return {
        state: state
    }
}
export default connect(mapStateToProps)(Login);

