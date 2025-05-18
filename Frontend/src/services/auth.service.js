import axios from "axios";

export const login = async (login, password) => {
  const response = await axios.post('api/Auth/Login', {
    login,
    password,
  });
  localStorage.setItem('userRole', response.data.role)
  localStorage.setItem('username', response.data.username)
};

export const getRole = () => {
  return localStorage.getItem('userRole');
}

export const getName = () => {
  return localStorage.getItem('username');
}

export const isTeacher = () => {
  return localStorage.getItem('userRole') === 'Преподаватель';
}

export const isSigned = async () => {
  try{
    const response = await axios.get('api/Auth/IsSignedIn');
    return response.data.isSignedIn;
  }
  catch{
    return false;
  }
}

export const logout = async () => {
  await axios.get('api/Auth/Logout');
};