
// Function to handle push notifications for request updates
export const notifyRequestStatusChange = (request: any) => {
  const statusMessages = {
    pending: 'Your request is pending review',
    in_progress: 'Your request is now being processed',
    completed: 'Your request has been completed',
    cancelled: 'Your request has been cancelled'
  };
  
  if (statusMessages[request.status]) {
    // Use the browser notification API if permissions granted
    if (Notification.permission === 'granted') {
      new Notification('Request Update', {
        body: statusMessages[request.status],
        icon: '/favicon.ico'
      });
    }
    
    // Also show a toast notification
    import('sonner').then(({ toast }) => {
      toast.info('Request Status Update', {
        description: statusMessages[request.status]
      });
    });
  }
};
