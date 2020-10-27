const dispatchError = (dispatch, error) => {
    dispatch({
        type: 'ADD_ERROR',
        payload: error
    })
}

const clearError = (dispatch) => {
    dispatch({
        type: 'CLEAR_ERROR'
    })
}

export {dispatchError, clearError};
