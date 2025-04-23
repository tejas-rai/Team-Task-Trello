import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  updateTaskStatus,
} from "../features/tasks/tasksSlice";
import { Link, useNavigate } from "react-router-dom";

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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        {user.role === "admin" && (
          <button
            onClick={() => navigate("/tasks/create")}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            New Task
          </button>
        )}
      </div>

      {status === "loading" && <p>Loading tasks…</p>}
      {status === "failed" && <p className="text-red-600">{error}</p>}

      {tasks.map((t) => (
        <div
          key={t._id}
          className="mb-4 p-4 border rounded-lg shadow-sm flex flex-col md:flex-row md:justify-between"
        >
          <div>
            <h2 className="text-lg font-medium">{t.title}</h2>
            <p className="text-sm text-gray-600">{t.description}</p>
            <p className="text-sm">
              <span className="font-semibold">Due:</span>{" "}
              {new Date(t.dueDate).toLocaleDateString()}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Priority:</span> {t.priority}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Team:</span> {t.team.name}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Assigned to:</span>{" "}
              {t.assignedTo.name}
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <select
              value={t.status}
              disabled={updatingId === t._id}
              onChange={(e) => handleStatusChange(t._id, e.target.value)}
              className="border rounded px-2 py-1"
            >
              {["To Do", "In Progress", "Done"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {updatingId === t._id && <span>Updating…</span>}
            <Link
              to={`/comments?taskId=${t._id}`}
              className="text-blue-600 hover:underline text-sm"
            >
              View Comments
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
