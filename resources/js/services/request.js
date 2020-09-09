import axios from 'axios';
import API_PREFIX from "../constants/api_prefix";

const request = ({method, url, data = {}, params = {}, headers = {} }) => axios({
    method: method,
    url: `${API_PREFIX}${url}`,
    data: data,
    params: params,
    headers: headers
});

export default request;
