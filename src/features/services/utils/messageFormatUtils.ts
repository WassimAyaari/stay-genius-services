
// Add a function to transform a service request into a chat message format
export const serviceRequestToMessage = (request: any): any => {
  return {
    id: request.id,
    text: request.description || 'No description provided',
    time: new Date(request.created_at).toLocaleString(),
    sender: 'user',
    status: 'sent',
    type: 'request',
    requestType: request.type,
    requestStatus: request.status
  };
};
