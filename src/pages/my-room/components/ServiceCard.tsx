import React from 'react';
import { Card } from '@/components/ui/card';
import { ServiceType } from '@/features/rooms/types';
interface ServiceCardProps {
  icon: React.ReactNode;
  label: string;
  type: ServiceType;
  description: string;
  onRequest: (type: ServiceType) => void;
}
const ServiceCard = ({
  icon,
  label,
  type,
  description,
  onRequest
}: ServiceCardProps) => {
  const handleClick = () => {
    onRequest(type);
  };
  return;
};
export default ServiceCard;