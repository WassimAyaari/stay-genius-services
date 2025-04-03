
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookingDetailsHeaderProps {
  onBack?: () => void;
}

const BookingDetailsHeader: React.FC<BookingDetailsHeaderProps> = ({ onBack }) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };
  
  return (
    <Button variant="outline" onClick={handleBack} className="mb-6">
      <ArrowLeft className="mr-2 h-4 w-4" />
      Retour
    </Button>
  );
};

export default BookingDetailsHeader;
