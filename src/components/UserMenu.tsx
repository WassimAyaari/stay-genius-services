
import React, { useState, useEffect } from 'react';
import { User, Settings, LogOut, BedDouble, Bell, Heart, BookMarked, Upload, X, Edit, Users, Key } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
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
import { supabase } from '@/integrations/supabase/client';
import { defaultUser } from '@/data/defaultUser';

interface Companion {
  id: string;
  first_name: string;
  last_name?: string | null;
  relation: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface UserMenuProps {
  roomNumber?: string;
}

const UserMenu = ({ roomNumber }: UserMenuProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [userProfile, setUserProfile] = useState({
    firstName: defaultUser.firstName,
    lastName: defaultUser.lastName,
    email: defaultUser.email,
  });
  const [familyMembers, setFamilyMembers] = useState<Companion[]>(defaultUser.companions);
  const [notifications, setNotifications] = useState(defaultUser.notifications);
  const { toast } = useToast();
  
  const [addFamilyOpen, setAddFamilyOpen] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newFamilyRelation, setNewFamilyRelation] = useState('');
  const [editingMember, setEditingMember] = useState<Companion | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // If user is authenticated, use their actual data
        const { data: userData, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', session.user.id)
          .single();

        if (userData && !error) {
          setUserProfile({
            firstName: userData.first_name || defaultUser.firstName,
            lastName: userData.last_name || defaultUser.lastName,
            email: session.user.email || defaultUser.email,
          });
          setNewName(`${userData.first_name || ''} ${userData.last_name || ''}`);
        } else {
          // Fallback to default user if no profile found
          setUserProfile({
            firstName: defaultUser.firstName,
            lastName: defaultUser.lastName,
            email: defaultUser.email,
          });
          setNewName(`${defaultUser.firstName} ${defaultUser.lastName}`);
        }

        try {
          const { data: companions, error: companionsError } = await supabase
            .from('companions')
            .select('*')
            .eq('user_id', session.user.id);

          if (companions && !companionsError && companions.length > 0) {
            setFamilyMembers(companions);
          } else {
            // Use default companions if none are found in DB
            setFamilyMembers(defaultUser.companions);
          }
        } catch (err) {
          console.error("Error in companions fetch:", err);
          setFamilyMembers(defaultUser.companions);
        }
      } else {
        // If not authenticated, use default data
        setUserProfile({
          firstName: defaultUser.firstName,
          lastName: defaultUser.lastName,
          email: defaultUser.email,
        });
        setNewName(`${defaultUser.firstName} ${defaultUser.lastName}`);
        setFamilyMembers(defaultUser.companions);
      }
    };

    fetchUserData();
  }, []);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated.",
      });
    }
  };

  const handleNameUpdate = async () => {
    if (newName.trim()) {
      const names = newName.trim().split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { error } = await supabase
          .from('profiles')
          .upsert({ 
            id: session.user.id,
            first_name: firstName,
            last_name: lastName
          });

        if (!error) {
          setUserProfile({
            ...userProfile,
            firstName,
            lastName
          });
          
          toast({
            title: "Profile updated",
            description: "Your name has been successfully updated.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to update profile.",
            variant: "destructive",
          });
        }
      } else {
        // Just update the local state for default user
        setUserProfile({
          ...userProfile,
          firstName,
          lastName
        });
        
        toast({
          title: "Profile updated",
          description: "Your name has been successfully updated.",
        });
      }
      
      setIsEditing(false);
    }
  };
  
  const handleAddFamilyMember = async () => {
    if (newFamilyName.trim() && newFamilyRelation.trim()) {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const names = newFamilyName.split(' ');
        const firstName = names[0] || '';
        const lastName = names.slice(1).join(' ') || '';
        
        try {
          const { data, error } = await supabase
            .from('companions')
            .insert({
              user_id: session.user.id,
              first_name: firstName,
              last_name: lastName,
              relation: newFamilyRelation
            })
            .select();
            
          if (!error && data) {
            setFamilyMembers([...familyMembers, data[0] as Companion]);
            setNewFamilyName('');
            setNewFamilyRelation('');
            setAddFamilyOpen(false);
            
            toast({
              title: "Family member added",
              description: `${newFamilyName} has been added to your family members.`,
            });
          } else {
            toast({
              title: "Error",
              description: "Failed to add family member.",
              variant: "destructive",
            });
          }
        } catch (err) {
          console.error("Error adding companion:", err);
          toast({
            title: "Error",
            description: "Failed to add family member due to a system error.",
            variant: "destructive",
          });
        }
      } else {
        // For demo/default user, just add to local state
        const newMember: Companion = {
          id: `temp-${Date.now()}`,
          first_name: newFamilyName.split(' ')[0],
          last_name: newFamilyName.split(' ').slice(1).join(' '),
          relation: newFamilyRelation
        };
        
        setFamilyMembers([...familyMembers, newMember]);
        setNewFamilyName('');
        setNewFamilyRelation('');
        setAddFamilyOpen(false);
        
        toast({
          title: "Family member added",
          description: `${newFamilyName} has been added to your family members.`,
        });
      }
    }
  };
  
  const handleEditFamilyMember = async () => {
    if (editingMember && editingMember.first_name.trim() && editingMember.relation.trim()) {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user && editingMember.user_id) {
        try {
          const { error } = await supabase
            .from('companions')
            .update({
              first_name: editingMember.first_name,
              last_name: editingMember.last_name,
              relation: editingMember.relation
            })
            .eq('id', editingMember.id);
            
          if (!error) {
            setFamilyMembers(familyMembers.map(member => 
              member.id === editingMember.id ? editingMember : member
            ));
            setEditingMember(null);
            toast({
              title: "Family member updated",
              description: "Family member information has been updated.",
            });
          } else {
            toast({
              title: "Error",
              description: "Failed to update family member.",
              variant: "destructive",
            });
          }
        } catch (err) {
          console.error("Error updating companion:", err);
          toast({
            title: "Error",
            description: "Failed to update family member due to a system error.",
            variant: "destructive",
          });
        }
      } else {
        // For demo/default user, just update local state
        setFamilyMembers(familyMembers.map(member => 
          member.id === editingMember.id ? editingMember : member
        ));
        setEditingMember(null);
        toast({
          title: "Family member updated",
          description: "Family member information has been updated.",
        });
      }
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

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (!error) {
      toast({
        title: "Sign out",
        description: "You have been signed out",
        variant: "destructive",
      });
      navigate('/auth/login');
    } else {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const displayName = `${userProfile.firstName} ${userProfile.lastName}`.trim() || userProfile.email || 'Guest';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="p-0 h-auto hover:bg-transparent relative">
            <Avatar className="h-9 w-9 border-2 border-primary/10">
              <AvatarImage src={defaultUser.avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {initials}
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
                      <AvatarImage src={defaultUser.avatarUrl} alt={displayName} />
                      <AvatarFallback className="bg-primary text-white text-xl">
                        {initials}
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
                        <SheetTitle>{displayName}</SheetTitle>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <p className="text-sm text-gray-600">{defaultUser.role}</p>
                  </div>
                </div>
              </SheetHeader>
              
              <ScrollArea className="flex-1 h-[calc(100vh-120px)]">
                <div className="p-4 space-y-6">
                  {(roomNumber || defaultUser.roomNumber) && (
                    <div className="bg-primary/5 p-4 rounded-xl">
                      <div className="flex items-center gap-3 text-primary mb-2">
                        <BedDouble className="h-5 w-5" />
                        <span className="font-medium">Current Stay</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">Room {roomNumber || defaultUser.roomNumber}</p>
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
                              <p className="text-sm font-medium">{`${member.first_name} ${member.last_name || ''}`}</p>
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
                      onClick={handleSignOut}
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
      
      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Family Member</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">First Name</label>
                <Input
                  id="edit-name"
                  value={editingMember.first_name}
                  onChange={(e) => setEditingMember({...editingMember, first_name: e.target.value})}
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-last-name" className="text-sm font-medium">Last Name</label>
                <Input
                  id="edit-last-name"
                  value={editingMember.last_name || ''}
                  onChange={(e) => setEditingMember({...editingMember, last_name: e.target.value})}
                  placeholder="Enter last name"
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
