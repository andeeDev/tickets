const persistenStore = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if(serializedState === null) {
            return undefined;
        }
        return {
            "auth": JSON.parse(serializedState)
        };
    } catch (e) {
        return undefined;
    }
}

const saveState = (state) => {
    try {
        const serializeState = JSON.stringify(state);
        localStorage.setItem('state', serializeState);
    } catch (e) {

    }
}
const clearStorage = () => {
    try{
        localStorage.clear();
    } catch (e) {

    }
}
export {persistenStore, saveState, clearStorage};
