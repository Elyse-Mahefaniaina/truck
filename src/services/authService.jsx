import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BASE_URL}/auth/check`; 

export const login = async (email, password) => {
  try {
    const data= { mail: email, password: password }
    const response = await axios.post(API_URL, data);
    const { accessToken, refreshToken } = response.data;

    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);
    
    window.location.href="/home";

    return response.data;
  } catch (error) {
    throw new Error('Invalid credentials');
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {login};
