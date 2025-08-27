"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Plane,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { ofetch } from "ofetch";
import { getAccessToken } from "@/helpers/access-token";
import { Request, User } from "@/lib/generated/prisma";
import { AdminAllRequests } from "../api/admin/request/route";

export default function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for filters and pagination
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 20,
    status: "",
    memberName: "",
    dateFrom: "",
    dateTo: "",
    sort: "submittedAt",
    order: "desc",
  });

  // State for action dialogs
  const [selectedRequest, setSelectedRequest] =
    useState<AdminAllRequests[number]>();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch requests list
  const {
    data: requests,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["/api/admin/request"],
    queryFn: async () => {
      return await ofetch<AdminAllRequests>("/api/admin/request");
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

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (data: { id: string; pointsAwarded?: number }) =>
      apiRequest("POST", `/api/admin/request/${data.id}/approve`),
    onSuccess: () => {
      toast({ title: "Request approved successfully" });
      setShowApproveDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/request"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to approve request",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: (data: { id: string }) =>
      apiRequest("POST", `/api/admin/request/${data.id}/reject`),
    onSuccess: () => {
      toast({ title: "Request rejected successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/request"] });
      setShowRejectDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to reject request",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const handleApprove = (request: AdminAllRequests[number]) => {
    setSelectedRequest(request);
    setShowApproveDialog(true);
  };

  const handleReject = (request: AdminAllRequests[number]) => {
    setSelectedRequest(request);
    setShowRejectDialog(true);
  };

  const confirmApprove = () => {
    if (selectedRequest) {
      approveMutation.mutate({
        id: selectedRequest.id,
      });
    }
  };

  const confirmReject = () => {
    if (selectedRequest && rejectionReason.trim().length >= 5) {
      rejectMutation.mutate({
        id: selectedRequest.id,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      pageSize: 20,
      status: "",
      memberName: "",
      dateFrom: "",
      dateTo: "",
      sort: "submittedAt",
      order: "desc",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6" data-testid="admin-page">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reviewing Requests
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusCounts?.reviewing || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approved Requests
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusCounts?.approved || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rejected Requests
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusCounts?.rejected || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="member-name">Member Name</Label>
              <Input
                id="member-name"
                placeholder="Search by name..."
                value={filters.memberName}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    memberName: e.target.value,
                    page: 1,
                  })
                }
                data-testid="input-member-name"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value, page: 1 })
                }
              >
                <SelectTrigger data-testid="select-status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date-from">From Date</Label>
              <Input
                id="date-from"
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value, page: 1 })
                }
                data-testid="input-date-from"
              />
            </div>

            <div>
              <Label htmlFor="date-to">To Date</Label>
              <Input
                id="date-to"
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value, page: 1 })
                }
                data-testid="input-date-to"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Point Requests{" "}
            <Button
              onClick={() => {
                refetch();
              }}
            >
              Reload
            </Button>
          </CardTitle>
          <CardDescription>
            {requests?.length || 0} total requests found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading requests...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Flight</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Base Points</TableHead>
                  <TableHead>Bonus Points</TableHead>
                  <TableHead>Approved By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests?.map((request) => (
                  <TableRow
                    key={request.id}
                    data-testid={`row-request-${request.id}`}
                  >
                    <TableCell className="font-mono text-sm">
                      {request.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {request.requestor.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Plane className="w-4 h-4" />
                        <span>{request.flightCode}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.from} → {request.to}
                      </div>
                    </TableCell>

                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {request.status !== "approved"
                        ? "-"
                        : request.baseMiles ?? "-"}
                    </TableCell>
                    <TableCell>
                      {request.status !== "approved"
                        ? "-"
                        : request.bonusMiles ?? "-"}
                    </TableCell>
                    <TableCell>
                      {request.status === "reviewing" ? "-" : "Admin"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {request.status === "reviewing" && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleApprove(request)}
                              data-testid={`button-approve-${request.id}`}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleReject(request)}
                              data-testid={`button-reject-${request.id}`}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent data-testid="dialog-approve">
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              Approve the point request for {selectedRequest?.requestor.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Flight Information */}
            {selectedRequest && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Flight Information</h4>
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Flight:</strong> {selectedRequest.flightCode}
                  </p>
                  <p>
                    <strong>Route:</strong> {selectedRequest.from} →{" "}
                    {selectedRequest.to}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmApprove}
              disabled={approveMutation.isPending}
              data-testid="button-confirm-approve"
            >
              {approveMutation.isPending ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent data-testid="dialog-reject">
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {selectedRequest?.requestor.name}
              &apos;s request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="rejection-reason" className="text-sm">
              Rejection Reason
            </Label>
            <br />
            <Textarea
              id="rejection-reason"
              placeholder="Please provide a detailed reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
              data-testid="textarea-rejection-reason"
            />
            {rejectionReason.length < 5 && rejectionReason.length > 0 && (
              <p className="text-sm text-red-500">
                Reason must be at least 5 characters long
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={
                rejectMutation.isPending || rejectionReason.trim().length < 5
              }
              data-testid="button-confirm-reject"
            >
              {rejectMutation.isPending ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl" data-testid="dialog-detail">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Request Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>ID:</strong> {selectedRequest.id}
                    </div>
                    <div>
                      <strong>Status:</strong>{" "}
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                    <div>
                      <strong>Submitted:</strong>{" "}
                      {format(new Date(selectedRequest.createdAt), "PPP")}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Member Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Name:</strong> {selectedRequest.requestor.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedRequest.requestor.email}
                    </div>

                    {selectedRequest.requestorId && (
                      <div>
                        <strong>Member ID:</strong>{" "}
                        {selectedRequest.requestorId}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Flight Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Flight Number:</strong> {selectedRequest.flightCode}
                  </div>

                  <div>
                    <strong>Route:</strong> {selectedRequest.from} →{" "}
                    {selectedRequest.to}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDetailDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
