import React from "react";
import {connect} from "react-redux";
import {updateFilters as updateFiltersAction} from "../../actions/TicketsActions";
import UserFilter from "../UserFilter/UserFilter";
import TextField from "@material-ui/core/TextField";
import './filters.css';

const Filters = ({filters, updateFilters}) => {

    const debounce = _.debounce(function (event) {
        console.log(event.target.value);
        updateFilters({
            ...filters,
            title: event.target.value
        });
    }, 1000);
    const onTitleChange = (e) => {
        e.persist();
        debounce(e);

    };
    const onKeyChange = (e) => {
        updateFilters({
            ...filters,
            key: e.target.value
        });
    };
    const onEmailChange = (value) => {
        if(value) {
            return updateFilters({
                ...filters,
                email: value
            });
        }
        updateFilters({
            ...filters,
            email: ''
        });
    };

    return (
        <div className="projects__filters">
            <div className="projects__filters-block filters">
                <TextField className="filters__title" name="filters__title" id="filters__title" label="Title" onChange={onTitleChange}/>
                <TextField className="filters__key" name="filters__key" id="filters__key" label="Key word" onChange={onKeyChange} />
                <UserFilter onChange={onEmailChange}  />
            </div>
        </div>
    );
}
const mapStateToProps = (state) => {
    return {
        filters: state.ticketsR.filters
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateFilters: data => updateFiltersAction(dispatch, data)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Filters);
