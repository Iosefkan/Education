import axios from "axios";

export const getCourses = async () => {
  const response = await axios.get('api/Teacher/GetCourses');
  return response.data;
};

export const createCourse = async (date, description, name) => {
    const response = await axios.post('api/Teacher/CreateCourse', {
        date,
        name,
        description
    });
    return response.data;
}

export const deleteCourse = async (courseId) => {
    await axios.delete(`api/Teacher/DeleteCourse?courseId=${courseId}`);
    return true;
}

export const getModules = async (courseId) => {
    const response = await axios.get(`api/Teacher/GetModules?courseId=${courseId}`);
    return response.data;
};

export const createModule = async (courseId, name) => {
    const response = await axios.post('api/Teacher/CreateModule', {
    courseId,
    name
    });
    return response.data;
}

export const deleteModule = async (moduleId) => {
    await axios.delete(`api/Teacher/DeleteModule?moduleId=${moduleId}`);
    return true;
}

export const getUsers = async (courseId) => {
    try{
        const result = await axios.get(`api/Teacher/GetStudents?courseId=${courseId}`);
        return result.data;
    }
    catch{
        return [];
    }
}

export const saveUsers = async (courseId, selectedUsers) => {
    try {
        await axios.put('api/Teacher/UpdateCourseStudents', {
            courseId,
            userIds: selectedUsers
        });
        return true;
    }
    catch{
        return false;
    }
}



export const getTests = async (moduleId) => {
    const response = await axios.get(`api/Teacher/GetPracticals?moduleId=${moduleId}`);
    return response.data;
};

export const createTest = async (moduleId, name) => {
    const response = await axios.post('api/Teacher/CreatePractical', {
        moduleId,
        name
    });
    return response.data;
}

export const deleteTest = async (testId) => {
    await axios.delete(`api/Teacher/DeletePractical?practicalId=${testId}`);
    return true;
}



export const getQuestions = async (moduleId) => {
    const response = await axios.get(`api/Teacher/GetQuestions?moduleId=${moduleId}`);
    return response.data;
};

export const createQuestion = async (moduleId, type, body, answer, weight, text) => {
    const response = await axios.post('api/Teacher/CreateQuestion', {
        moduleId,
        type,
        body,
        answer,
        weight,
        text
    });
    return response.data;
}

export const getPractAllQuestion = async (moduleId, practId) => {
    console.log(moduleId);
    console.log(practId);
    const response = await axios.get(`api/Teacher/GetMakePracticalQuestions?moduleId=${moduleId}&practId=${practId}`);
    return response.data;
}

export const updatePractQuestions = async (practicalId, questionIds) => {
    try {
        await axios.put('api/Teacher/UpdatePracticalMaterialQuestions', {
            practicalId,
            questionIds
        });
        return true;
    }
    catch{
        return false;
    }
}
