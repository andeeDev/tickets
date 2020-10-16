import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import request from "../../../services/request";
import './registar.css';
import {useHistory} from "react-router";

const Register = ({setError}) => {
    const history = useHistory();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(event.target);
        const formData = new FormData(event.target);
        try {
            const res = await request({method: 'post', url: 'auth/registration', data: formData});
            console.log(res);
            history.push('/login');
        } catch (e) {
            setError(e);
        }
    }
    return (
        <div className='form-wrapper'>
            <form onSubmit={handleSubmit}
                  className='auth-form'>
                <h2>Register</h2>
                <div className='form-fields'>
                    <TextField id="name" name='name' label="Enter name" />
                    <TextField id="email" name='email' label="Email" />
                    <TextField id="password" name='password' label="Password" />
                    <TextField id="password" name='password_confirmation' label="Confirm" />
                </div>
                <Button
                    type='submit'
                    variant="contained"
                    color="primary">
                    Register
                </Button>
            </form>
        </div>
    );
}

export default Register;

