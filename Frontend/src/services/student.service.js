import axios from "axios";

export const getCourses = async () => {
    const response = await axios.get('api/Student/GetCourses');
    return response.data;
};

export const getPracticalQuestions = async (practId) => {
    const response = await axios.get(`api/Student/GetPracticalQuestions?practId=${practId}`);
    return response.data;
}

export const getTestResult = async (answers, practicalId) => {
    const response = await axios.post('api/Student/UploadTest', {
        answers,
        practicalId
    });
    return response.data;
}

export const getTaskFile = async (taskId) => {
    const response = await axios.get(`api/Student/GetTaskFile?taskId=${taskId}`);
    return response.data;
}

export const uploadTaskFile = async (taskId, file) => {
    const data = new FormData()
    data.append('File', file)
    data.append('TaskId', taskId)
    const response = await axios.put('api/Student/UploadTaskFile', data);
    return response.data;
}

export const getTests = async (moduleId) => {
    const response = await axios.get(`api/Student/GetPracticals?moduleId=${moduleId}`);
    return response.data;
};