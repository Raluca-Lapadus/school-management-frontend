import { useState } from "react";
import PageLayout from "../../layouts/PageLayout";
import Grades from "./Grades";
import Students from "./Students";

const StudentsDashboard: React.FC = () => {
  const [studentId, setStudentId] = useState<number | null>(null);

  const getStudentIdForGrade = (id: number) =>{
    setStudentId(id);
  }
  return (
    <PageLayout>
      <Students getStudentIdForGrade={getStudentIdForGrade} />
      <Grades studentId={studentId} />
    </PageLayout>
  );
  };
export default StudentsDashboard;