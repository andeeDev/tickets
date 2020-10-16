const saveToken = (auth) => {
    localStorage.setItem('auth', JSON.stringify(auth));
}
export default saveToken;
