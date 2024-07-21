import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DeviceStats = ({ stats = [] }) => {
  // Calculate device counts
  const deviceCount =
    stats.length > 0 &&
    stats.reduce((acc, item) => {
      if (!acc[item.device_type]) {
        acc[item.device_type] = 0;
      }
      acc[item.device_type]++;
      return acc;
    }, {});

  // Convert deviceCount object to an array of objects
  const result = Object.keys(deviceCount).map((device) => ({
    device,
    count: deviceCount[device],
  }));

  return (
    <div className="w-full">
      <h2 className="text-4xl text-center font-semibold text-yellow-700">
        Device Stats
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            labelLine={false}
            data={result}
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            dataKey="count"
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              percent,
            }) => {
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

              return (
                <text
                  x={x}
                  y={y}
                  fill="#000"
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                  className="font-semibold text-xl"
                >
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {result.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                name={entry.device.toUpperCase()}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const value = payload[0].value;
                const device = payload[0].payload.device;
                return (
                  // <div className="bg-gray-800 bg-opacity-70 text-white p-2 rounded">
                  //   <p className="font-medium">
                  //     Total {value} clicks via {device}
                  //   </p>
                  // </div>
                  <div className="bg-gray-800 bg-opacity-70 text-white p-2 rounded">
                    <p className="font-bold">
                      {device[0].toUpperCase() + device.slice(1)}
                    </p>
                    {value > 0 && <p>Clicks: {value}</p>}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeviceStats;
