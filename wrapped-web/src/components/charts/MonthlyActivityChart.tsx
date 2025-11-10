"use client";

interface MonthlyActivityChartProps {
  data: {
    Jan: number;
    Feb: number;
    Mar: number;
    Apr: number;
    May: number;
    Jun: number;
    Jul: number;
    Aug: number;
    Sep: number;
    Oct: number;
    Nov: number;
    Dec: number;
  };
}

export default function MonthlyActivityChart({
  data,
}: MonthlyActivityChartProps) {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const values = [
    data.Jan,
    data.Feb,
    data.Mar,
    data.Apr,
    data.May,
    data.Jun,
    data.Jul,
    data.Aug,
    data.Sep,
    data.Oct,
    data.Nov,
    data.Dec,
  ];
  const max = Math.max(...values, 1); // Prevent division by zero

  return (
    <div className="flex items-end justify-between gap-1 h-20">
      {months.map((month, i) => (
        <div key={month} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-[#C89B3C] transition-all hover:bg-[#D4AA4D] rounded-sm"
            style={{
              height: `${(values[i] / max) * 100}%`,
              minHeight: values[i] > 0 ? "4px" : "0",
            }}
          />
          <span className="text-[#5A6B7A] text-[9px] font-medium">{month}</span>
        </div>
      ))}
    </div>
  );
}
