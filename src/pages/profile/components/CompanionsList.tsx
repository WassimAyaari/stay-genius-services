
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { CompanionData } from '@/features/users/types/userTypes';

interface CompanionsListProps {
  companions: CompanionData[];
}

const CompanionsList = ({ companions }: CompanionsListProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Users className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Accompagnateurs</h2>
          </div>
        </div>
        {companions.length > 0 ? (
          <div className="divide-y">
            {companions.map((companion, index) => (
              <div key={index} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{companion.first_name || companion.firstName} {companion.last_name || companion.lastName}</p>
                  <p className="text-sm text-muted-foreground">{companion.relation}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            Aucun accompagnateur ajouté
          </div>
        )}
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full">
            Ajouter un accompagnateur
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanionsList;
