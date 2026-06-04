import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("All");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // Add expense
  const handleAdd = () => {
    if (!amount || !date) return;

    const newExpense = {
      id: Date.now(),
      amount,
      category,
      date,
      note,
    };

    setExpenses([...expenses, newExpense]);

    setAmount("");
    setCategory("Food");
    setDate("");
    setNote("");
  };

  // Delete expense
  const handleDelete = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // Filter expenses
  const filteredExpenses =
    filter === "All"
      ? expenses
      : expenses.filter((e) => e.category === filter);

  // Total
  const total = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  // Category total
  const getTotal = (cat) =>
    expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + Number(e.amount), 0);

  // Chart data
  const chartData = {
    labels: ["Food", "Travel", "Bills", "Others"],
    datasets: [
      {
        data: [
          getTotal("Food"),
          getTotal("Travel"),
          getTotal("Bills"),
          getTotal("Others"),
        ],
        backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">

      {/* FORM */}
      <div className="bg-white p-5 rounded-xl shadow-md w-96">

        <h1 className="text-xl font-bold text-center mb-4">
          ➕ Expense Tracker
        </h1>

        {/* FILTER */}
        <select
          className="border p-2 w-full mb-3 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Food</option>
          <option>Travel</option>
          <option>Bills</option>
          <option>Others</option>
        </select>

        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          className="border p-2 w-full mb-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Bills</option>
          <option>Others</option>
        </select>

        <input
          type="date"
          className="border p-2 w-full mb-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Enter Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button
          onClick={handleAdd}
          className="bg-green-500 text-white w-full p-2 rounded hover:bg-green-600"
        >
          Add Expense
        </button>
      </div>

      {/* TOTAL */}
      <div className="mt-4 text-lg font-bold">
        💰 Total Spend: ₹{total}
      </div>

      {/* CHART (BIGGER VERSION) */}
      <div className="bg-white mt-4 p-4 rounded shadow w-72 h-72 flex items-center justify-center">
        <div className="w-60 h-60">
          <Pie
            data={chartData}
            options={{
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>

      {/* LIST */}
      <div className="mt-6 w-96">
        <h2 className="font-bold mb-2">Expenses List</h2>

        {filteredExpenses.length === 0 ? (
          <p className="text-gray-500">No expenses found 😌</p>
        ) : (
          filteredExpenses.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3 mb-2 rounded shadow"
            >
              <p>💰 Amount: {item.amount}</p>
              <p>📂 Category: {item.category}</p>
              <p>📅 Date: {item.date}</p>
              <p>📝 Note: {item.note}</p>

              <button
                onClick={() => handleDelete(item.id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default App;