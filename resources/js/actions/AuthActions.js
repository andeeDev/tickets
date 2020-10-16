const updateUserRequest = (dispatch) => {
    dispatch({
        type: 'PATCH_USER_REQUEST'
    })
}
const updateUserFailure = (dispatch, data) => {
    dispatch({
        type: 'PATCH_USER_FAILURE',
        payload: data
    })
}
const updateUserSuccess = (dispatch, data) => {
    dispatch({
        type: 'PATCH_USER_SUCCESS',
        payload:data
    })
}



