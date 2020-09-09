import React, {useState, useEffect, useMemo} from 'react';
import { useHistory } from 'react-router-dom';
import ErrorContext from '../../context/ErrorContext/ErrorContext';


// The top level component that will wrap our app's core features
const ErrorHandler = ({ children }) => {
    const history = useHistory();
    const [error, setError ] = useState();

    // Make sure to "remove" this status code whenever the user
    // navigates to a new URL. If we didn't do that, then the user
    // would be "trapped" into error pages forever
    useEffect(() => {
        // Listen for changes to the current location.
        const unlisten = history.listen(() => setError(undefined));
        // cleanup the listener on unmount
        return unlisten;
    }, [])

    // This is what the component will render. If it has an
    // errorStatusCode that matches an API error, it will only render
    // an error page. If there is no error status, then it will render
    // the children as normal
    const renderContent = () => {
        //if(error) {
            if (error?.status === 404) {
                return <Page404 />
            }
        //}
        return children;
    }

    // We wrap it in a useMemo for performance reasons. More here:
    // https://kentcdodds.com/blog/how-to-optimize-your-context-value/
    const contextPayload = useMemo(
        () => ({ error, setError }),
        [error,setError]
    );

    // We expose the context's value down to our components, while
    // also making sure to render the proper content to the screen
    return (
        <ErrorContext.Provider value={contextPayload}>
            {renderContent()}
        </ErrorContext.Provider>
    )
}
export default ErrorHandler;

