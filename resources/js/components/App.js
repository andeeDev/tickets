import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";
import { Route, Switch } from "react-router";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import Page404 from "../pages/Page404/Page404";
import ErrorHandler from '../components/ErrorBoundary/ErrorBoundary';
import ProjectsPage from '../pages/ProjectsPage/ProjectsPage';


if (document.getElementById('app')) {
    ReactDOM.render(
            <BrowserRouter>
                <ErrorHandler>
                    <Switch>
                        <Route exact path="/login" component={LoginPage} />
                        <Route exact path="/projects" component={ProjectsPage} />
                        <Route exact path="/register" component={RegisterPage} />
                        <Route component={Page404} />
                    </Switch>
                </ErrorHandler>
            </BrowserRouter>
        , document.getElementById('app'));
}
