import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {Avatar} from "@material-ui/core";
import request from "../../services/request";

const UserFilter = ({onChange}) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;
    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            const {data} = await request(
                {
                    method: 'GET',
                    url: 'users/autocomplete',
                });
            const {users} = data;
            if (active) {
                setOptions(users.map((user) => ({
                    'image': user.image,
                    'email': user.email
                })));
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);
    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);


    return (
        <Autocomplete
            id={`assigned_to_${Math.random()}`}
            options={options}
            style={{width: 300 }}
            autoHighlight
            open={open}
            getOptionSelected={(option, value) => option.email === value.email}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            loading={loading}
            getOptionLabel={(option) => option.email}
            renderOption={(option) => (
                <React.Fragment>
                    <Avatar  src={option.image ?
                        `/storage/${option.image}`
                        : `/broken-image.jpg`}  />
                    <span style={{marginLeft: '15px'}}>{option.email}</span>
                </React.Fragment>
            )}
            onInputChange={(event, newInputValue) => {
                onChange(newInputValue)
            }}
            onChange={(event, newInputValue) => onChange(newInputValue?.email)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="assigned"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                />)}
        />
    );
}

export default UserFilter;
