const getFirstError = (errors) => {
    return errors[Object.keys(errors)[0]];
}

export default getFirstError;
