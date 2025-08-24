"use client";

import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function History() {
  const { user } = useAuth();

  const pointHistory = [
    { createdAt: "2024-09-15T10:20:00Z", type: "earned", points: 50 },
    { createdAt: "2024-09-18T14:30:00Z", type: "redeemed", points: 20 },
    { createdAt: "2024-10-02T08:45:00Z", type: "earned", points: 100 },
    { createdAt: "2024-10-10T09:00:00Z", type: "redeemed", points: 40 },
    { createdAt: "2024-11-05T16:10:00Z", type: "earned", points: 70 },
    { createdAt: "2024-11-22T12:00:00Z", type: "earned", points: 30 },
    { createdAt: "2024-12-01T18:20:00Z", type: "redeemed", points: 10 },
    { createdAt: "2025-01-07T07:50:00Z", type: "earned", points: 120 },
    { createdAt: "2025-01-15T19:00:00Z", type: "redeemed", points: 50 },
    { createdAt: "2025-02-03T13:15:00Z", type: "earned", points: 200 },
    { createdAt: "2025-02-12T11:00:00Z", type: "redeemed", points: 100 },
    { createdAt: "2025-03-09T09:40:00Z", type: "earned", points: 80 },
    { createdAt: "2025-03-20T15:25:00Z", type: "redeemed", points: 30 },
  ];

  // Process data for chart
  const processChartData = () => {
    if (!pointHistory) return [];

    // Group by month and sum points
    const monthlyData: Record<
      string,
      {
        month: string;
        earned: number;
        redeemed: number;
      }
    > = {};

    pointHistory.forEach((entry) => {
      const month = format(new Date(entry.createdAt), "MMM yyyy");
      if (!monthlyData[month]) {
        monthlyData[month] = { month, earned: 0, redeemed: 0 };
      }

      if (entry.type === "earned") {
        monthlyData[month].earned += entry.points;
      } else {
        monthlyData[month].redeemed += entry.points;
      }
    });

    return Object.values(monthlyData).slice(-12); // Last 12 months
  };

  const chartData = processChartData();

  return (
    <main
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      data-testid="history-main"
    >
      <h1
        className="text-2xl font-bold text-gray-800 mb-8"
        data-testid="text-page-title"
      >
        Point History
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6" data-testid="card-total-earned">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earned</p>
              <p
                className="text-3xl font-bold text-green-600"
                data-testid="text-total-earned"
              >
                {"0"}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                ></path>
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6" data-testid="card-total-used">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Used</p>
              <p
                className="text-3xl font-bold text-red-600"
                data-testid="text-total-used"
              >
                {"0"}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                ></path>
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6" data-testid="card-current-balance">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Current Balance
              </p>
              <p
                className="text-3xl font-bold text-airline-blue"
                data-testid="text-current-balance"
              >
                {user?.available_points?.toLocaleString() || "0"}
              </p>
            </div>
            <div className="w-12 h-12 bg-airline-light rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-airline-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2"
                ></path>
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-6 mb-8" data-testid="card-points-chart">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Points Activity
          </h2>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            data-testid="select-chart-period"
          >
            <option value="12">Last 12 months</option>
            <option value="6">Last 6 months</option>
            <option value="3">Last 3 months</option>
          </select>
        </div>

        {chartData.length > 0 ? (
          <div className="h-64" data-testid="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="earned"
                  fill="hsl(var(--chart-2))"
                  name="Points Earned"
                />
                <Bar
                  dataKey="redeemed"
                  fill="hsl(var(--destructive))"
                  name="Points Redeemed"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div
            className="h-64 bg-gray-50 rounded-lg flex items-center justify-center"
            data-testid="empty-state-chart"
          >
            <div className="text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
              <p className="text-gray-500">No point activity yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Start earning and redeeming points to see your activity chart
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      <Card className="overflow-hidden" data-testid="card-recent-activity">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Activity
          </h2>
        </div>

        {!pointHistory || pointHistory.length === 0 ? (
          <div className="p-8 text-center" data-testid="empty-state-activity">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No activity yet
            </h3>
            <p className="text-gray-500">
              Your point earning and redemption history will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pointHistory.slice(0, 10).map((entry) => (
              <div
                key={entry.createdAt}
                className="px-6 py-4 flex items-center justify-between"
                data-testid={`activity-item-${entry.createdAt}`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      entry.type === "earned" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        entry.type === "earned"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {entry.type === "earned" ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        ></path>
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20 12H4"
                        ></path>
                      )}
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {entry.points}
                    </p>
                    <p
                      className="text-xs text-gray-500"
                      data-testid={`text-date-${entry.createdAt}`}
                    >
                      {format(new Date(entry.createdAt), "MMM dd, yyyy HH:mm")}
                    </p>
                  </div>
                </div>
                <div
                  className={`text-sm font-semibold ${
                    entry.type === "earned" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {entry.type === "earned" ? "+" : "-"}
                  {entry.points.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </main>
  );
}
