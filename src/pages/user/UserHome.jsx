import { useEffect, useState, useCallback } from "react";
import { getDashboardData } from "../../services/AiService.js";
import DayWiseSpendChart from "../../components/user/DayWiseSpendChart.jsx";
import StatCard from "../../components/user/StatCard.jsx";
import PaymentMethodDoughnut from "../../components/user/PaymentMethodDoughnut.jsx";
import RecentTransactionsList from "../../components/user/RecentTransactionsList.jsx";
import DashboardSkeleton from "../../components/user/DashboardSkeleton.jsx";
import DailySpendBar from "../../components/user/DailySpendBar.jsx";
import { ArrowUpRight, ArrowDownRight, Wallet, CalendarDays, CreditCard, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency, formatDate } from "../../utils/formatters.js";
import { useAuthContext } from "../../context/AuthContext.jsx";

export default function UserHome() {
  const { user } = useAuthContext();
  const [dashboardData, setDashboardData] = useState(() => {
    const saved = sessionStorage.getItem("dashboardData");
    return saved ? JSON.parse(saved) : null;
  });

  // Dropdown state
  const [showRecent, setShowRecent] = useState(false);

  const refreshDashboard = useCallback(async () => {
    try {
      const data = await getDashboardData();

      // Normalize transactions
      const normalizedTransactions = (data.recentTransactions ?? []).map(tx => ({
        ...tx,
        amount: tx.amount ?? tx.rs ?? 0,
        date: tx.date ?? tx.createdAt ?? new Date(),
      }));

      setDashboardData({ ...data, lastWeekTransactions: normalizedTransactions });
      sessionStorage.setItem(
        "dashboardData",
        JSON.stringify({ ...data, lastWeekTransactions: normalizedTransactions })
      );
    } catch (err) {
      console.error("Failed to refresh dashboard:", err);
    }
  }, []);

  useEffect(() => {
    refreshDashboard();
  }, [user, refreshDashboard]);

  if (!dashboardData) return <DashboardSkeleton />;

  const data = dashboardData;
  const currency = data?.currency ?? "INR";

  const totalForTheWeek = Number(data.totalForTheWeek ?? 0);
  const totalPreviousWeek = Number(data.totalPreviousWeek ?? 0);
  const isUp = totalForTheWeek >= totalPreviousWeek;

  // Top Payment Method
  const topPaymentMethodUsed =
    data.payMethodUsedBreakdown?.length > 0
      ? {
          name: data.payMethodUsedBreakdown[0]._id ?? data.payMethodUsedBreakdown[0].method ?? "Unknown",
          amount: Number(data.payMethodUsedBreakdown[0].amount ?? 0),
          pct:
            totalForTheWeek > 0
              ? ((data.payMethodUsedBreakdown[0].amount / totalForTheWeek) * 100).toFixed(2)
              : 0,
        }
      : { name: "-", amount: 0, pct: 0 };

  const peakDayData = data.dailyBreakdown?.reduce(
    (max, d) => (d.amount > (max?.amount ?? 0) ? d : max),
    null
  );
  const peakDay = peakDayData ? formatDate(peakDayData._id) : "-";
  const peakAmount = peakDayData ? formatCurrency(peakDayData.amount, currency) : formatCurrency(0, currency);

  // Last 1 week transactions
  const lastWeekTransactions = data?.lastWeekTransactions ?? [];

  return (
    <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="mt-2 mb-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-emerald-500/10 border border-indigo-100/60 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Warning</h1>
            <p className="font-semibold mt-2 text-2xl text-gray-600">{data.headline ?? "Keep track of your expenses"}</p>
            <p className="text-lg mt-2 text-gray-600">{data.tip ?? "Budget wisely!"}</p>
          </div>
          <div
            className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${isUp ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
          >
            {isUp ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-1" />}
            {isUp ? "Up" : "Down"}
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={<Wallet className="w-5 h-5" />} title="This Week" value={formatCurrency(totalForTheWeek, currency)} subtitle="Total spent" accent="from-blue-500/20 to-blue-500/5" />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Trend"
          value={`${isUp ? "+" : "-"}${Math.abs(totalForTheWeek - totalPreviousWeek)}`}
          subtitle={isUp ? "Up vs last week" : "Down vs last week"}
          trendIcon={isUp ? <ArrowUpRight className="w-4 h-4 text-emerald-600" /> : <ArrowDownRight className="w-4 h-4 text-rose-600" />}
          accent={isUp ? "from-emerald-500/15 to-emerald-500/5" : "from-rose-500/15 to-rose-500/5"}
        />
        <StatCard
          icon={<CreditCard className="w-5 h-5" />}
          title="Top Payment Method"
          value={`${topPaymentMethodUsed.name} · ${formatCurrency(topPaymentMethodUsed.amount, currency)}`}
          subtitle={`${topPaymentMethodUsed.pct}% of total`}
          accent="from-violet-500/15 to-violet-500/5"
        />
        <StatCard
          icon={<CalendarDays className="w-5 h-5" />}
          title="Peak Day"
          value={peakDay}
          subtitle={`${peakAmount} spent`}
          accent="from-amber-500/15 to-amber-500/5"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
        <motion.div
          className="xl:col-span-2 rounded-2xl border border-gray-200 text-whitey bg-[#1B1F24]  backdrop-blur p-5 shadow-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-medium">Day-wise Spend</h3>
              <p className="text-xs text-gray-500">Last 1 week totals</p>
            </div>
          </div>
          <div className="h-72">
            <DayWiseSpendChart recentTransactions={lastWeekTransactions} currency={currency} />
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-gray-200 bg-[#1B1F24] text-white backdrop-blur p-5 shadow-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <h3 className="font-medium mb-3">Payment Methods</h3>
          <div className="h-72">
            <PaymentMethodDoughnut breakdown={data.payMethodUsedBreakdown ?? []} />
          </div>
        </motion.div>
      </div>

      {/* Daily Bar Chart */}
      <motion.div
        className="rounded-2xl border border-gray-100 text-white bg-[#1B1F24] backdrop-blur p-5 shadow-sm mt-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.08 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Daily Totals (Bar)</h3>
          <span className="text-xs text-gray-500">{lastWeekTransactions.length} transactions</span>
        </div>
        <div className="h-72">
          <DailySpendBar recentTransactions={lastWeekTransactions} currency={currency} />
        </div>
      </motion.div>

      {/* Recent Transactions Dropdown */}
      <div className="rounded-2xl border border-gray-200 bg-white/90 backdrop-blur p-5 mt-4 shadow-sm">
        <button
          onClick={() => setShowRecent(!showRecent)}
          className="w-full flex justify-between items-center font-medium text-gray-700 mb-2"
        >
          <span>Recent Transactions</span>
          <span className="text-gray-500">{showRecent ? "▲" : "▼"}</span>
        </button>
        {showRecent && (
          <RecentTransactionsList items={lastWeekTransactions.slice(0, 5)} currency={currency} />
        )}
      </div>
    </div>
  );
}
