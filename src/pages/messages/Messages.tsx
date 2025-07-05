
import React from 'react';
import { Bell } from 'lucide-react';
import { useMessaging } from '@/hooks/useMessaging';
import { ContactList } from '@/components/messaging/ContactList';
import { ChatView } from '@/components/messaging/ChatView';
import { ContactListHeader } from '@/components/messaging/ContactListHeader';

const Messages = () => {
  const {
    selectedContact,
    inputMessage,
    setInputMessage,
    searchTerm,
    setSearchTerm,
    filteredContacts,
    isLoading,
    messagesEndRef,
    inputRef,
    handleSendMessage,
    handleGoBack,
    setSelectedContact
  } = useMessaging();
  
  // Add icons to contacts here to avoid circular dependencies
  const contactsWithIcons = filteredContacts.map(contact => ({
    ...contact,
    icon: contact.id === '2' ? <Bell className="h-6 w-6 text-primary" /> : null
  }));

  if (selectedContact) {
    const contactWithIcon = {
      ...selectedContact,
      icon: selectedContact.id === '2' ? <Bell className="h-6 w-6 text-primary" /> : null
    };
    
    return (
      <ChatView
        contact={contactWithIcon}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        onSendMessage={handleSendMessage}
        onGoBack={handleGoBack}
        messagesEndRef={messagesEndRef}
        inputRef={inputRef}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col h-screen w-screen">
      <ContactListHeader onGoBack={handleGoBack} />
      <ContactList 
        contacts={contactsWithIcons}
        isLoading={isLoading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSelectContact={setSelectedContact}
      />
    </div>
  );
};

export default Messages;
