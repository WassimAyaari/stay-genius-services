
export type ServiceType = 'room_service' | 'housekeeping' | 'maintenance' | 'laundry' | 'concierge' | 'wifi' | 'bill' | 'preferences' | 'custom';

export const requestService = async (roomId: string, type: ServiceType, description?: string) => {
  // Mock implementation without authentication
  return {
    id: Date.now().toString(),
    room_id: roomId,
    guest_id: 'mock-user-id',
    type,
    description,
    status: 'pending',
    created_at: new Date().toISOString()
  };
};
