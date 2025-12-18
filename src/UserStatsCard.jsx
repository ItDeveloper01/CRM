import React from "react";
import { Card, CardHeader, CardContent } from "./components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";
import { COLORS } from "./Constants";


const UserStatsCard = ({ users }) => {
  if (!users || users.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">

      {users.map((user) => {
        const barsData = [
          { stage: "Created", value: user.createdCount || 0, color: COLORS.chartCreated },    // Use color for style from constant file 
          { stage: "Open", value: user.openCount || 0, color: COLORS.chartopen },    // Use color for style from constant file 
          { stage: "Confirmed", value: user.confirmedCount || 0, color: COLORS.chartconfirmed },
          { stage: "Lost", value: user.lostCount || 0, color: COLORS.chartlost},
          { stage: "Postponed", value: user.postponedCount || 0, color: COLORS.chartpostponed },
        ];

        return (
          <Card key={user.key || user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-blue-600">
              {user.firstName || user.key}
            </CardHeader>

            <CardContent>
              <div style={{ width: "100%", height: 160 }}>
                <ResponsiveContainer>
                  <BarChart
                    // layout="vertical"
                    data={barsData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                  >
                    <XAxis type="category" dataKey="stage" width={100} />
                    <YAxis type="number" />
                    <Tooltip />
                    <Bar dataKey="value">
                      {barsData.map((item, index) => (
                        <Cell key={index} fill={item.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      })}

    </div>
  );
};

export default UserStatsCard;
