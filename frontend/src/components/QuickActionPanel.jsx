import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CreditCard, Target, Receipt, Clock, Plus } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const QuickActionPanel = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('expense');

  const handleSubmit = (actionType) => {
    toast({
      title: "Action Recorded!",
      description: `Your ${actionType} has been saved successfully.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus size={20} />
            Quick Actions
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="expense" className="flex items-center gap-2">
              <CreditCard size={16} />
              Expense
            </TabsTrigger>
            <TabsTrigger value="goal" className="flex items-center gap-2">
              <Target size={16} />
              Goal
            </TabsTrigger>
            <TabsTrigger value="receipt" className="flex items-center gap-2">
              <Receipt size={16} />
              Receipt
            </TabsTrigger>
            <TabsTrigger value="reminder" className="flex items-center gap-2">
              <Clock size={16} />
              Reminder
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expense" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Expense</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" placeholder="$0.00" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Food & Dining</option>
                      <option>Transportation</option>
                      <option>Shopping</option>
                      <option>Entertainment</option>
                      <option>Bills & Utilities</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="What did you spend on?" />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <Button 
                  onClick={() => handleSubmit('expense')}
                  className="w-full bg-[#5945a3] hover:bg-[#4a3d8f]"
                >
                  Add Expense
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create Goal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="goalTitle">Goal Title</Label>
                  <Input id="goalTitle" placeholder="e.g., Emergency Fund" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="targetAmount">Target Amount</Label>
                    <Input id="targetAmount" placeholder="$10,000" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="deadline">Target Date</Label>
                    <Input id="deadline" type="date" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="goalDescription">Description</Label>
                  <Textarea id="goalDescription" placeholder="Why is this goal important to you?" />
                </div>
                <div>
                  <Label htmlFor="goalCategory">Category</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Emergency Fund</option>
                    <option>Vacation</option>
                    <option>Home Purchase</option>
                    <option>Investment</option>
                    <option>Education</option>
                    <option>Other</option>
                  </select>
                </div>
                <Button 
                  onClick={() => handleSubmit('goal')}
                  className="w-full bg-[#5945a3] hover:bg-[#4a3d8f]"
                >
                  Create Goal
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receipt" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Scan Receipt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Receipt size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Drop your receipt image here or click to upload</p>
                  <Button variant="outline">Choose File</Button>
                </div>
                <p className="text-sm text-gray-500">
                  AI will automatically extract expense details from your receipt
                </p>
                <Button 
                  onClick={() => handleSubmit('receipt scan')}
                  className="w-full bg-[#5945a3] hover:bg-[#4a3d8f]"
                >
                  Process Receipt
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reminder" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Set Reminder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="reminderTitle">Reminder Title</Label>
                  <Input id="reminderTitle" placeholder="e.g., Pay credit card bill" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reminderDate">Date</Label>
                    <Input id="reminderDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="reminderTime">Time</Label>
                    <Input id="reminderTime" type="time" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reminderType">Type</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Bill Payment</option>
                    <option>Investment Review</option>
                    <option>Budget Check</option>
                    <option>Goal Progress</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="reminderNotes">Notes</Label>
                  <Textarea id="reminderNotes" placeholder="Additional details..." />
                </div>
                <Button 
                  onClick={() => handleSubmit('reminder')}
                  className="w-full bg-[#5945a3] hover:bg-[#4a3d8f]"
                >
                  Set Reminder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default QuickActionPanel;