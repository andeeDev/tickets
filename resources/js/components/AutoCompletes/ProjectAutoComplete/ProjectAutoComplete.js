import React, {useContext, useRef, useState, useCallback, useEffect} from "react";
import Autosuggest from 'react-autosuggest';
import request from "../../../services/request";
import './project-autocomplete.css';
import SocketContext from "../../../context/SocketContext";
//import autoCompleteTheme from './autoCompleteTheme.css';
import _ from 'lodash';

const getSuggestions = async( value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    try {
        const {data: suggestions} = await request({
            method:"GET",
            url: 'projects/autocomplete',
            params: {value: value}
        });
        return inputLength === 0 ? [] : suggestions.filter(suggestion =>
            suggestion.title.toLowerCase().slice(0, inputLength) === inputValue
        );
    } catch (e) {
        console.log(e);
    }
};


const getSuggestionValue = suggestion => suggestion.title;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
    <div>
        {suggestion.title}
    </div>
);
const ProjectAutoComplete = ({updateTicketList, disabled, ticket}) => {

    const [value, setValue] = useState(ticket.projects ? ticket.projects.title : "");
    const [suggestions, setSuggestions] = useState([]);
    const socket = useContext(SocketContext);

    useEffect(() =>{
        setValue(ticket.projects ? ticket.projects.title : "");
    }, [ticket])

    const debouncedSave = useRef(_.debounce(nextValue => onValueChange(nextValue), 1000))
        .current;



    //const deboun = q => _.debounce(onValueChange(q), 5000);
    const onChange = (event, {newValue}) => {
        const value = event.target.value;
        onValueChange(newValue);

        setValue(newValue);
        //debouncedSave(value);
    }



    const onValueChange = (string) => {
        if(string.length >= 3) {
            updateTicketList(ticket, string);
        }
    }

    const onSuggestionsFetchRequested = ({ value }) => {
        getSuggestions(value).then(data => setSuggestions(data));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const inputProps = {
        placeholder: 'Enter project name',
        value,
        onChange,
        disabled
    };

    return (<Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
    />);
}

export default ProjectAutoComplete;
