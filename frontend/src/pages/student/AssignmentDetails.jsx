import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";

const AssignmentDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      const { data } = await axios.get(
        (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api/assignments/student",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const selected = data.assignments.find((a) => a._id === id);
      setAssignment(selected);
    };

    fetchAssignments();
  }, [id]);

  return (
    <DashboardLayout>
      {assignment && (
        <>
          <h2>{assignment.title}</h2>
          <p>{assignment.description}</p>
          <p>Due Date: {assignment.dueDate?.slice(0, 10)}</p>
        </>
      )}
    </DashboardLayout>
  );
};

export default AssignmentDetails;