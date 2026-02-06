import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Filter, RefreshCw, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import NotificationCard from "./components/NotificationCard";
import { useUnifiedCancellation } from "./hooks/useUnifiedCancellation";

const Requests = () => {
  const navigate = useNavigate();
  const { notifications, refetchServices, refetchReservations, refetchSpaBookings, refetchEventReservations } =
    useNotifications();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { isUpdating, isCancelDialogOpen, canCancelNotification, openCancelDialog, closeCancelDialog, handleCancel } =
    useUnifiedCancellation(refetchServices, refetchSpaBookings, refetchReservations, refetchEventReservations);

  const handleRefreshAll = () => {
    refetchServices();
    refetchReservations();
    refetchSpaBookings();
    refetchEventReservations();
  };

  // Filter notifications based on search term, status, and type
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || notification.status === statusFilter;
    const matchesType = typeFilter === "all" || notification.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">My Notifications</h1>
          <Button variant="outline" onClick={handleRefreshAll}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="request">Service Requests</SelectItem>
              <SelectItem value="spa_booking">Spa Bookings</SelectItem>
              <SelectItem value="reservation">Dining</SelectItem>
              <SelectItem value="event_reservation">Events</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredNotifications.length} of {notifications.length} requests
          </p>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={`${notification.type}-${notification.id}`}
                notification={notification}
                onCancel={openCancelDialog}
                canCancel={canCancelNotification(notification)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  {notifications.length === 0 ? "No requests yet" : "No matching requests"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {notifications.length === 0
                    ? "You haven't made any service requests yet."
                    : "Try adjusting your search or filter criteria."}
                </p>
                {notifications.length === 0 && <Button onClick={() => navigate("/my-room")}>Go to My Room</Button>}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={closeCancelDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={closeCancelDialog}>
              Keep Request
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={isUpdating}>
              {isUpdating ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Requests;
