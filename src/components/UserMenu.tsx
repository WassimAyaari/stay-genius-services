
import React, { useState } from 'react';
import { User, Settings, LogOut, BedDouble, Bell, Heart, BookMarked, Upload, X, Edit, Users, Key } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
  username?: string;
  roomNumber?: string;
}

const UserMenu = ({ username = "Emma Watson", roomNumber }: UserMenuProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(username);
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: "John Watson", relation: "Spouse" },
    { id: 2, name: "Lily Watson", relation: "Child" },
  ]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your room has been cleaned", time: "2 minutes ago" },
    { id: 2, message: "Spa appointment confirmed", time: "1 hour ago" },
  ]);
  const { toast } = useToast();
  
  // New states for dialogs
  const [addFamilyOpen, setAddFamilyOpen] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newFamilyRelation, setNewFamilyRelation] = useState('');
  const [editingMember, setEditingMember] = useState<null | { id: number, name: string, relation: string }>(null);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would typically upload to your backend
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated.",
      });
    }
  };

  const handleNameUpdate = () => {
    if (newName.trim()) {
      // Here you would typically update in your backend
      toast({
        title: "Profile updated",
        description: "Your name has been successfully updated.",
      });
      setIsEditing(false);
    }
  };
  
  const handleAddFamilyMember = () => {
    if (newFamilyName.trim() && newFamilyRelation.trim()) {
      setFamilyMembers([
        ...familyMembers,
        {
          id: Date.now(),
          name: newFamilyName,
          relation: newFamilyRelation
        }
      ]);
      setNewFamilyName('');
      setNewFamilyRelation('');
      setAddFamilyOpen(false);
      toast({
        title: "Family member added",
        description: `${newFamilyName} has been added to your family members.`,
      });
    }
  };
  
  const handleEditFamilyMember = () => {
    if (editingMember && editingMember.name.trim() && editingMember.relation.trim()) {
      setFamilyMembers(familyMembers.map(member => 
        member.id === editingMember.id ? editingMember : member
      ));
      setEditingMember(null);
      toast({
        title: "Family member updated",
        description: "Family member information has been updated.",
      });
    }
  };
  
  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    toast({
      title: "Notification removed",
      description: "The notification has been removed from your list.",
    });
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="p-0 h-auto hover:bg-transparent relative">
            <Avatar className="h-9 w-9 border-2 border-primary/10">
              <AvatarImage src="/lovable-uploads/298d1ba4-d372-413d-9386-a531958ccd9c.png" alt={username} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {username[0]}
              </AvatarFallback>
            </Avatar>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="p-0 w-full sm:max-w-full">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              <SheetHeader className="p-6 bg-gradient-to-br from-primary-light to-white">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <Avatar className="h-16 w-16 border-4 border-white/50 group-hover:border-primary/20 transition-all">
                      <AvatarImage src="/lovable-uploads/298d1ba4-d372-413d-9386-a531958ccd9c.png" alt={username} />
                      <AvatarFallback className="bg-primary text-white text-xl">
                        {username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute bottom-0 right-0 h-6 w-6 bg-primary text-white rounded-full cursor-pointer flex items-center justify-center hover:bg-primary/90 transition-colors">
                      <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                      <Upload className="h-3 w-3" />
                    </label>
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="h-8"
                        />
                        <Button size="sm" onClick={handleNameUpdate}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <SheetTitle>{username}</SheetTitle>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <p className="text-sm text-gray-600">Premium Guest</p>
                  </div>
                </div>
              </SheetHeader>
              
              <ScrollArea className="flex-1 h-[calc(100vh-120px)]">
                <div className="p-4 space-y-6">
                  {roomNumber && (
                    <div className="bg-primary/5 p-4 rounded-xl">
                      <div className="flex items-center gap-3 text-primary mb-2">
                        <BedDouble className="h-5 w-5" />
                        <span className="font-medium">Current Stay</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">Room {roomNumber}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => {
                            toast({
                              title: "Mobile Key",
                              description: "Room key activated on your device",
                            });
                            navigate('/my-room');
                          }}
                        >
                          <Key className="h-4 w-4" />
                          Mobile Key
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Family Members
                    </h3>
                    <div className="space-y-2">
                      {familyMembers.map((member) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">{member.name}</p>
                              <span className="text-xs text-gray-500">{member.relation}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setEditingMember(member)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setAddFamilyOpen(true)}
                      >
                        Add Family Member
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      Recent Notifications
                    </h3>
                    <div className="space-y-2">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-gray-50 p-3 rounded-lg relative"
                        >
                          <p className="text-sm pr-6">{notification.message}</p>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => handleDeleteNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="w-full rounded-xl p-4 h-auto"
                      onClick={() => {
                        toast({
                          title: "Notifications",
                          description: "You have " + notifications.length + " unread notifications",
                        });
                      }}
                    >
                      <div className="text-center">
                        <Bell className="h-5 w-5 mx-auto mb-1 text-primary" />
                        <span className="text-sm font-medium">Notifications</span>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full rounded-xl p-4 h-auto"
                      onClick={() => {
                        toast({
                          title: "Favorites",
                          description: "View your favorite services",
                        });
                      }}
                    >
                      <div className="text-center">
                        <Heart className="h-5 w-5 mx-auto mb-1 text-primary" />
                        <span className="text-sm font-medium">Favorites</span>
                      </div>
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3 p-4"
                      onClick={() => {
                        toast({
                          title: "Profile",
                          description: "View and edit your profile",
                        });
                      }}
                    >
                      <User className="h-5 w-5 text-primary" />
                      Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3 p-4"
                      onClick={() => handleNavigate('/rooms/401')}
                    >
                      <BookMarked className="h-5 w-5 text-primary" />
                      My Bookings
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3 p-4"
                      onClick={() => {
                        toast({
                          title: "Settings",
                          description: "Manage your account settings",
                        });
                      }}
                    >
                      <Settings className="h-5 w-5 text-primary" />
                      Settings
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3 p-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        toast({
                          title: "Sign out",
                          description: "You have been signed out",
                          variant: "destructive",
                        });
                        navigate('/auth/login');
                      }}
                    >
                      <LogOut className="h-5 w-5" />
                      Sign out
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          </AnimatePresence>
        </SheetContent>
      </Sheet>
      
      {/* Add Family Member Dialog */}
      <Dialog open={addFamilyOpen} onOpenChange={setAddFamilyOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Family Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input
                id="name"
                value={newFamilyName}
                onChange={(e) => setNewFamilyName(e.target.value)}
                placeholder="Enter name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="relation" className="text-sm font-medium">Relation</label>
              <Input
                id="relation"
                value={newFamilyRelation}
                onChange={(e) => setNewFamilyRelation(e.target.value)}
                placeholder="E.g. Spouse, Child, Parent"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddFamilyMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Family Member Dialog */}
      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Family Member</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">Name</label>
                <Input
                  id="edit-name"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                  placeholder="Enter name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-relation" className="text-sm font-medium">Relation</label>
                <Input
                  id="edit-relation"
                  value={editingMember.relation}
                  onChange={(e) => setEditingMember({...editingMember, relation: e.target.value})}
                  placeholder="E.g. Spouse, Child, Parent"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditFamilyMember}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserMenu;
