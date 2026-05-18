import React, { useState } from "react";

// ================== CONSTANTS (Replace later with API data) ==================
const TOTAL_AMOUNT = 50000;
const DEFAULT_INSTALLMENTS = 3;
const MAX_INSTALLMENTS = 6; // 🔁 from DB later

// ================== DTO / API PLACEHOLDERS ==================
const API = {
  saveInstallments: async (payload) => {
    console.log("SAVE API", payload);
  },
  sendWhatsAppReminder: async (payload) => {
    console.log("WHATSAPP REMINDER", payload);
  }
};

const generateInstallments = (total, count) => {
  const base = Math.floor(total / count);
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    dueDate: new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    amount: i === count - 1 ? total - base * (count - 1) : base,
    paid: 0,
  }));
};

export default function CostComponent() {
  const [totalAmount] = useState(TOTAL_AMOUNT);
  const [installments, setInstallments] = useState(
    generateInstallments(TOTAL_AMOUNT, DEFAULT_INSTALLMENTS)
  );

  const totalPaid = installments.reduce((sum, i) => sum + i.paid, 0);
  const pending = totalAmount - totalPaid;

  const updateInstallment = (id, field, value) => {
    setInstallments((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  // ✅ Partial Payment
  const payAmount = (id, value) => {
    if (!value || value <= 0) return;
    setInstallments((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const newPaid = Math.min(i.amount, i.paid + value);
        return { ...i, paid: newPaid };
      })
    );
  };

  // ✅ Pay Full Remaining
  const payFullRemaining = () => {
    const today = new Date().toISOString().split("T")[0];
    const paidInstallments = installments.filter(i => i.paid >= i.amount);
    const remainingAmount = totalAmount - totalPaid;

    if (remainingAmount <= 0) return;

    const finalInstallment = {
      id: Date.now(),
      dueDate: today,
      amount: remainingAmount,
      paid: remainingAmount,
    };

    setInstallments([...paidInstallments, finalInstallment]);
  };

  // ✅ Add Installment with auto split
  const addInstallment = () => {
    if (installments.length >= MAX_INSTALLMENTS) {
      alert("Max installments reached");
      return;
    }

    const remaining = totalAmount - totalPaid;
    const unpaid = installments.filter(i => i.paid < i.amount);

    if (remaining <= 0) return;

    const splitAmount = Math.floor(remaining / (unpaid.length + 1));

    const updated = installments.map(i => {
      if (i.paid < i.amount) {
        return { ...i, amount: splitAmount };
      }
      return i;
    });

    const newInstallment = {
      id: Date.now(),
      dueDate: new Date().toISOString().split("T")[0],
      amount: remaining - splitAmount * unpaid.length,
      paid: 0,
    };

    setInstallments([...updated, newInstallment]);
  };

  // ✅ Remove Installment
  const removeInstallment = (id) => {
    setInstallments(prev => prev.filter(i => i.id !== id));
  };

  const getStatus = (i) => {
    if (i.paid >= i.amount) return "Paid";
    const today = new Date().toISOString().split("T")[0];
    if (i.dueDate < today) return "Overdue";
    return "Due";
  };

  // ✅ WhatsApp Reminder Trigger
  const sendReminder = (i) => {
    API.sendWhatsAppReminder({
      installmentId: i.id,
      dueDate: i.dueDate,
      amount: i.amount
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Cost Component</h2>

      {/* Summary */}
      <div className="flex gap-6 mb-6">
        <div className="p-4 bg-gray-100 rounded-xl">
          <div>Total Amount</div>
          <div className="text-xl font-semibold">₹{totalAmount}</div>
        </div>
        <div className="p-4 bg-gray-100 rounded-xl">
          <div>Paid</div>
          <div className="text-xl font-semibold">₹{totalPaid}</div>
        </div>
        <div className="p-4 bg-gray-100 rounded-xl">
          <div>Pending</div>
          <div className="text-xl font-semibold">₹{pending}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-4">
        <button onClick={payFullRemaining} className="px-4 py-2 bg-green-600 text-white rounded-lg">
          Pay Full Remaining
        </button>

        <button onClick={addInstallment} className="px-4 py-2 bg-purple-600 text-white rounded-lg">
          + Add Installment
        </button>
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th>ID</th>
            <th>Due Date</th>
            <th>Amount</th>
            <th>Paid</th>
            <th>Pay</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {installments.map((i) => (
            <tr key={i.id} className="text-center border-t">
              <td>{i.id}</td>
              <td>
                <input type="date" value={i.dueDate}
                  onChange={(e) => updateInstallment(i.id, "dueDate", e.target.value)} />
              </td>
              <td>
                <input type="number" value={i.amount}
                  onChange={(e) => updateInstallment(i.id, "amount", Number(e.target.value))} />
              </td>
              <td>₹{i.paid}</td>
              <td>
                <input type="number" placeholder="Enter amount"
                  onBlur={(e) => payAmount(i.id, Number(e.target.value))} />
              </td>
              <td>{getStatus(i)}</td>
              <td className="flex gap-2 justify-center">
                <button onClick={() => payAmount(i.id, i.amount - i.paid)} className="px-2 py-1 bg-blue-500 text-white rounded">
                  Pay Full
                </button>
                <button onClick={() => removeInstallment(i.id)} className="px-2 py-1 bg-red-500 text-white rounded">
                  Delete
                </button>
                <button onClick={() => sendReminder(i)} className="px-2 py-1 bg-yellow-500 text-white rounded">
                  Remind
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
