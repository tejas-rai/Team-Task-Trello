import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../features/tasks/tasksSlice";
import { fetchTeams } from "../features/teams/teamsSlice";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { tasks, status: tStatus, error: tError } = useSelector((s) => s.tasks);
  const { teams, status: tmStatus, error: tmError } = useSelector((s) => s.teams);

  useEffect(() => {
    if (tmStatus === "idle") dispatch(fetchTeams());
    if (tStatus === "idle") dispatch(fetchTasks());
  }, [dispatch, tmStatus, tStatus]);

  // Compute total tasks per team
  const tasksPerTeam = teams.map((team) => ({
    name: team.name,
    count: tasks.filter((t) => t.team._id === team._id).length,
  }));

  // Compute status summary
  const statuses = ["To Do", "In Progress", "Done"];
  const statusCounts = statuses.map(
    (s) => tasks.filter((t) => t.status === s).length
  );

  const pieData = {
    labels: statuses,
    datasets: [
      {
        data: statusCounts,
      },
    ],
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      {/* Error / loading */}
      {(tmStatus === "loading" || tStatus === "loading") && <p>Loading overview…</p>}
      {(tmStatus === "failed" || tStatus === "failed") && (
        <p className="text-red-600">
          {tmError || tError || "Error loading data"}
        </p>
      )}

      {/* Total tasks per team */}
      <div className="mb-8">
        <h2 className="text-2xl font-medium mb-4">Tasks Per Team</h2>
        <ul className="list-disc ml-6">
          {tasksPerTeam.map((t) => (
            <li key={t.name}>
              {t.name}: {t.count}
            </li>
          ))}
        </ul>
      </div>

      {/* Status pie chart */}
      <div>
        <h2 className="text-2xl font-medium mb-4">Status Summary</h2>
        <div className="max-w-sm mx-auto">
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
}
