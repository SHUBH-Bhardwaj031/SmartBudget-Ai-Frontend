import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

export default function DayWiseSpendChart({
  recentTransactions = [], // yeh lastWeekTransactions pass karo UserHome se
  currency = "INR",
}) {
  const { labels, data } = useMemo(() => {
    if (!recentTransactions.length) return { labels: [], data: [] };

    // Ab direct jo transactions pass hui hain unko use karenge (last week)
    const txForChart = recentTransactions;

    // Aggregate by date
    const map = {};
    txForChart.forEach(tx => {
      const date = new Date(tx.date).toISOString().split("T")[0];
      if (!map[date]) map[date] = 0;
      map[date] += tx.amount || 0;
    });

    const sortedDates = Object.keys(map).sort((a, b) => new Date(a) - new Date(b));
    const series = sortedDates.map(d => map[d]);

    return { labels: sortedDates, data: series };
  }, [recentTransactions]);

  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: "Daily Spend",
        data,
        borderColor: "#3b82f6",
        pointBackgroundColor: "#3b82f6",
        pointRadius: 2.5,
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        backgroundColor: ctx => {
          const { chart } = ctx;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return "rgba(59,130,246,0.15)";
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(59,130,246,0.25)");
          gradient.addColorStop(1, "rgba(59,130,246,0.02)");
          return gradient;
        },
      },
    ],
  }), [labels, data]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: items => {
            const raw = items?.[0]?.label;
            const d = raw ? new Date(raw) : null;
            return d ? d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : raw;
          },
          label: ctx => {
            const val = ctx.parsed.y || 0;
            try {
              return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(val);
            } catch {
              return `₹${val}`;
            }
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          callback: (value, index) => {
            const raw = labels[index];
            const d = raw ? new Date(raw) : null;
            return d ? d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : raw;
          },
        },
      },
      y: {
        grid: { color: "rgba(17,24,39,0.06)" },
        ticks: {
          callback: val => {
            try {
              return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(val);
            } catch {
              return `₹${val}`;
            }
          },
        },
      },
    },
  }), [currency, labels]);

  return <Line data={chartData} options={options} />;
}
