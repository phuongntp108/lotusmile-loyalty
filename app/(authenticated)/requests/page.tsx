"use client";

import RequestModal from "@/components/request-modal";
import { Card } from "@/components/ui/card";
import { FlightRoute } from "@/data/flight-data";
import { getAccessToken } from "@/helpers/access-token";
import { useAuth } from "@/hooks/useAuth";
import { Request } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { get } from "http";
import { DollarSign, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ofetch } from "ofetch";
import { useMemo, useState } from "react";

export default function Requests() {
  const { isLoading, user } = useAuth();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const { push } = useRouter();

  const { data: requests } = useQuery({
    queryKey: ["/api/request"],
    queryFn: async () => {
      return await ofetch<Request[]>("/api/request", {
        headers: { Authorization: `Bearer ${getAccessToken() ?? ""} ` },
      });
    },
  });

  const statusCounts = useMemo(() => {
    if (!requests) return { approved: 0, reviewing: 0, rejected: 0 };

    return requests.reduce(
      (acc, request) => {
        acc[request.status] = (acc[request.status] || 0) + 1;
        return acc;
      },
      { approved: 0, reviewing: 0, rejected: 0 }
    );
  }, [requests]);

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </main>
    );
  }

  const progressToNextTier =
    Number(
      user?.tier_details?.point_account_balances.summary.life_time_points
    ) /
    (Number(
      user?.tier_details?.point_account_balances.summary.life_time_points
    ) +
      Number(user?.next_tier_points));

  const pointsToNextTier = user?.next_tier_points;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-800 bg-green-100";
      case "pending":
        return "text-yellow-800 bg-yellow-100";
      case "rejected":
        return "text-red-800 bg-red-100";
      default:
        return "text-gray-800 bg-gray-100";
    }
  };

  const getFlightTypeColor = (type: FlightRoute["type"]) => {
    switch (type) {
      case "Economy":
        return "text-yellow-800 bg-yellow-100";
      case "Business":
        return "text-red-800 bg-red-100";
      default:
        return "text-gray-800 bg-gray-100";
    }
  };

  return (
    <main
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      data-testid="requests-main"
    >
      <h1
        className="text-2xl font-bold text-gray-800 mb-8"
        data-testid="text-page-title"
      >
        My Point Requests
      </h1>

      {/* Hero Section */}
      <div className="relative mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1437846972679-9e6e537be46e?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Premium airline cabin interior"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-airline-blue/80 to-airline-gold/60"></div>
        <div className="absolute inset-0 flex items-center p-8">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-2" data-testid="text-welcome">
              Welcome back, <span>{user?.first_name || "Traveler"}</span>!
            </h2>
            <div className="flex items-center space-x-6 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-sm opacity-90">Current Points</p>
                <p
                  className="text-2xl font-bold"
                  data-testid="text-current-points"
                >
                  {user?.tier_details?.point_account_balances.summary.total_points?.toLocaleString() ||
                    "0"}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-sm opacity-90">Membership</p>
                <p
                  className="text-lg font-semibold text-airline-gold"
                  data-testid="text-membership-tier"
                >
                  {user?.tier || "Silver"} Member
                </p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="mr-2">Next tier:</span>
              <div className="bg-white/30 rounded-full h-2 w-32 mr-3">
                <div
                  className="bg-airline-gold h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressToNextTier * 100}%` }}
                ></div>
              </div>
              <span data-testid="text-points-to-next-tier">
                {pointsToNextTier?.toLocaleString()} points to next tier
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setShowRequestModal(true)}
          data-testid="card-create-request"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Create Request
              </h3>
              <p className="text-gray-600">Submit new point request</p>
            </div>
            <div className="w-12 h-12 bg-airline-blue rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          data-testid="card-redeem-points"
          onClick={() => {
            push("/redeem");
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Redeem Points
              </h3>
              <p className="text-gray-600">Browse rewards catalog</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6" data-testid="card-stats-approved">
          <div className="flex items-center">
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
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p
                className="text-2xl font-bold text-green-600"
                data-testid="text-stats-approved"
              >
                {statusCounts.approved}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6" data-testid="card-stats-pending">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-600"
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
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p
                className="text-2xl font-bold text-yellow-600"
                data-testid="text-stats-pending"
              >
                {statusCounts.reviewing}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6" data-testid="card-stats-rejected">
          <div className="flex items-center">
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
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p
                className="text-2xl font-bold text-red-600"
                data-testid="text-stats-rejected"
              >
                {statusCounts.rejected}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Requests Table */}
      <Card className="overflow-hidden" data-testid="card-requests-table">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Request History
          </h2>
        </div>

        {!requests || requests.length === 0 ? (
          <div className="p-8 text-center" data-testid="empty-state-requests">
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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No requests yet
            </h3>
            <p className="text-gray-500">
              You haven&apos;t submitted any point requests. Create your first
              request to start earning points!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flight Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50"
                    data-testid={`row-request-${request.id}`}
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      data-testid={`text-date-${request.id}`}
                    >
                      {format(new Date(request.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      data-testid={`text-flight-${request.id}`}
                    >
                      {request.flightCode}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      data-testid={`text-route-${request.id}`}
                    >
                      {request.from} → {request.to}
                    </td>
                    <td
                      className={cn(
                        "px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      )}
                      data-testid={`text-route-${request.id}`}
                    >
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getFlightTypeColor(
                          request.type as FlightRoute["type"]
                        )}`}
                      >
                        {request.type}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      data-testid={`status-${request.id}`}
                    >
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <RequestModal
        open={showRequestModal}
        onOpenChange={setShowRequestModal}
      />
    </main>
  );
}
