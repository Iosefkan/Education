import axios from "axios";

export const getModules = async (courseId) => {
    const response = await axios.get(`api/Shared/GetModules?courseId=${courseId}`);
    return response.data;
};

export const getTasks = async (practicalId) => {
    const response = await axios.get(`api/Shared/GetTasks?practicalId=${practicalId}`);
    return response.data;
}

export const getTheories = async (moduleId) => {
    const response = await axios.get(`api/Shared/GetTheories?moduleId=${moduleId}`);
    return response.data;
};

export const getTheoryText = async (theoryId) => {
    const response = await axios.get(`api/Shared/GetTheoryText?theoryId=${theoryId}`);
    return response.data.text
}

export const getTaskText = async (taskId) => {
    const response = await axios.get(`api/Shared/GetTaskText?taskId=${taskId}`)
    return response.data.text;
}

export const getTheoryLinks = async (theoryId) => {
    const response = await axios.get(`api/Shared/GetTheoryLinks?theoryId=${theoryId}`);
    return response.data;
};

export const getTheoryDocs = async (theoryId) => {
    const response = await axios.get(`api/Shared/GetTheoryDocs?theoryId=${theoryId}`);
    return response.data;
};

export const getTests = async (moduleId) => {
    const response = await axios.get(`api/Shared/GetPracticals?moduleId=${moduleId}`);
    return response.data;
};