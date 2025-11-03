import axios from 'axios';
const BASE_URL = import.meta.env.VITE_SERVER_URL; 

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout:80000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('token');
    console.log("📦 Sending token:", accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
    (response)=>{
        return response;
    },
    (error)=>{
        if(error.response){
            if (error.response.status===500){
                console.error("server error")
            }
        }else if(error.code==="ECONNABORTED"){
            console.error("request timeout,please try again later.")
        }
        return Promise.reject(error)
    }
)

export default axiosInstance;