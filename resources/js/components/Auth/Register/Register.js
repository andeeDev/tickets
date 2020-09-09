import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import request from "../../../services/request";
import './registar.css';

const Register = () => {

    const [checked, setCheckbox] = useState(false);
    const toggleCheckbox = () => {
        setCheckbox(!checked);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(event.target);
        const formData = new FormData(event.target);

        const res = await request({method: 'post', url: 'auth/login', data: formData})
        console.log(res);
    }
    return (
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
                                value={checked ? '1' : '0'}
                                onChange={toggleCheckbox}
                                name="remember_me"
                                color="primary"
                            />
                        }
                        label="Remember me"
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
    );
}

export default Register;

