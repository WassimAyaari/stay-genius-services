
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Contact } from '@/types/messaging';

interface UseMessagingNavigationProps {
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;
  contactsData: Contact[];
}

export const useMessagingNavigation = ({ 
  selectedContact, 
  setSelectedContact, 
  contactsData 
}: UseMessagingNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location.state?.from || '/';

  // Initialize with contact from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const contactId = params.get('contact');
    
    if (contactId) {
      const contact = contactsData.find(c => c.id === contactId);
      if (contact) {
        setSelectedContact(contact);
      }
    }
  }, [location, contactsData, setSelectedContact]);

  // Update URL when selected contact changes
  useEffect(() => {
    if (selectedContact) {
      navigate(`/messages?contact=${selectedContact.id}`, { 
        replace: true,
        state: { from: location.state?.from || '/' }
      });
    } else {
      navigate('/messages', { replace: true });
    }
  }, [selectedContact, navigate, location.state?.from]);

  const handleGoBack = () => {
    if (selectedContact) {
      setSelectedContact(null);
      navigate('/messages', { 
        replace: true,
        state: { from: fromLocation } 
      });
    } else {
      navigate(fromLocation || '/', { replace: true });
    }
  };

  return { handleGoBack, fromLocation };
};
