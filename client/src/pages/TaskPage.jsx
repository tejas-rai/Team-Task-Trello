// client/src/pages/TaskPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, updateTaskStatus } from "../features/tasks/tasksSlice";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { Select } from "../components/FormControls";

export default function TaskPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, status, error } = useSelector((s) => s.tasks);
  const { user } = useSelector((s) => s.auth);

  // load tasks once
  useEffect(() => {
    if (status === "idle") dispatch(fetchTasks());
  }, [status, dispatch]);

  // local tracking of status updates to disable controls while pending
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingId(taskId);
    await dispatch(updateTaskStatus({ taskId, status: newStatus }));
    setUpdatingId(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Tasks</h1>
        {user.role === "admin" && (
          <Button onClick={() => navigate("/tasks/create")}>
            New Task
          </Button>
        )}
      </div>

      {status === "loading" && <p>Loading tasks…</p>}
      {status === "failed" && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card key={task._id} className="flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="mt-2 text-gray-600">{task.description}</p>
              <div className="mt-4 space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Due:</span>{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Priority:</span>{" "}
                  {task.priority}
                </p>
                <p>
                  <span className="font-medium">Team:</span> {task.team.name}
                </p>
                <p>
                  <span className="font-medium">Assigned to:</span>{" "}
                  {task.assignedTo.name}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Select
                value={task.status}
                disabled={updatingId === task._id}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
              >
                {["To Do", "In Progress", "Done"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
              <Link
                to={`/comments?taskId=${task._id}`}
                className="text-primary hover:text-secondary text-sm font-medium"
              >
                View Comments
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
