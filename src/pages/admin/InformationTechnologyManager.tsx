
import React, { useState } from "react";
import InformationTechnologyRequestsTab from "./information-technology/InformationTechnologyRequestsTab";
import { updateRequestStatus } from "@/features/rooms/controllers/roomService";
import { useToast } from "@/hooks/use-toast";

const InformationTechnologyManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Handler for status update
  const handleUpdateRequestStatus = async (
    requestId: string,
    status: "pending" | "in_progress" | "completed" | "cancelled"
  ) => {
    try {
      await updateRequestStatus(requestId, status);
      toast({
        title: "Status Updated",
        description: `Request has been ${status.replace("_", " ")}.`,
      });
    } catch (error) {
      console.error("Error updating request status:", error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <InformationTechnologyRequestsTab
        requestsSearchTerm={searchTerm}
        setRequestsSearchTerm={setSearchTerm}
        handleUpdateRequestStatus={handleUpdateRequestStatus}
      />
    </div>
  );
};

export default InformationTechnologyManager;
