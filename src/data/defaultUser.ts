
export const defaultUser = {
  firstName: 'Emma',
  lastName: 'Watson',
  email: 'emma.watson@example.com',
  role: 'Premium Guest',
  avatarUrl: '/lovable-uploads/3e0218f0-54af-48c0-b1d7-a88041767aa2.png',
  roomNumber: '401',
  companions: [
    {
      id: '1',
      first_name: 'John',
      last_name: 'Watson',
      relation: 'Spouse',
    },
    {
      id: '2',
      first_name: 'Lily',
      last_name: 'Watson',
      relation: 'Child',
    }
  ],
  notifications: [
    { id: 1, message: "Your room has been cleaned", time: "2 minutes ago" },
    { id: 2, message: "Spa appointment confirmed", time: "1 hour ago" },
  ]
};
