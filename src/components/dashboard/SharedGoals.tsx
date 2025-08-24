import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  progress: number;
  current: string;
  target: string;
  currency: string;
  participants: Array<{
    name: string;
    avatar?: string;
    initials: string;
  }>;
}

const goals: Goal[] = [
  {
    id: '1',
    title: 'Trip to Bali',
    progress: 47,
    current: '235,000',
    target: '500,000',
    currency: 'Rs.',
    participants: [
      { name: 'User 1', initials: 'U1' },
      { name: 'User 2', initials: 'U2' }
    ]
  },
  {
    id: '2',
    title: 'Emergency Fund',
    progress: 72,
    current: '360,000',
    target: '500,000',
    currency: 'Rs.',
    participants: [
      { name: 'User 1', initials: 'U1' }
    ]
  },
  {
    id: '3',
    title: 'New Oven',
    progress: 23,
    current: '9,200',
    target: '40,000',
    currency: 'Rs.',
    participants: [
      { name: 'User 1', initials: 'U1' },
      { name: 'User 2', initials: 'U2' }
    ]
  },
];

export function SharedGoals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Shared Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div key={goal.id} className="rounded-xl bg-slate-50 p-4 space-y-4 border border-slate-100">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm mb-2">{goal.title}</h3>
                <p className="text-xs text-slate-600 mb-3">
                  {goal.progress}% Complete
                </p>
                <Progress 
                  value={goal.progress} 
                  className="h-2 mb-3 bg-slate-200 rounded-full overflow-hidden" 
                />
                <p className="text-xs text-slate-600 font-medium">
                  {goal.currency} {goal.current} / {goal.currency} {goal.target}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {goal.participants.map((participant, index) => (
                    <Avatar key={index} className="h-7 w-7 border-2 border-white shadow-sm">
                      <AvatarImage src={participant.avatar} alt={participant.name} />
                      <AvatarFallback className="text-xs bg-emerald-500 text-white font-semibold">
                        {participant.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                
                <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-auto p-2 rounded-lg">
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}