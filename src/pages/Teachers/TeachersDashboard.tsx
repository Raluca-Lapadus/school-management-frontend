import PageLayout from "../../layouts/PageLayout";
import Attendance from "./Attendance";
import TeacherD from "./Teachers";

const TeachersDashboard: React.FC = () => {
  return (
    <PageLayout>
      <TeacherD />
      <Attendance />
    </PageLayout>
  );
};

export default TeachersDashboard;
