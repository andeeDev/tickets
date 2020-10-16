const initial = {
    data: [],
    loading: true,
    error: false,
    filters: {
        title: '',
        key: '',
        email: ''
    }};
const ticketsReducer = (state = initial, action) => {
    switch (action.type) {
        // load tickets
        case 'FETCH_TICKETS_REQUEST':
            return {
                ...state,
                data: [],
                loading: true,
                error: false

            }
        case 'FETCH_TICKETS_FAILURE':
            return {
                ...state,
                data: [],
                loading: false,
                error: {...action.payload}
            }
        case 'FETCH_TICKETS_SUCCESS':
            return {
                ...state,
                data: [...action.payload],
                loading: false,
                error: false,

            }
            //add ticket
        case 'ADD_TICKET':
            return {
                ...state,
                data: action.payload,
                loading: false,
                error: false
            }
            // remove ticket
        case 'REMOVE_TICKET':
            return {
                ...state,
                data: action.payload,
                loading: false,
                error: false
            }

        // update ticket
        case 'UPDATE_TICKET':
            return {
                ...state,
                data: action.payload,
                loading: false,
                error: false
            }
        case 'UPDATE_FILTER':
            return {
                ...state,
                loading: true,
                filters: action.payload
            }
        /*case 'UPDATED_FILTER':
            return {
                ...state,
                loading: false,
                filters: action.payload
            }*/


        default:
            return state
    }
}
export default ticketsReducer;
