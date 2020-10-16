import React, {useState, useEffect} from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {makeStyles} from "@material-ui/core/styles";
import ProjectAutoComplete from "../../AutoCompletes/ProjectAutoComplete/ProjectAutoComplete";
import UserAutoComplete from "../../AutoCompletes/UserAutoComplete";

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));
import './ticket.css';
import Tooltip from "@material-ui/core/Tooltip";
import Avatar from "@material-ui/core/Avatar";
const priorities = ['High', 'Middle', 'Low'];
const statuses = ['New', 'In Progress', 'Done'];

const Ticket = ({ user, deleteTicket, sendUpdatedTicketList, refInputs, ...props}) => {
    const classes = useStyles();
    const [ticket, setTicket] = useState(props.ticket);

    const { users } = ticket;
    const creator = users.find(user => Number(user["is_master"]) === 1);
    const AssignedUser = users.find(user => Number(user["is_master"]) === 0);
    let isAccessible = creator["id"] === user.id;
    if(AssignedUser !== undefined) {
      isAccessible = isAccessible || AssignedUser["id"] === user.id;
    }

    useEffect(() => {
        setTicket(props.ticket);
    }, [props.ticket])

    const onTitleChange = (event) => {
        setTicket({...ticket, 'title': event.target.value});
        sendUpdatedTicketList({...ticket, 'title': event.target.value});
    }

    const onSubjectChange = (event) => {
        setTicket({...ticket, 'subject': event.target.value});
        sendUpdatedTicketList({...ticket, 'subject': event.target.value});
    }
    const onDescriptionChange = (event) => {
        setTicket({...ticket, 'description': event.target.value});
        sendUpdatedTicketList({...ticket, 'description': event.target.value});
    }

    const onChangeStatus = (event, value) => {
        setTicket({...ticket, 'status': value})
        sendUpdatedTicketList({...ticket, 'status': value});
    }

    const onChangePriority = (event, value) => {
        setTicket({...ticket, 'priority': value});
        sendUpdatedTicketList({...ticket, 'priority': value});
    }


    return (
        <tr key={ticket.id}>
            <td>{ticket.id}</td>
            <td>
                <input ref={refInputs} placeholder='Enter ticket title'
                       type='text' onChange={onTitleChange}
                       value={ticket.title}
                       disabled={!isAccessible} />
            </td>
            <td>
                <ProjectAutoComplete
                    ticket={ticket}
                    updateTicketList={sendUpdatedTicketList}
                    disabled={!isAccessible}
                />
            </td>
            <td>
                <input placeholder='ticket Subject'
                       type='text'
                       value={ticket.subject}
                       onChange={onSubjectChange}
                       disabled={!isAccessible}/>
            </td>
            <td>
                <textarea  name="description"
                           value={ticket.description}
                           onChange={onDescriptionChange}
                           disabled={!isAccessible}/>
            </td>
            <td>
                <Autocomplete
                    id={`status_${ticket.id}`}
                    options={statuses}
                    getOptionLabel={(option) => option}
                    style={{ width: 200 }}
                    value={ticket.status === "" ? null : ticket.status}
                    onChange={onChangeStatus}
                    disabled={!isAccessible}
                    renderInput={(params) =>
                        <TextField {...params} label="Status" variant="outlined" />}
                />
            </td>
            <td>
                <Autocomplete
                    id={`priority_${ticket.id}`}
                    options={priorities}
                    getOptionLabel={(option) => option}
                    style={{ width: 200 }}
                    onChange={onChangePriority}
                    disabled={!isAccessible}
                    value={ticket.priority === "" ? null : ticket.priority}
                    renderInput={(params) =>
                        <TextField {...params} label="Priority" variant="outlined" />}
                />
            </td>
            <td>
                <Tooltip title={creator.name} aria-label="creator name">
                                <Avatar alt={creator.name}
                                        src={creator.image?
                                            `/storage/${creator.image}` :
                                            '/broken-image.jpg'}/>
                            </Tooltip>
            </td>
            <td>
                <UserAutoComplete ticket={ticket}
                                  sendUpdatedTicketList={sendUpdatedTicketList}
                                  AssignedUser={AssignedUser}
                                  disabled={!isAccessible}/>
            </td>
            <td>
                <IconButton
                    aria-label="delete" onClick={isAccessible ? deleteTicket : ()=>{}}  className={classes.margin} size="small">
                    <DeleteIcon  />
                </IconButton>
            </td>
        </tr>
    );
}

export default Ticket;
