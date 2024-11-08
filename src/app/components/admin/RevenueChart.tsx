import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Backend_URL } from "@/app/lib/Constants";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = () => {
  const [timePeriod, setTimePeriod] = useState("week");
  const [chartData, setChartData] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Helper function to get start and end dates for each period
  const getDateRange = (period: string) => {
    const now = new Date();
    let startDate, endDate;

    switch (period) {
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        endDate = new Date();
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        endDate = new Date();
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        endDate = new Date();
        break;
      default:
        startDate = new Date();
        endDate = new Date();
    }

    return { startDate, endDate };
  };

  // Fetch revenue data from the backend
  const fetchRevenueData = async () => {
    const { startDate, endDate } = getDateRange(timePeriod);

    try {
      const response = await axios.get(`${Backend_URL}/payment/revenue`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      const { charges, totalRevenue } = response.data
      setTotalRevenue(totalRevenue)

      const sortedCharges = charges.sort((a, b) => a.created - b.created);

      const labels = sortedCharges.map((charge) =>
        new Date(charge.created * 1000).toLocaleDateString()
      );
      const data = sortedCharges.map((charge) => charge.amount / 100);

      // Update chart data
      setChartData({
        labels,
        datasets: [
          {
            label: `Revenue (${timePeriod})`,
            data: data,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  // Fetch data whenever the time period changes
  useEffect(() => {
    fetchRevenueData();
  }, [timePeriod]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg my-6">
            <h2 className="text-xl font-semibold mb-2">{`Total Revenue In Period (${timePeriod})`}</h2>
            <p className="text-gray-700">
              {totalRevenue} USD
            </p>
          </div>

      {/* Time Period Selection */}
      <div className="mb-4">
        <button
          onClick={() => setTimePeriod("week")}
          className={`mr-4 px-4 py-2 rounded ${
            timePeriod === "week" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Week
        </button>
        <button
          onClick={() => setTimePeriod("month")}
          className={`mr-4 px-4 py-2 rounded ${
            timePeriod === "month" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Month
        </button>
        <button
          onClick={() => setTimePeriod("year")}
          className={`px-4 py-2 rounded ${
            timePeriod === "year" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Year
        </button>
      </div>

      {/* Line Chart */}
      {chartData && <Line data={chartData} />}
    </div>
  );
};

export default RevenueChart;
