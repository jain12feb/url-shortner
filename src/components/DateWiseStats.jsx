import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const DateWiseStats = ({ stats = [], current = moment() }) => {
  const [selectedYear, setSelectedYear] = useState(current.year());
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [filteredData, setFilteredData] = useState([]);

  // Memoized months array
  const months = moment.months();

  // Format stats into date-wise count
  const dateWiseCount = stats.reduce((acc, item) => {
    const formattedDate = moment(item.created_at).format("LL");
    acc[formattedDate] = (acc[formattedDate] || 0) + 1;
    return acc;
  }, {});

  // Convert dateWiseCount into an array of objects
  const dates = Object.entries(dateWiseCount).map(([created_at, count]) => ({
    created_at,
    count,
  }));

  // Handle year change
  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  // Handle month change
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  // Filter data based on selected year and month
  useEffect(() => {
    const filteredDates = dates.filter(({ created_at }) => {
      const year = moment(new Date(created_at)).year();
      const month = moment(new Date(created_at)).month();
      return year === selectedYear && month === selectedMonth;
    });

    const sortedDates = filteredDates.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
    setFilteredData(sortedDates);
  }, [selectedYear, selectedMonth]);

  // Determine current year and month
  const currentYearNum = moment().year();
  const currentMonthNum = moment().month();

  return (
    <div className="w-full">
      <h2 className="text-4xl text-center font-semibold text-yellow-700 my-5">
        Date Wise Stats
      </h2>
      <div className="flex justify-around items-center mb-10 gap-5">
        {/* Year filter */}
        <div className="my-4 flex items-center justify-between">
          <label
            htmlFor="dateFilter"
            className="mr-2 text-yellow-700 font-bold"
          >
            Filter by Year:
          </label>
          <Select
            onValueChange={handleYearChange}
            value={selectedYear}
            className="border-none"
          >
            <SelectTrigger className="w-[100px] rounded-full p-4 text-base bg-yellow-200 text-yellow-900 placeholder:text-yellow-600 ring-0 focus:ring-0 shadow-none focus:shadow-none focus:outline-none border-none focus:border-none">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent className="bg-yellow-100 text-yellow-900">
              {Array.from(
                new Set(stats.map((item) => moment(item.created_at).year()))
              ).map((year) => (
                <SelectItem
                  key={year}
                  value={year}
                  className="focus:bg-yellow-200 focus:text-yellow-900"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Month filter */}
        <div className="my-4 flex items-center justify-between">
          <label
            htmlFor="monthFilter"
            className="mr-2 text-yellow-700 font-bold"
          >
            Filter by Month:
          </label>
          <Select
            onValueChange={handleMonthChange}
            value={selectedMonth}
            className="border-none"
          >
            <SelectTrigger className="w-[135px] rounded-full p-4 text-base bg-yellow-200 text-yellow-900 placeholder:text-yellow-600 ring-0 focus:ring-0 shadow-none focus:shadow-none focus:outline-none border-none focus:border-none">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent className="bg-yellow-100 text-yellow-900">
              {months.map((month, index) => {
                const isSelectedMonthAvailable =
                  moment(selectedYear).isBefore(currentYearNum) ||
                  (moment(selectedYear).isSame(currentYearNum) &&
                    index <= currentMonthNum);
                if (isSelectedMonthAvailable) {
                  return (
                    <SelectItem
                      key={month}
                      value={index}
                      className="focus:bg-yellow-200 focus:text-yellow-900"
                    >
                      {month}
                    </SelectItem>
                  );
                }
                return null;
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Line chart */}
      {filteredData.length > 0 ? (
        <div
          style={{ width: "100%", height: 300 }}
          className="flex justify-center items-center"
        >
          <ResponsiveContainer>
            <LineChart width={700} height={300} data={filteredData}>
              <XAxis
                angle={-45}
                textAnchor="end"
                interval={0}
                tickLine={false}
                tick={{ fontSize: "0.80rem", fill: "#718096" }}
                dataKey={({ created_at }) => moment(created_at).format("ll")}
              />
              <YAxis
                tick={{ fontSize: "1rem", fill: "#718096" }}
                tickLine={false}
                scale="auto"
              />
              <Tooltip
                labelStyle={{ color: "green" }}
                content={({ payload }) => (
                  <div className="bg-gray-800 bg-opacity-70 text-white p-2 rounded">
                    <p className="font-bold">
                      {
                        moment(payload[0]?.payload.created_at)
                          .calendar()
                          .split(" at ")[0]
                      }
                    </p>
                    {payload[0]?.payload.count > 0 && (
                      <p>Clicks: {payload[0]?.payload.count}</p>
                    )}
                  </div>
                )}
              />
              <Legend wrapperStyle={{ paddingTop: "30px" }} />
              <Line
                type="monotone"
                dataKey="count"
                name="Clicks"
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 my-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            data-name="Layer 1"
            width="147.63626"
            height="132.17383"
            viewBox="0 0 647.63626 632.17383"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <path
              d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z"
              transform="translate(-276.18187 -133.91309)"
              // fill="#f2f2f2"
              fill="rgb(254 240 138)"
            />
            <path
              d="M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z"
              transform="translate(-276.18187 -133.91309)"
              fill="rgb(161 98 7)"
            />
            <path
              d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z"
              transform="translate(-276.18187 -133.91309)"
              fill="rgb(161 98 7)"
            />
            <circle cx="190.15351" cy="24.95465" r={20} fill="rgb(161 98 7)" />
            <circle cx="190.15351" cy="24.95465" r="12.66462" fill="#fff" />
            <path
              d="M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z"
              transform="translate(-276.18187 -133.91309)"
              // fill="#e6e6e6"
              fill="rgb(254 240 138)"
            />
            <path
              d="M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z"
              transform="translate(-276.18187 -133.91309)"
              fill="rgb(161 98 7)"
            />
            <path
              d="M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z"
              transform="translate(-276.18187 -133.91309)"
              fill="rgb(161 98 7)"
            />
            <circle cx="433.63626" cy="105.17383" r={20} fill="rgb(161 98 7)" />
            <circle cx="433.63626" cy="105.17383" r="12.18187" fill="#fff" />
          </svg>

          <h1 className="text-4xl font-extrabold text-yellow-700">
            No Stats Found
          </h1>
          <p className="text-lg text-yellow-700">
            Try changing date to see stats
          </p>
        </div>
      )}
    </div>
  );
};

export default DateWiseStats;
