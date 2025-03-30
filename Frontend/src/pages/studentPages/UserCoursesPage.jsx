import Layout from "../../components/Layout";
import CourseCard from "../../components/CourseCard";
import { useState, useEffect } from "react";
import { getCourses } from "../../services/student.service";

const UserCoursesPage = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        async function initCourses(){
            const recCourses = await getCourses();
            setCourses(recCourses)
        }
        initCourses();
    }, [])

    return (
    <Layout>
      <h3 className="mb-3">Доступные курсы:</h3>
      {courses.length === 0 && (
            <div>Нет курсов</div>
        )}
      <div className="d-flex flex-wrap flex-row gap-4">
        {courses.map((course) => (
            <CourseCard
            key={course.id}
            id={course.id}
            title={course.name}
            description={course.description}
            canDelete={false}
            isStudent={true}
            dueDate={new Date(course.date)}
            />
        ))}
      </div>
    </Layout>
    );
}

export default UserCoursesPage;