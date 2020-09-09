import React, {useContext, useEffect, useRef, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import './login.css';
import request from "../../../services/request";
import {useHistory} from "react-router-dom";



const Login = ({setError}) => {
    const [checked, setCheckbox] = useState(false);
    const history = useHistory();
    const toggleCheckbox = () => {
        setCheckbox(!checked);
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
            const {data} = await request({method: 'post', url: 'auth/login', data: formData});
            localStorage.setItem('token', JSON.stringify(data));
            console.log(data);
            history.push('/projects')
        } catch (e) {
            setError(e);
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
export default Login;

