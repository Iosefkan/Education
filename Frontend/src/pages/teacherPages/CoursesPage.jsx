import Layout from "../../components/Layout";
import CourseCard from "../../components/cards/CourseCard";
import CreateCourseModal from "../../components/sidebars/CreateCourseModal";
import { useState, useEffect } from "react";
import { deleteCourse, getCourses, createCourse } from "../../services/teacher.service";
import { Button } from "react-bootstrap";

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function initCourses(){
            const recCourses = await getCourses();
            setCourses(recCourses)
        }
        initCourses();
    }, [])

    const handleCreate = async (courseData) => {
        const newCourse = await createCourse(courseData.date, courseData.description, courseData.name);
        setCourses([...courses, newCourse])
    }

    const handleDelete = async (course) => {
        await deleteCourse(course.id);
        setCourses(courses.filter(c => c.id !== course.id))
    }

    return (
    <Layout>
      <Button className="mb-5" onClick={() => setShowModal(true)}>
        Добавить курс
      </Button>

      <CreateCourseModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onCreate={(courseData) => handleCreate(courseData)}
      />

      <h3 className="mb-3">Созданные курсы:</h3>
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
            canDelete={true}
            dueDate={new Date(course.date)}
            onDelete={() => handleDelete(course)}
            />
        ))}
      </div>
    </Layout>
    );
}

export default CoursesPage;