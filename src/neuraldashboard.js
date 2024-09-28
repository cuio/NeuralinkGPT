import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SpendAnalyticsDashboard = () => {
  const [lineItems, setLineItems] = useState([]);
  const [newItem, setNewItem] = useState({ material: '', cost: '', date: '' });

  const handleAddItem = () => {
    if (newItem.material && newItem.cost && newItem.date) {
      setLineItems([...lineItems, { ...newItem, cost: parseFloat(newItem.cost) }]);
      setNewItem({ material: '', cost: '', date: '' });
    }
  };

  const getTotalSpend = () => lineItems.reduce((sum, item) => sum + item.cost, 0);

  const getSpendByMaterial = () => {
    const spendByMaterial = {};
    lineItems.forEach(item => {
      spendByMaterial[item.material] = (spendByMaterial[item.material] || 0) + item.cost;
    });
    return Object.entries(spendByMaterial).map(([material, spend]) => ({ material, spend }));
  };

  const getSpendOverTime = () => {
    const sortedItems = [...lineItems].sort((a, b) => new Date(a.date) - new Date(b.date));
    let cumulativeSpend = 0;
    return sortedItems.map(item => {
      cumulativeSpend += item.cost;
      return { date: item.date, spend: cumulativeSpend };
    });
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Line Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Material"
              value={newItem.material}
              onChange={(e) => setNewItem({ ...newItem, material: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Cost"
              value={newItem.cost}
              onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
            />
            <Input
              type="date"
              value={newItem.date}
              onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
            />
            <Button onClick={handleAddItem}><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${getTotalSpend().toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spend by Material</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getSpendByMaterial()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="material" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="spend" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spend Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getSpendOverTime()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="spend" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpendAnalyticsDashboard;
