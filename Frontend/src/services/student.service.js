import axios from "axios";

export const getCourses = async () => {
    const response = await axios.get('api/Student/GetCourses');
    return response.data;
};

export const getPracticalQuestions = async (practId) => {
    const response = await axios.get(`api/Student/GetPracticalQuestions?practId=${practId}`);
    return response.data;
}

export const getTestResult = async (answers) => {
    const response = await axios.post('api/Student/UploadTest', {
        answers
    });
    return response.data;
}

export const getTaskFile = async (taskId) => {
    const response = await axios.get(`api/Student/GetTaskFile?taskId=${taskId}`);
    return response.data;
}

export const createTaskFile = async (taskId, file) => {
    const data = new FormData()
    data.append('File', file)
    data.append('TaskId', taskId)
    const response = await axios.post('api/Student/CreateTaskFile', data);
    return response.data;
}

export const deleteTaskFile = async (taskId) => {
    await axios.delete(`api/Student/DeleteTaskFile?taskId=${taskId}`);
    return true;
}