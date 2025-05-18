const course = 'course';
const module = 'module';
const pract = 'pract';

export const setCourseCrumbs = (state) => {
  return localStorage.setItem(course, JSON.stringify(state));
}

export const getCourseCrumbs = () => {
    return JSON.parse(localStorage.getItem(course));
}

export const setModuleCrumbs = (state) => {
  return localStorage.setItem(module, JSON.stringify(state));
}

export const getModuleCrumbs = () => {
    return JSON.parse(localStorage.getItem(module));
}

export const setPractCrumbs = (state) => {
  return localStorage.setItem(pract, JSON.stringify(state));
}

export const getPractCrumbs = () => {
    return JSON.parse(localStorage.getItem(pract));
}