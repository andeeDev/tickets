import React, {useContext, useEffect, useState} from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import './table-wrapper.css';
import request from "../../services/request";
import {Avatar} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import {connect} from 'react-redux';
import makeStyles from "@material-ui/core/styles/makeStyles";
import SocketContext from "../../context/SocketContext";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
const useStyles = makeStyles((theme) => ({
    fab: {
        margin: theme.spacing(2),
    },
    absolute: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(3),
    },
}));


const ProjectsPage = ({access_token}) => {
    const socket = useContext(SocketContext);

    const classes = useStyles();
    const [projects, setProjects] = useState([]);
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("message = ", message);
        switch (message.type) {
            case 'projects.title':
                const newProjects = projects.map((project) => project.id === message.project.id ?
                    {...project, title: message.project.title } :
                    project);
                console.log("newProjects = ", newProjects);
                setProjects(newProjects);
                break;
            case 'projects.delete':
                setProjects(projects.filter(p => p.id !== message.project_id))
                break;
            case 'projects.add':
                setProjects([...projects, message["project"]]);
                break;
        }
    };
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

    const headers = {
            'X-Requested-With' : 'XMLHttpRequest',
            'Authorization': `Bearer ${access_token}`  };

    useEffect(() => {
        const requestProjects = async () => {
            try {
                const projects = await request({
                    url: 'projects',
                    method: 'GET',
                    headers
                });
                setProjects(projects.data);
            } catch (e) {

            }
        }
        requestProjects();
    }, [])


    const addProject = async () => {
        const message = {
            type: 'projects.add',
            access_token
        };
        console.log("add Projecct, message = ", message);
        send(JSON.stringify(message));
    };

    const onChangeInput = (id) => (e) => {
        const socketObject = {
            type: 'projects.title',
            id: id,
            'title': e.target.value,
            access_token
        };
        send(JSON.stringify(socketObject));

        const newProjects = projects.map((project) => project.id === id ?
            {...project, title: e.target.value} : project)
        setProjects(newProjects);
    }

    const deleteProject = (id) => () => {
        const socketObject = {
            type: 'projects.delete',
            id: id,
            access_token
        };
        send(JSON.stringify(socketObject));
    }

    return (
        <div className='projects__table-paper'>
            <table className='projects__table'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Creator</th>
                        <th/>
                    </tr>
                </thead>
                <tbody>
                {projects.map((project) => {
                    return (
                        <tr key={project.id}>
                            <td>{project.id}</td>
                            <td>
                                <input onChange={onChangeInput(project.id)}
                                    className='projects__input'
                                       placeholder='Enter project title'
                                       name={`project.title[${project.id}]`}
                                       value={project.title}
                                />
                            </td>
                            <td>
                                <Tooltip title={project.users.name} aria-label="add">
                                    <Avatar alt={project.users.name}
                                            src={project.users.image?
                                                `/storage/${project.users.image}` :
                                                '/broken-image.jpg'} />
                                </Tooltip>
                            </td>
                            <td>
                                <IconButton
                                    aria-label="delete" onClick={deleteProject(project.id)}  className={classes.margin} size="small">
                                    <DeleteIcon  />
                                </IconButton>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
            <Tooltip title="Add" aria-label="add" className='projects_add-button'>
                <Fab onClick={addProject} color="secondary" >
                    <AddIcon />
                </Fab>
            </Tooltip>
        </div>
    );
}
const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        access_token: state.auth.tokens.access_token
    }
}

export default connect(mapStateToProps)(ProjectsPage);
