import request from "../services/request";

const requestTickets = () => ({type: 'FETCH_TICKETS_REQUEST' });
const errorTickets = (data) => ({type: 'FETCH_TICKETS_FAILURE', payload: data });
const successTickets = (data) => ({type: 'FETCH_TICKETS_SUCCESS', payload: data });

const removeTicket = (dispatch, data) => (dispatch({type: 'REMOVE_TICKET', payload: data}));
const addNewTicket = (dispatch, data) => (dispatch({type: 'ADD_TICKET', payload: data}));

const requestAllTickets = (dispatch, headers) => {
    try {
        dispatch(requestTickets());
        request({
            url: 'tickets',
            method: 'GET',
            headers
        }).then((req) => {
            dispatch(successTickets(req.data));
        });
    } catch (e) {
        console.log(e);
        /*errorTickets({
            status: e.response.status,
            message: e.response.data.message
        });*/
    }
}
const updateTicketsList = (dispatch, data) => {
    dispatch({
        type: 'UPDATE_TICKET',
        payload: data
    });
}

const updateFilters = (dispatch, data) => {
    dispatch({
        type: 'UPDATE_FILTER',
        payload: data
    });
}



export {requestAllTickets, addNewTicket, removeTicket, updateTicketsList, updateFilters};
