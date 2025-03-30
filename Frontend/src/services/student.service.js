import axios from "axios";


export const getCourses = async () => {
    const response = await axios.get('api/Student/GetCourses');
    return response.data;
};

export const getModules = async (courseId) => {
    const response = await axios.get(`api/Student/GetModules?courseId=${courseId}`);
    return response.data;
};

export const getTests = async (moduleId) => {
    const response = await axios.get(`api/Student/GetPracticals?moduleId=${moduleId}`);
    return response.data;
};

export const getPracticalQuestions = async (practId) => {
    const response = await axios.get(`api/Student/GetPracticalQuestions?practId=${practId}`);
    return response.data;
}

export const getTestResult = async (answers) => {
    const response = await axios.post('api/Student/TestResult', {
        answers
    });
    return response.data;
}