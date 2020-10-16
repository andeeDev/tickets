import React from "react";
import {Route, Redirect} from "react-router";
import {connect} from "react-redux";


const PrivateRoute = ({component: Component,  auth, ...rest}) => {
    return (
        <Route
            {...rest}
            render={(props) =>  auth /*Object.keys(auth).length !== 0*/
                ? <Component {...props} />
                : <Redirect to={{pathname: '/login', state: {from: props.location}}} /> }
        />
    )
}
function mapStateToProps(state) {
    return {
        auth: state.auth.tokens
    };
}

export default connect(mapStateToProps)(PrivateRoute);
