import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../features/tasks/tasksSlice";

export default function MemberDashboard() {
  const dispatch = useDispatch();
  const { tasks, status, error } = useSelector((s) => s.tasks);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const statuses = ["To Do", "In Progress", "Done"];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">My Dashboard</h1>

      {status === "loading" && <p>Loading your tasks…</p>}
      {status === "failed" && <p className="text-red-600">{error}</p>}

      {statuses.map((s) => {
        const filtered = tasks.filter((t) => t.status === s);
        return (
          <div key={s} className="mb-6">
            <h2 className="text-2xl font-medium mb-2">{s}</h2>
            {filtered.length === 0 ? (
              <p className="text-gray-600">No tasks here.</p>
            ) : (
              <ul className="space-y-2">
                {filtered.map((t) => (
                  <li
                    key={t._id}
                    className="p-4 border rounded hover:shadow cursor-pointer"
                  >
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-sm text-gray-600">
                      Due {new Date(t.dueDate).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
