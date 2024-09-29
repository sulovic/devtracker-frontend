import React from "react";
import {
  PieChart,
  Pie,
  LabelList,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { ChartDataType } from "../../types/types";

const PieChartComponent: React.FC<{
  name: string;
  data: ChartDataType;
}> = ({ name, data }) => {
  const COLORS = ["#0088FE", "#FF8042", "#FFBB28", "#00C49F"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        fontSize="1.5rem"
        fontWeight="bold"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div>
      <h5 className="upper text-center">{name}</h5>
      <div className="flex justify-center">
          <PieChart margin={{ top: -30, right: 5, left: 5, bottom: 20 }} width={400} height={400}>
            <Legend
              iconType="circle"
              verticalAlign="bottom"
              margin={{ top: 50, right: 5, left: 5, bottom: 20 }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={140}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              nameKey="key"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
      </div>
    </div>
  );
};

export default PieChartComponent;
