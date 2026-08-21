import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell
} from "recharts";

import { TrendingUp } from "lucide-react";

const MiniCharts = ({
    statusChart = [],
    conversionChart = [],
    conversionRate = 0
}) => {

    return (

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">

                <TrendingUp className="h-4 w-4" />

                Pipeline by Status

            </div>

            {/* Status Bar Chart */}

            <div className="h-32 mt-2">

                <ResponsiveContainer width="100%" height="100%">

                    <BarChart
                        data={statusChart}
                        layout="vertical"
                    >

                        <XAxis type="number" hide />

                        <YAxis
                            type="category"
                            dataKey="status"
                            width={70}
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 10
                            }}
                        />

                        <Tooltip />

                        <Bar
                            dataKey="count"
                            radius={[0,4,4,0]}
                            barSize={12}
                        >

                            {statusChart.map((item,index)=>

                                <Cell
                                    key={index}
                                    fill={item.color}
                                />

                            )}

                        </Bar>

                    </BarChart>

                </ResponsiveContainer>

            </div>

            {/* Conversion */}

            <div className="mt-3 flex items-center gap-4 border-t pt-3">

                <div className="h-20 w-20">

                    <ResponsiveContainer>

                        <PieChart>

                            <Pie
                                data={conversionChart}
                                dataKey="value"
                                innerRadius={22}
                                outerRadius={36}
                                paddingAngle={2}
                            >

                                {conversionChart.map((item,index)=>

                                    <Cell
                                        key={index}
                                        fill={item.color}
                                    />

                                )}

                            </Pie>

                        </PieChart>

                    </ResponsiveContainer>

                </div>

                <div className="space-y-1">

                    <div className="text-2xl font-black">

                        {conversionRate}

                        <span className="text-sm text-slate-400">

                            %

                        </span>

                    </div>

                    <div className="text-xs text-slate-400">

                        Conversion Rate

                    </div>

                    {

                        conversionChart.map(item=>(

                            <div
                                key={item.name}
                                className="flex items-center gap-2 text-xs"
                            >

                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                        background:item.color
                                    }}
                                />

                                {item.name} ({item.value})

                            </div>

                        ))

                    }

                </div>

            </div>

        </div>

    );

};

export default MiniCharts;