const fetchTokenReducer = (state = { data: {}, loading: false, error: false}, action) => {
    switch (action.type) {
        case 'FETCH_TOKEN_REQUEST':
            return {
                ...state,
                data: {},
                loading: true,
                error: false
            }
        case 'FETCH_TOKEN_FAILURE':
            return {
                ...state,
                data: {},
                loading: false,
                error: action.payload
            }
        case 'FETCH_TOKEN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                tokens: action.payload.tokens,
                loading: false,
                error: false
            }
            //logout
        case 'LOGOUT_TOKEN_REQUEST':
            return {
                ...state,
                loading: true,
                error: false
            }
        case 'LOGOUT_TOKEN_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case 'LOGOUT_TOKEN_SUCCESS':
            return {
                ...state,
                loading: false,
                error: false
            }

            //refresh
        case 'REFRESH_TOKEN_REQUEST':
            return {
                ...state,
                loading: true,
                error: false
            }
        case 'REFRESH_TOKEN_FAILURE':
            return {
                ...state,
                data: {},
                loading: false,
                error: action.payload
            }
        case 'REFRESH_TOKEN_SUCCESS':
            return {
                ...state,
                data: action.payload,
                loading: false,
                error: false
            }
        // update user
        case 'PATCH_USER_REQUEST':
            return {
                ...state,
                loading: true,
                error: false
            }
        case 'PATCH_USER_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case 'PATCH_USER_SUCCESS':
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: false
            }

        default:
            return state
    }
}
export default fetchTokenReducer;
