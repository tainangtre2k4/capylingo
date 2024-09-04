

import axios from "axios";

const BASE_URL = 'http://172.20.10.2:3000/api/apigemini';

const getGeminiApi = (userMsg: string) => axios.get(BASE_URL + "?input=" + userMsg);

export default {
    getGeminiApi
};
