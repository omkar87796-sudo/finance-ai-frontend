import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'https://finance-ai-backend-s9cn.onrender.com';

const api = axios.create({ baseURL });

export default api;
