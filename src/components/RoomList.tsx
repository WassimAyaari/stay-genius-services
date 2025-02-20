
import React from 'react';
import RoomCard from './RoomCard';

const RoomList = () => {
  const rooms = [
    {
      id: '1',
      name: 'Deluxe Ocean View',
      price: 299,
      capacity: 2,
      size: '45m²',
      image: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Premium Suite',
      price: 499,
      capacity: 4,
      size: '65m²',
      image: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Family Room',
      price: 399,
      capacity: 3,
      size: '55m²',
      image: '/placeholder.svg'
    }
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
      {rooms.map((room) => (
        <RoomCard key={room.id} {...room} />
      ))}
    </div>
  );
};

export default RoomList;
