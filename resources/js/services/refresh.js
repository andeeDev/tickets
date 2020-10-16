import saveToken from "./saveToken";
import API_PREFIX from "../constants/api_prefix";

function refreshToken(token) {
    return fetch(`${API_PREFIX}auth/refreshToken`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token,
        }),
    })
        .then((res) => {
            if (res.status === 200) {
                const tokenData = res.json();
                saveToken(JSON.stringify(tokenData));
                return Promise.resolve();
            }
            return Promise.reject();
        });
}

export default refreshToken;
