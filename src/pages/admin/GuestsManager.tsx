import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { format, isToday, isBefore, isAfter, startOfDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  Home,
  ArrowRight,
  Calendar,
  ArrowLeftRight,
  Clock,
  Eye,
  Search,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Guest } from './components/guests/types';

type FilterType = 'all' | 'in-house' | 'arrivals' | 'upcoming' | 'departures' | 'past';

interface FilterCard {
  id: FilterType;
  label: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
}

const filterCards: FilterCard[] = [
  { id: 'all', label: 'All', icon: Users, colorClass: 'text-foreground', bgClass: 'bg-muted' },
  { id: 'in-house', label: 'In-House', icon: Home, colorClass: 'text-blue-600', bgClass: 'bg-blue-50' },
  { id: 'arrivals', label: 'Arrivals', icon: ArrowRight, colorClass: 'text-muted-foreground', bgClass: 'bg-muted' },
  { id: 'upcoming', label: 'Upcoming', icon: Calendar, colorClass: 'text-red-600', bgClass: 'bg-red-50' },
  { id: 'departures', label: 'Departures', icon: ArrowLeftRight, colorClass: 'text-red-600', bgClass: 'bg-red-50' },
  { id: 'past', label: 'Past', icon: Clock, colorClass: 'text-muted-foreground', bgClass: 'bg-muted' },
];

const GuestsManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const navigate = useNavigate();

  const handleViewGuest = (guest: Guest) => {
    navigate(`/admin/guests/${guest.id}`);
  };

  const { data: guests = [], isLoading, refetch } = useQuery({
    queryKey: ['guests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const today = startOfDay(new Date());

  const getGuestStatus = (checkIn: string | null, checkOut: string | null) => {
    if (!checkIn || !checkOut) return null;
    const checkInDate = startOfDay(new Date(checkIn));
    const checkOutDate = startOfDay(new Date(checkOut));

    if (isToday(checkInDate)) return 'arrivals';
    if (isToday(checkOutDate)) return 'departures';
    if (!isBefore(today, checkInDate) && !isAfter(today, checkOutDate)) return 'in-house';
    if (isAfter(checkInDate, today)) return 'upcoming';
    if (isBefore(checkOutDate, today)) return 'past';
    return null;
  };

  const filterCounts = useMemo(() => {
    const counts: Record<FilterType, number> = {
      all: guests.length,
      'in-house': 0,
      arrivals: 0,
      upcoming: 0,
      departures: 0,
      past: 0,
    };

    guests.forEach((guest) => {
      const status = getGuestStatus(guest.check_in_date, guest.check_out_date);
      if (status) {
        counts[status]++;
      }
    });

    return counts;
  }, [guests]);

  const filteredGuests = useMemo(() => {
    let filtered = guests;

    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter((guest) => {
        const status = getGuestStatus(guest.check_in_date, guest.check_out_date);
        return status === activeFilter;
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((guest) => {
        const fullName = `${guest.first_name} ${guest.last_name}`.toLowerCase();
        return (
          fullName.includes(query) ||
          guest.email?.toLowerCase().includes(query) ||
          guest.room_number?.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [guests, activeFilter, searchQuery]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'dd/MM/yy');
  };

  const formatFullDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Guest 360°</h1>
          <p className="text-muted-foreground">Manage and view all hotel guests</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 text-sm">
          <Users className="h-4 w-4" />
          {guests.length} guests
        </Badge>
      </div>

      {/* Filter Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {filterCards.map((filter) => {
          const Icon = filter.icon;
          const count = filterCounts[filter.id];
          const isActive = activeFilter === filter.id;

          return (
            <Card
              key={filter.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                isActive && 'ring-2 ring-primary'
              )}
              onClick={() => setActiveFilter(filter.id)}
            >
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className={cn('mb-2 rounded-full p-2', filter.bgClass)}>
                  <Icon className={cn('h-5 w-5', filter.colorClass)} />
                </div>
                <span className="text-sm font-medium">{filter.label}</span>
                <span className="text-2xl font-bold">{count}</span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Guest List Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Guest List</CardTitle>
            <CardDescription>
              {activeFilter === 'all'
                ? 'All registered guests in the system'
                : `Showing ${filterCards.find((f) => f.id === activeFilter)?.label} guests`}
            </CardDescription>
          </div>
          <Badge variant="outline">{filteredGuests.length} guests</Badge>
        </CardHeader>
        <CardContent>
          {/* Search and Refresh */}
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>First Login</TableHead>
                  <TableHead>Last Logout</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      Loading guests...
                    </TableCell>
                  </TableRow>
                ) : filteredGuests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      No guests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGuests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell className="font-medium">
                        {guest.first_name} {guest.last_name}
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">—</span>
                      </TableCell>
                      <TableCell>{guest.room_number || '—'}</TableCell>
                      <TableCell>{formatDate(guest.check_in_date)}</TableCell>
                      <TableCell>{formatDate(guest.check_out_date)}</TableCell>
                      <TableCell>{formatFullDate(guest.created_at)}</TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">N/A</span>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {guest.email || '—'}
                      </TableCell>
                      <TableCell>{guest.phone || '—'}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleViewGuest(guest)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestsManager;
