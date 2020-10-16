import React, {useEffect, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {Avatar} from "@material-ui/core";
import request from "../../services/request";

const UserAutoComplete = ({ticket, AssignedUser, disabled, sendUpdatedTicketList}) => {
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

    const onChange = (event, value) => {
        const email = value?.email;
        let users = [...ticket.users];
        if(!AssignedUser) {
            users =  [...users,{is_master: 0, email }];
        } else {
            users = users.map((user) =>  Number(user.is_master) ? user : {'is_master': 0, email});
        }
        sendUpdatedTicketList({...ticket, users});
    }

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
            disabled={disabled}
            value={AssignedUser ? AssignedUser : null}

            onChange={onChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="assigned"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password',
                    }}
                />)}
        />
    );
}

export default UserAutoComplete;
