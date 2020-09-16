import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";
import { Route, Switch } from "react-router";
// pages
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import Page404 from "../pages/Page404/Page404";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import ProjectsPage from '../pages/ProjectsPage/ProjectsPage';
import TicketsPage from '../pages/TicketsPage/TicketsPage'
// context providers
import ErrorHandler from '../components/ErrorBoundary/ErrorBoundary';
// functions

import PrivateRoute from "./PrivateRoute/PrivateRoute";

import { Provider } from 'react-redux';
import store from "../store";



const App = () => {

    return (
        <Provider store={store}>
        <BrowserRouter>
                <ErrorHandler>
                    <Switch>
                        <Route exact path="/register" component={RegisterPage} />
                        <Route exact path="/login" component={LoginPage} />
                        <PrivateRoute path='/profile' component={ProfilePage} />
                        <PrivateRoute path='/projects' component={ProjectsPage} />
                        <PrivateRoute path='/tickets' component={TicketsPage} />
                        <Route component={Page404} />
                    </Switch>
                </ErrorHandler>
        </BrowserRouter></Provider>

    )
}


if (document.getElementById('app')) {
    ReactDOM.render(
            <App/>
        , document.getElementById('app'));
}

