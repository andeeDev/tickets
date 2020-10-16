import React, {useRef, useState} from "react";
import {connect} from 'react-redux';
import { FormControl } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from "@material-ui/icons/Add";
import { Fab} from "@material-ui/core";
import {useDropzone} from 'react-dropzone';
import './profile.css';
import Button from '@material-ui/core/Button';
import request from "../../services/request";


const Profile = ({user, access_token, success}) => {

    const inputRef = useRef();
    const [fileName, setFileName] = useState();
    const [stateUser, setUser] = useState(user);
    if(user !== stateUser) {
        setUser(user);
    }
    const onFileLoaded = () => {
        setFileName(inputRef.current.files[0].name);
        console.log(fileName);
    }
    const countries = [
         'Ukraine',
         'United States'
    ];
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));
    const onChangeName = (e) => {
        setUser({...stateUser, name: e.target.value})
    }
    const onChangeEmail = (e) => {
        setUser({...stateUser, email: e.target.value})
    }
    const onChangeSex = (e, v) => {
        setUser({...stateUser, sex: e.target.value})
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('_method', 'PATCH');
        try{
            const response = await request({
                method: 'POST',
                url: `users/${user.id}`,
                data: formData,
                headers:{ 'Authorization': 'Bearer ' + access_token}
            });
            success(response.data);
        } catch (e) {

        }
    }
    return (
        <main>
            <section className='user-information'>
                <form onSubmit={handleSubmit}>
                    <div className='profile__image-controller'>
                        <Avatar src={
                            user.image ?
                                `/storage/${stateUser.image}`:
                                `/broken-image.jpg`}
                                style={{width: '200px', height:'200px'}} />
                        <div className='profile__header-info'>
                            <p>
                                Name:&nbsp;
                                <b className='user-information__name'>{user.name ? user.name : 'Edit your name'}</b>
                            </p>
                            <p>Email:&nbsp;
                                <b className='user-information__email'>{user.email}</b>
                            </p>
                            <section className="user-information__drop-container">
                                <div  {...getRootProps({className: 'user-information__dropzone'})}>
                                    <input {...getInputProps()} />
                                    <p>Drag 'n' drop some files here, or click to select files</p>
                                </div>
                                <aside>
                                    <h4>File</h4>
                                    <ul>{files}</ul>
                                </aside>
                            </section>
                        </div>

                    </div>
                    <div className='profile__text-info'>
                        <h2 className='user-information__name'>User details</h2>

                        <div className='user-information__list'>
                            <div className='user-information__wrapper'>
                                <FormControl>
                                    <InputLabel htmlFor="my-input">Enter your name</InputLabel>
                                    <Input id="my-input" onChange={onChangeName} name='name'
                                           aria-describedby="my-helper-text" defaultValue={stateUser.name}/>
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="my-input">Email address</InputLabel>
                                    <Input id="my-input" name='email' onChange={onChangeEmail}
                                           aria-describedby="my-helper-text" defaultValue={stateUser.email}/>
                                    <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
                                </FormControl>
                            </div>
                            <div className='user-information__wrapper'>


                                <Autocomplete
                                    id="combo-box-demo"
                                    options={countries}
                                    getOptionLabel={(option) => option}
                                    style={{ width: 200 }}
                                    defaultValue={user.country}                                    renderInput={(params) => <TextField {...params} name='country' label="Combo box" variant="outlined" />}
                                />

                                <FormControl className='sex'>
                                    <InputLabel id="demo-simple-select-label">Enter your sex</InputLabel>
                                    <Select
                                        style={{ width: 200 }}
                                        name='sex'
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        defaultValue={stateUser.sex ? stateUser.sex : ''}
                                        onChange={onChangeSex}
                                    >
                                        <MenuItem value={'M'}>Male</MenuItem>
                                        <MenuItem value={'F'}>Female</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className='user-information__wrapper'>
                                <FormControl>
                                    <InputLabel htmlFor="my-input">Change your password</InputLabel>
                                    <Input id="my-input" name='password' aria-describedby="my-helper-text" />
                                </FormControl>

                                <FormControl>
                                    <InputLabel htmlFor="my-input">Password confirmation</InputLabel>
                                    <Input id="my-input" name='password_confirmation' aria-describedby="my-helper-text" />
                                </FormControl>
                            </div>
                        </div>

                        <div className='user-information__photo-button-wrapper'>
                            <label htmlFor="upload-photo">
                            <input ref={inputRef}
                                style={{ display: "none" }}
                                id="upload-photo"
                                name="image"
                                type="file"
                                   onChange={onFileLoaded}
                            />
                            <Fab
                                color="secondary"
                                size="small"
                                component="span"
                                aria-label="add"
                                variant="extended"
                            >
                                <AddIcon /> Upload photo
                            </Fab>
                                {fileName ? fileName : 'file not choosen'}
                         </label>
                        </div>
                    </div>
                    <Button variant="contained" type='submit' color="primary">
                        Submit
                    </Button>
                </form>
            </section>
        </main>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        access_token: state.auth.tokens.access_token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        success: (data) => { dispatch({type: 'PATCH_USER_SUCCESS', payload: data}) }
    }
}

/*<Autocomplete
    ref={autoCompleteRef}
    id="combo-box-demo"
    options={countries}
    getOptionLabel={(option) => option ? option : ''}
    style={{ width: 200 }}
    defaultValue={stateUser.country !== 'null' ? stateUser.country : '' }
    onChange={onChangeCountry}
    renderInput={(params) => <TextField {...params} label="Choose your country" variant="outlined" />}
/>*/

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
