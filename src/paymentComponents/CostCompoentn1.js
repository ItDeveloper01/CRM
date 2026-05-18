import React, { useState } from "react";
import jsPDF from "jspdf";

const MAX_INSTALLMENTS = 6;

// 🔤 Number to words
const numberToWords = (num) => {
  if (num === 0) return "Zero only";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const convert = (n) => {
    let str = "";
    if (n >= 100) { str += ones[Math.floor(n/100)] + " Hundred "; n%=100; }
    if (n >= 20) { str += tens[Math.floor(n/10)] + " "; n%=10; }
    if (n > 0) str += ones[n] + " ";
    return str.trim();
  };

  let res = "";
  if (num >= 100000) { res += convert(Math.floor(num/100000)) + " Lakh "; num%=100000; }
  if (num >= 1000) { res += convert(Math.floor(num/1000)) + " Thousand "; num%=1000; }
  if (num > 0) res += convert(num);

  return res.trim() + " only";
};

const generateInstallments = (total, count) => {
  const base = Math.floor(total / count);
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    amount: i === count - 1 ? total - base * (count - 1) : base,
    paid: 0,
    history: []
  }));
};

// ================== COMPONENTS ==================

const Controls = ({ base, setBase, discount, setDiscount, isPercent, setIsPercent, count, setCount, regenerate, finalAmount }) => (
  <div className="grid grid-cols-4 gap-4 mb-6">
    <input type="number" value={base} onChange={e=>setBase(Number(e.target.value))} placeholder="Base Amount" className="border p-1" />
    <div>
      <input type="number" value={discount} onChange={e=>setDiscount(Number(e.target.value))} placeholder="Discount" className="border p-1 w-full" />
      <label className="text-xs"><input type="checkbox" checked={isPercent} onChange={()=>setIsPercent(!isPercent)} /> %</label>
    </div>
    <input type="number" value={count} min={1} max={MAX_INSTALLMENTS}
      onChange={e=>{
        const v = Number(e.target.value);
        setCount(v);
        regenerate(v, finalAmount);
      }} className="border p-1" />
    <button onClick={()=>regenerate(count, finalAmount)} className="bg-purple-600 text-white">Generate</button>
  </div>
);

const SummaryPanel = ({ base, discountAmt, final, pending, closed }) => (
  <div className="grid grid-cols-2 gap-4 mb-6">
    <div className="p-3 bg-gray-100">
      <div>Total: ₹{base}</div>
      <div>Discount: ₹{discountAmt}</div>
      <div>Payable: ₹{final}</div>
      <div>Pending: ₹{pending}</div>
      <div>Status: {closed ? "Closed" : "Open"}</div>
    </div>
    <div className="p-3 bg-yellow-50 text-sm">
      <div>{numberToWords(base)}</div>
      <div>{numberToWords(discountAmt)}</div>
      <div>{numberToWords(final)}</div>
      <div>{numberToWords(pending)}</div>
    </div>
  </div>
);

const InstallmentTable = ({ data, pay, markPaid }) => {
  const progress = (i) => Math.round((i.paid / i.amount) * 100);

  return (
    <table className="w-full border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th>ID</th><th>Amount</th><th>Paid</th><th>%</th><th>Remaining</th><th>Pay</th><th>✔</th>
        </tr>
      </thead>
      <tbody>
        {data.map(i => (
          <tr key={i.id} className="text-center border-t">
            <td>{i.id}</td>
            <td>₹{i.amount}</td>
            <td>₹{i.paid}</td>
            <td>{progress(i)}%</td>
            <td>₹{i.amount - i.paid}</td>
            <td>
              <input type="number" disabled={i.paid>=i.amount}
                onBlur={(e)=>pay(i.id, Number(e.target.value))} />
            </td>
            <td>
              <input type="checkbox" checked={i.paid>=i.amount}
                onChange={()=>markPaid(i.id)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Invoice = ({ visible, data, total, discount, payable }) => {
  if (!visible) return null;

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("INVOICE", 90, 10);
    doc.text("Company: Girikand", 10, 20);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 26);

    doc.text(`Total: ₹${total}`, 10, 40);
    doc.text(`Discount: ₹${discount}`, 10, 46);
    doc.text(`Payable: ₹${payable}`, 10, 52);
    doc.text(numberToWords(payable), 10, 60);

    let y = 75;
    data.forEach(i => {
      doc.text(`Inst ${i.id}: ${i.paid}/${i.amount}`, 10, y);
      y += 6;
    });

    doc.save("invoice.pdf");
  };

  return (
    <div className="mt-6 p-4 border">
      <h2 className="text-lg font-bold">Invoice</h2>
      <div>Total: ₹{total}</div>
      <div>Discount: ₹{discount}</div>
      <div>Payable: ₹{payable}</div>
      <div>{numberToWords(payable)}</div>

      <button onClick={downloadPDF} className="mt-3 px-3 py-1 bg-green-600 text-white">
        Download PDF
      </button>
    </div>
  );
};

// ================== MAIN ==================
export default function CostComponent() {
  const [base, setBase] = useState(50000);
  const [discount, setDiscount] = useState(0);
  const [isPercent, setIsPercent] = useState(false);
  const [count, setCount] = useState(3);

  const discountAmt = isPercent ? (base * discount) / 100 : discount;
  const finalAmount = base - discountAmt;

  const [installments, setInstallments] = useState(generateInstallments(finalAmount, count));

  const totalPaid = installments.reduce((s,i)=>s+i.paid,0);
  const pending = finalAmount - totalPaid;
  const isClosed = pending === 0;

  const regenerate = (c,a)=> setInstallments(generateInstallments(a,c));

  const pay = (id,val)=>{
    if(!val) return;

    setInstallments(prev=>{
      const updated = prev.map(i=>
        i.id===id ? {...i, paid: Math.min(i.amount, i.paid+val)} : i
      );

      const currentIndex = updated.findIndex(i=>i.id===id);
      const totalPaidNow = updated.reduce((s,i)=>s+i.paid,0);
      const remaining = finalAmount - totalPaidNow;

      const future = updated.filter((_,idx)=> idx>currentIndex && _.paid < _.amount);

      if(future.length === 0){
        if(remaining > 0){
          const today = new Date().toISOString().split("T")[0];
          const newInstallment = {
            id: Date.now(),
            dueDate: today,
            amount: remaining,
            paid: 0,
            history: []
          };
          return [...updated, newInstallment];
        }
        return updated;
      }

      const split = Math.floor(remaining / future.length);

      return updated.map((i,idx)=>{
        if(idx > currentIndex && i.paid < i.amount){
          return {
            ...i,
            amount: idx === updated.length - 1
              ? remaining - split * (future.length - 1)
              : split
          };
        }
        return i;
      });
    });
  };

  const markPaid = (id)=>{
    setInstallments(p=>p.map(i=> i.id===id ? {...i, paid:i.amount} : i));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Cost Component</h2>

      <Controls base={base} setBase={setBase} discount={discount} setDiscount={setDiscount}
        isPercent={isPercent} setIsPercent={setIsPercent}
        count={count} setCount={setCount}
        regenerate={regenerate} finalAmount={finalAmount}
      />

      <SummaryPanel base={base} discountAmt={discountAmt} final={finalAmount} pending={pending} closed={isClosed} />

      {!isClosed && (
        <InstallmentTable data={installments} pay={pay} markPaid={markPaid} />
      )}

      <Invoice visible={isClosed} data={installments} total={base} discount={discountAmt} payable={finalAmount} />
    </div>
  );
}
