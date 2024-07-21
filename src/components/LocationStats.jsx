import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const LocationStats = ({ stats = [] }) => {
  const [selectedCountry, setSelectedCountry] = useState("All");

  // Aggregate counts of each device type for each city
  const cityDeviceCounts = stats.reduce((acc, item) => {
    const key = `${item.city}_${item.country}`; // Using city and country as a unique key
    if (!acc[key]) {
      acc[key] = {
        city: item.city,
        country: item.country,
        mobileCount: 0,
        tabletCount: 0,
        desktopCount: 0,
        otherCount: 0,
      };
    }

    // Increment count for device type
    if (item.device_type === "mobile") {
      acc[key].mobileCount += 1;
    } else if (item.device_type === "tablet") {
      acc[key].tabletCount += 1;
    } else if (item.device_type === "desktop") {
      acc[key].desktopCount += 1;
    } else {
      // For any other device types, increment 'otherCount'
      acc[key].otherCount += 1;
    }

    return acc;
  }, {});

  // Convert cityDeviceCounts object to an array of objects
  const citiesWithDeviceCounts = Object.values(cityDeviceCounts).map(
    (cityData) => ({
      city: cityData.city,
      country: cityData.country,
      mobileCount: cityData.mobileCount,
      tabletCount: cityData.tabletCount,
      desktopCount: cityData.desktopCount,
      otherCount: cityData.otherCount,
    })
  );

  // Filter data by selected country
  const filteredCities =
    selectedCountry === "All"
      ? citiesWithDeviceCounts
      : citiesWithDeviceCounts.filter(
          (city) => city.country === selectedCountry
        );

  // Function to handle country filter change
  const handleCountryChange = (val) => {
    setSelectedCountry(val);
  };

  return (
    <div className="w-full">
      <h2 className="text-4xl text-center font-semibold text-yellow-700">
        Location Stats
      </h2>
      <div className="my-4 flex items-center justify-between">
        <label
          htmlFor="countryFilter"
          className="mr-2 text-yellow-700 font-bold"
        >
          Filter by Country:
        </label>
        <Select
          onValueChange={handleCountryChange}
          defaultValue="All"
          id="countryFilter"
          value={selectedCountry}
          className="border-none"
        >
          <SelectTrigger className="w-[200px] rounded-full p-4 text-base bg-yellow-200 text-yellow-900 placeholder:text-yellow-600 ring-0 focus:ring-0 shadow-none focus:shadow-none focus:outline-none border-none focus:border-none">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent className="bg-yellow-100 text-yellow-900">
            <SelectItem
              value="All"
              className="font-semibold focus:bg-yellow-200 focus:text-yellow-900"
            >
              All
            </SelectItem>
            {/* Assuming countries can be derived from stats data */}
            {Array.from(new Set(stats.map((item) => item.country))).map(
              (country, index) => (
                <SelectItem
                  className="focus:bg-yellow-200 focus:text-yellow-900"
                  key={index}
                  value={country}
                >
                  {country}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-center items-center">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={filteredCities}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }} // Adjust margins as needed
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="city"
              angle={-45}
              textAnchor="end"
              interval={0}
              tickLine={false}
              tick={{ fontSize: "0.80rem", fill: "#718096" }}
            />
            <YAxis
              tick={{ fontSize: "1rem", fill: "#718096" }}
              tickLine={false}
            />
            <Tooltip
              content={({ payload }) => {
                // Custom tooltip content to display city and device counts
                return (
                  <div className="bg-gray-800 bg-opacity-70 text-white p-2 rounded">
                    <p className="font-bold">{payload[0]?.payload.city}</p>
                    {payload[0]?.payload.mobileCount > 0 && (
                      <p>Mobile: {payload[0]?.payload.mobileCount} clicks</p>
                    )}
                    {payload[0]?.payload.tabletCount > 0 && (
                      <p>Tablet: {payload[0]?.payload.tabletCount} clicks</p>
                    )}
                    {payload[0]?.payload.desktopCount > 0 && (
                      <p>Desktop: {payload[0]?.payload.desktopCount} clicks</p>
                    )}
                    {payload[0]?.payload.otherCount > 0 && (
                      <p>Others: {payload[0]?.payload.otherCount} clicks</p>
                    )}
                  </div>
                );
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            {/* Render bars for mobile, tablet, desktop, and other counts */}
            <Bar
              dataKey="mobileCount"
              name="Mobile"
              stackId="a"
              fill="#8884d8"
              label={{ position: "top" }}
            />
            <Bar
              name="Tablet"
              dataKey="tabletCount"
              stackId="a"
              fill="#82ca9d"
              label={{ position: "top" }}
            />
            <Bar
              dataKey="desktopCount"
              name="Desktop"
              stackId="a"
              fill="#ffc658"
              label={{ position: "top" }}
            />
            <Bar
              name="Others"
              dataKey="otherCount"
              stackId="a"
              fill="#ff7f7f"
              label={{
                position: "top",
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LocationStats;
