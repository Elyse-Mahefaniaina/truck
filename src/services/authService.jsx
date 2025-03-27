import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BASE_URL}/auth/login`; 

export const login = async (email, password) => {
  try {
    const data= { email: email, password: password }
    const response = await axios.post(API_URL, data);
    
    const { accessToken } = response.data;
    
    sessionStorage.setItem('accessToken', accessToken);
    window.location.href = "/trip";
  } catch (error) {
    throw new Error(error);
  }
};

const isAuthenticated = () => {
  //edit later
  return !!sessionStorage.getItem('accessToken');
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {login, isAuthenticated};
