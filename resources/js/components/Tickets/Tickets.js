import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import React, {useContext, useEffect, useRef, useState} from "react";
import {connect} from 'react-redux';
import SocketContext from "../../context/SocketContext";
import CircularProgress from '@material-ui/core/CircularProgress';
import {addNewTicket, removeTicket, requestAllTickets, updateTicketsList} from "../../actions/TicketsActions";
import Ticket from './Ticket/Ticket';

const Tickets = ({access_token, loading, ticketsR, tickets,
                     user,
                     fetchTickets, requestAllTickets,
                     successTickets: success,
                     removeTicket,
                     addNewTicket,
                     updateTicketsListAction,
                     ...props}) => {
    const socket = useContext(SocketContext);
    const inputRef = useRef([]);


    const headers = {
        'X-Requested-With' : 'XMLHttpRequest',
        'Authorization': `Bearer ${access_token}`  };

    useEffect(() => {
        requestAllTickets(headers);
    }, []);

    if(loading) {
        return (<div style={{margin: '0 auto', width: '40px'}}><CircularProgress /></div>);
    }

    const send = function (message, callback) {
        waitForConnection(function () {
            socket.send(message);
            if (typeof callback !== 'undefined') {
                callback();
            }
        }, 1000);
    };
    const waitForConnection = function (callback, interval) {
        if (socket.readyState === 1) {
            callback();
        } else {
            setTimeout(function () {
                waitForConnection(callback, interval);
            }, interval);
        }
    };

    const addTicket = () => {
        const jsonMessage = {
            type: 'tickets.add',
            access_token
        }
        send(JSON.stringify(jsonMessage));
    };
    const deleteTicket = (id) => () => {
        const jsonMessage = {
            type: 'tickets.delete',
            id,
            access_token
        }
        send(JSON.stringify(jsonMessage));

    };

    const sendUpdatedTicketList = (ticket, project_name) => {
        ticket['project_name'] = project_name;
        const object = JSON.stringify({
            type: 'tickets.update',
            ticket: ticket,
            access_token
        });
        send(object, () => {});
    }

    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
            case 'tickets.delete':
                removeTicket(ticketsR.data.filter((ticket) => ticket.id !== data.ticket.id));
                inputRef.current = inputRef.current.filter((input) => input !== null);
                break;
            case 'tickets.add':
                addNewTicket([...ticketsR.data, data.ticket]);
                inputRef.current[inputRef.current.length-1].focus();
                break;
            case 'tickets.update':
                const ticket = data.ticket;
                const newTicketList = ticketsR.data.map((mapedticket) =>
                    (ticket.id === mapedticket.id
                    ? ticket : mapedticket));
                updateTicketsListAction(newTicketList);
                break;
        }
    }

    return (
        <>
            <div className='projects__table-paper'>
                <table className='projects__table'>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Project</th>
                        <th>Subject</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Creator</th>
                        <th>Assigned</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tickets.map((ticket, index) => (<Ticket
                        deleteTicket={deleteTicket(ticket.id)}
                        key={ticket.id}
                        ticket={ticket}
                        user={user}
                        refInputs={el => inputRef.current[index] = el}
                        sendUpdatedTicketList={sendUpdatedTicketList}
                    />))}
                    </tbody>
                </table>
                <Tooltip title="Add" aria-label="add" className='projects_add-button'>
                    <Fab onClick={addTicket} color="secondary">
                        <AddIcon/>
                    </Fab>
                </Tooltip>
            </div>
        </>
    );
}
const filterTickets = (tickets, {title, key: paramKey, email}) => {
    const key = paramKey.toLowerCase();
    if(!tickets.length) {
        return tickets;
    }

    const newTickets = tickets
        .filter((ticket) => ticket.title.includes(title))
        .filter((ticket) => {
            const t = {...ticket};
            if(!t.projects) {
                t.projects = {title: ''};
            }
            return ticket.title.toLowerCase().includes(key) ||
                ticket.subject.toLowerCase().includes(key) ||
                ticket.description.toLowerCase().includes(key) ||
                ticket.status.toLowerCase().includes(key) ||
                ticket.priority.toLowerCase().includes(key) ||
                t.projects.title.toLowerCase().includes(key) ||
                ticket.users.filter(user => user.name.includes(key) || user.email.includes(key)).length

        })
        .filter((ticket) => {
            if(email === '') {
                return ticket;
            }
            if(ticket.hasOwnProperty('users')){
                const assigned = ticket.users.filter((user) => !Number(user.is_master));
                console.log("assigned", assigned);
                if(assigned.length) {
                    return assigned[0].email.includes(email);
                }
                /*if(assigned)*/
                //return assigned.email.includes(email);
            }
            return false;
        });
    return newTickets;
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        access_token: state.auth.tokens.access_token,
        tickets: filterTickets(state.ticketsR.data, state.ticketsR.filters),
        ticketsR: state.ticketsR
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        requestAllTickets: headers => requestAllTickets(dispatch, headers),
        addNewTicket: data => addNewTicket(dispatch, data),
        removeTicket: data => removeTicket(dispatch, data),
        updateTicketsListAction: data => updateTicketsList(dispatch, data)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tickets);
