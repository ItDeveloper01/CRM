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

const UserStatsCard = ({ users }) => {
  if (!users || users.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">

      {users.map((user) => {
        const barsData = [
          { stage: "Open", value: user.openCount || 0, color: "#facc15" },
          { stage: "Confirmed", value: user.confirmedCount || 0, color: "#10b981" },
          { stage: "Lost", value: user.lostCount || 0, color: "#ef4444" },
          { stage: "Postponed", value: user.postponedCount || 0, color: "#f97316" },
        ];

        return (
          <Card key={user.key || user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-indigo-600">
              {user.firstName || user.key}
            </CardHeader>

            <CardContent>
              <div style={{ width: "100%", height: 160 }}>
                <ResponsiveContainer>
                  <BarChart
                    layout="vertical"
                    data={barsData}
                    margin={{ top: 10, right: 20, left: 50, bottom: 10 }}
                  >
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="stage" width={100} />
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
