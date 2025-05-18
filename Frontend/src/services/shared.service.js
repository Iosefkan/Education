import axios from "axios";

export const getModules = async (courseId) => {
    const response = await axios.get(`api/Shared/GetModules?courseId=${courseId}`);
    return response.data;
};

export const getTheoryText = async (theoryId, textOnly = true) => {
    const response = await axios.get(`api/Shared/GetTheoryText?theoryId=${theoryId}`);
    if (textOnly) return response.data.text
    return response.data;
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