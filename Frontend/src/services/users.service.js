import axios from "axios";

export const canDeleteUser = async (id) => {
  try {
    const response = await axios.get(`api/User/CanDeleteUser?id=${id}`);
    return response.data;
  }catch{
    return {
        canDelete: false
    };
  }
};

export const createUser = async (login, password, lastName, firstName, middleName, roleId) => {
    try {
      await axios.post('api/User/CreateUser', {
        login,
        password,
        lastName, 
        firstName,
        middleName,
        roleId
      });
      return true;
    }catch{
      return false;
    }
  };

export const deleteUser = async (id) => {
    try {
      await axios.delete(`api/User/DeleteUser?id=${id}`);
      return true;
    }catch{
      return false;
    }
  };

export const getUsers = async () => {
    try {
        const response = await axios.get('api/User/GetAllUsers');
        return response.data;
    }catch{
        return [];
    }
};

export const getRoles = async () => {
  try{
    const response = await axios.get('api/User/GetRoles');
    return response.data;
  }
  catch{
    return [];
  }
}

export const logout = async () => {
  await axios.get('api/Auth/Logout');
};