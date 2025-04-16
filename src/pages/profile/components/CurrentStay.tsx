
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Key, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserData } from '@/features/users/types/userTypes';
import { formatDate } from '../utils/dateUtils';

interface CurrentStayProps {
  userData: UserData | null;
  stayDuration: number | null;
}

const CurrentStay = ({ userData, stayDuration }: CurrentStayProps) => {
  const formatCheckInDate = userData?.check_in_date ? formatDate(userData.check_in_date) : 'Non défini';
  const formatCheckOutDate = userData?.check_out_date ? formatDate(userData.check_out_date) : 'Non défini';
  
  return (
    <Card className="mb-6">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Building className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Séjour actuel</h2>
          </div>
        </div>
        <div className="divide-y">
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Chambre</p>
                <p className="text-sm text-muted-foreground">{userData?.room_number || '406'}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Key className="h-4 w-4" />
              Clé mobile
            </Button>
          </div>
          
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Dates de séjour</p>
                <p className="text-sm text-muted-foreground">
                  Du {formatCheckInDate} au {formatCheckOutDate}
                </p>
              </div>
            </div>
            {stayDuration && (
              <Badge variant="outline" className="ml-2">
                {stayDuration} {stayDuration > 1 ? 'nuits' : 'nuit'}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentStay;
