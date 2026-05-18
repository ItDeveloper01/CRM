// import React, { useState, useEffect } from "react";

// const FINAL_DATE = new Date(new Date().setDate(new Date().getDate() + 60));

// const numberToWords = (num) => {
//   if (num === 0) return "Zero only";
//   const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
//     "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
//   const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

//   const convert = (n) => {
//     let str = "";
//     if (n >= 100) { str += ones[Math.floor(n/100)] + " Hundred "; n%=100; }
//     if (n >= 20) { str += tens[Math.floor(n/10)] + " "; n%=10; }
//     if (n > 0) str += ones[n] + " ";
//     return str.trim();
//   };

//   let res = "";
//   if (num >= 100000) { res += convert(Math.floor(num/100000)) + " Lakh "; num%=100000; }
//   if (num >= 1000) { res += convert(Math.floor(num/1000)) + " Thousand "; num%=1000; }
//   if (num > 0) res += convert(num);

//   return res.trim() + " only";
// };

// const generateInstallments = (total, count) => {
//   const base = Math.floor(total / count);
//   const today = new Date();
//   const gap = Math.floor((FINAL_DATE - today) / count);

//   return Array.from({ length: count }, (_, i) => ({
//     id: i + 1,
//     dueDate: new Date(today.getTime() + gap * (i + 1)).toISOString().split("T")[0],
//     amount: i === count - 1 ? total - base * (count - 1) : base,
//     paid: 0,
//     mode: "Cash",
//     history: []
//   }));
// };

// const InstallmentTable = ({ data, pay, markPaid, remove, updateDate, updateMode }) => {
//   const progress = (i) => Math.round((i.paid / i.amount) * 100);

//   return (
//     <table className="w-full text-base border rounded-2xl overflow-hidden shadow-lg">
//       <thead className="bg-slate-700 text-white text-lg">
//         <tr>
//           <th>ID</th><th>Date</th><th>Amount</th><th>Paid</th><th>%</th><th>Remaining</th><th>Pay</th><th>Mode</th><th>✔</th><th>❌</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map(i => (
//           <tr key={i.id} className="text-center border-t hover:bg-gray-50 h-14">
//             <td>{i.id}</td>
//             <td>
//               <input type="date" value={i.dueDate}
//                 onChange={(e)=>updateDate(i.id, e.target.value)} />
//             </td>
//             <td title={numberToWords(i.amount)} className="font-semibold">₹{i.amount}</td>
//             <td>₹{i.paid}</td>
//             <td>{progress(i)}%</td>
//             <td>₹{i.amount - i.paid}</td>
//             <td>
//               <input type="number" disabled={i.paid>=i.amount}
//                 className="border px-2 py-1 w-24 rounded"
//                 onBlur={(e)=>pay(i.id, Number(e.target.value))} />
//             </td>
//             <td>
//               <select value={i.mode} onChange={(e)=>updateMode(i.id, e.target.value)} className="border">
//                 <option>Cash</option>
//                 <option>UPI</option>
//                 <option>Card</option>
//               </select>
//             </td>
//             <td>
//               <input type="checkbox" checked={i.paid>=i.amount}
//                 onChange={()=>markPaid(i.id)} />
//             </td>
//             <td>
//               {i.paid === 0 && (
//                 <button className="text-red-500" onClick={()=>remove(i.id)}>Delete</button>
//               )}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default function CostComponent() {
//   const [base, setBase] = useState(50000);
//   const [discount, setDiscount] = useState(0);
//   const [isPercent, setIsPercent] = useState(false);
//   const [count, setCount] = useState(3);
//   const [manuallyClosed, setManuallyClosed] = useState(false);

//   const discountAmt = isPercent ? (base * discount) / 100 : discount;
//   const finalAmount = base - discountAmt;

//   const [installments, setInstallments] = useState(generateInstallments(finalAmount, count));

//   useEffect(()=>{
//     setInstallments(generateInstallments(finalAmount, count));
//   }, [finalAmount, count]);

//   const totalPaid = installments.reduce((s,i)=>s+i.paid,0);
//   const pending = finalAmount - totalPaid;
//   const isClosed = manuallyClosed;

//   const pay = (id,val)=>{
//     if(!val) return;

//     setInstallments(prev=>{
//       let updated = prev.map(i=>
//         i.id===id
//           ? {
//               ...i,
//               paid: Math.min(i.amount, i.paid+val),
//               history: [...i.history, { amt: val, date: new Date().toISOString().split("T")[0], mode: i.mode }]
//             }
//           : i
//       );

//       const totalPaidNow = updated.reduce((s,i)=>s+i.paid,0);
//       const remaining = finalAmount - totalPaidNow;

//       const hasPending = updated.some(i => i.paid < i.amount);

//       if(!hasPending && remaining > 0){
//         const today = new Date().toISOString().split("T")[0];
//         return [...updated, { id: Date.now(), dueDate: today, amount: remaining, paid: 0, mode:"Cash", history: [] }];
//       }

//       return updated;
//     });
//   };

//   const markPaid = (id)=>{
//     setInstallments(p=>p.map(i=> i.id===id ? {...i, paid:i.amount} : i));
//   };

//   const updateDate = (id, date)=>{
//     setInstallments(p=>p.map(i=> i.id===id ? {...i, dueDate: date} : i));
//   };

//   const updateMode = (id, mode)=>{
//     setInstallments(p=>p.map(i=> i.id===id ? {...i, mode} : i));
//   };

//   const remove = (id)=>{
//     setInstallments(prev=> prev.filter(i=>i.id!==id));
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4 text-slate-800">Cost Component</h2>

//       {/* Top Controls */}
//       <div className="grid grid-cols-4 gap-4 mb-6 border rounded-xl p-4 bg-white shadow-sm">
//         <input type="number" value={base} onChange={e=>setBase(Number(e.target.value))}
//           className="border p-2 rounded" placeholder="Total Amount" />

//         <div>
//           <input type="number" value={discount} onChange={e=>setDiscount(Number(e.target.value))}
//             className="border p-2 rounded w-full" placeholder="Discount" />
//           <label className="text-xs">
//             <input type="checkbox" checked={isPercent} onChange={()=>setIsPercent(!isPercent)} /> %
//           </label>
//         </div>

//         {/* Only installment count in lead form */}
//         <input type="number" value={count} onChange={e=>setCount(Number(e.target.value))}
//           className="border p-2 rounded" placeholder="No. of Installments" />
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-3 gap-4 mb-4">
//         <div className="bg-blue-100 p-4 rounded-xl shadow">
//           <div>Total</div>
//           <div className="text-xl font-bold">₹{base}</div>
//         </div>
//         <div className="bg-red-100 p-4 rounded-xl shadow">
//           <div>Discount</div>
//           <div className="text-xl font-bold">₹{discountAmt}</div>
//         </div>
//         <div className="bg-green-100 p-4 rounded-xl shadow">
//           <div>Payable</div>
//           <div className="text-xl font-bold">₹{finalAmount}</div>
//         </div>
//       </div>

//       {/* Summary Block */}
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <div className="bg-gray-100 p-3 rounded">
//           <div>Total: ₹{base}</div>
//           <div>Discount: ₹{discountAmt}</div>
//           <div>Payable: ₹{finalAmount}</div>
//           <div>Pending: ₹{pending}</div>
//           <div>Status: {isClosed ? "Closed" : "Open"}</div>
//         </div>
//         <div className="bg-yellow-50 p-3 text-sm rounded">
//           <div>{numberToWords(base)}</div>
//           <div>{numberToWords(discountAmt)}</div>
//           <div>{numberToWords(finalAmount)}</div>
//           <div>{numberToWords(pending)}</div>
//         </div>
//       </div>

//       {!isClosed && (
//         <>
//           <InstallmentTable
//             data={installments}
//             pay={pay}
//             markPaid={markPaid}
//             remove={remove}
//             updateDate={updateDate}
//             updateMode={updateMode}
//           />

//           {pending === 0 && (
//             <div className="mt-4 text-center">
//               <button
//                 className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow"
//                 onClick={()=>setManuallyClosed(true)}
//               >
//                 Close Deal
//               </button>
//             </div>
//           )}
//         </>
//       )}

//       {isClosed && (
//         <div className="mt-6 border rounded-2xl p-6 shadow-lg bg-white">
//           <div className="border-b pb-3 mb-4">
//           <h3 className="font-bold text-xl text-slate-800">Invoice</h3>
//           <div className="text-sm text-gray-500">Payment Summary</div>
//         </div>
//           <div className="mb-2">{numberToWords(finalAmount)}</div>

//           {installments.map(i => (
//             i.history.map((h, idx) => (
//               <div key={idx} className="grid grid-cols-4 gap-4 border-b py-2 text-sm">
//                 <span className="font-medium">Inst {i.id}</span>
//                 <span>₹{h.amt}</span>
//                 <span>{h.date}</span>
//                 <span className="text-slate-600">{h.mode}</span>
//               </div>
//             ))
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";

const FINAL_DATE = new Date(new Date().setDate(new Date().getDate() + 60));

// ---------------- UTIL ----------------
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

const getStatus = (i) => {
  const today = new Date().toISOString().split("T")[0];

  if (i.paid >= i.amount) return "Paid";

  if (i.paid > 0 && i.paid < i.amount) {
    if (i.dueDate < today) return "Overdue-Partial";
    return "Short"; // 🔥 Short Payment
  }

  if (i.dueDate < today) return "Overdue";

  return "Due";
};

// ---------------- GENERATOR ----------------
const generateInstallments = (total, count) => {
  const base = Math.floor(total / count);
  const today = new Date();
  const gap = Math.floor((FINAL_DATE - today) / count);

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    dueDate: new Date(today.getTime() + gap * (i + 1)).toISOString().split("T")[0],
    amount: i === count - 1 ? total - base * (count - 1) : base,
    paid: 0,
    mode: "Cash",
    history: []
  }));
};

// ---------------- COMPONENTS ----------------

const PaymentSummary = ({ base, discountAmt, finalAmount, pending, isClosed }) => (
  <>
    {/* KPI */}
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="bg-blue-100 p-4 rounded-xl shadow">
        <div>Total</div>
        <div className="text-xl font-bold">₹{base}</div>
      </div>
      <div className="bg-red-100 p-4 rounded-xl shadow">
        <div>Discount</div>
        <div className="text-xl font-bold">₹{discountAmt}</div>
      </div>
      <div className="bg-green-100 p-4 rounded-xl shadow">
        <div>Payable</div>
        <div className="text-xl font-bold">₹{finalAmount}</div>
      </div>
    </div>

    {/* Summary */}
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-gray-100 p-3 rounded">
        <div>Total: ₹{base}</div>
        <div>Discount: ₹{discountAmt}</div>
        <div>Payable: ₹{finalAmount}</div>
        <div>Pending: ₹{pending}</div>
        <div>Status: {isClosed ? "Closed" : "Open"}</div>
      </div>
      <div className="bg-yellow-50 p-3 text-sm rounded">
        <div>{numberToWords(base)}</div>
        <div>{numberToWords(discountAmt)}</div>
        <div>{numberToWords(finalAmount)}</div>
        <div>{numberToWords(pending)}</div>
      </div>
    </div>
  </>
);

const InstallmentPlanner = ({ data, pay, markPaid, remove, updateDate, updateMode, pending, setClosed }) => {
  const progress = (i) => Math.round((i.paid / i.amount) * 100);

  const safeDelete = (id, data) => {
    const remainingTotal = data.filter(i => i.id !== id).reduce((s,i)=>s+i.amount,0);
    const paidTotal = data.reduce((s,i)=>s+i.paid,0);

    if (remainingTotal < paidTotal) {
      alert("Cannot delete. Amount already distributed.");
      return false;
    }
    return true;
  };

  return (
    <>
      <table className="w-full text-base border rounded-2xl overflow-hidden shadow-lg">
        <thead className="bg-slate-700 text-white text-lg">
          <tr>
            <th>ID</th><th>Status</th><th>Date</th><th>Amount</th><th>Paid</th><th>%</th><th>Progress</th><th>Remaining</th><th>Pay</th><th>Mode</th><th>✔</th><th>❌</th>
          </tr>
        </thead>
        <tbody>
          {data.map(i => {
            const status = getStatus(i);
            return (
              <tr key={i.id} className="text-center border-t hover:bg-gray-50 h-14">
                <td>{i.id}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs ${
  status === "Paid"
    ? "bg-green-200 text-green-800"
    : status === "Overdue"
    ? "bg-red-200 text-red-800"
    : status === "Overdue-Partial"
    ? "bg-red-300 text-red-900"
    : status === "Short"
    ? "bg-orange-200 text-orange-800"
    : "bg-yellow-200 text-yellow-800"
}`}>
  {status === "Short" ? "Short Paid" : status === "Overdue-Partial" ? "Overdue (Partial)" : status}
</span>
                </td>
                <td>
                  <input type="date" value={i.dueDate}
                    onChange={(e)=>updateDate(i.id, e.target.value)} />
                </td>
                <td title={numberToWords(i.amount)} className="font-semibold">₹{i.amount}</td>
                <td>₹{i.paid}</td>
                <td>{progress(i)}%</td>
                <td>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div className="bg-green-500 h-2 rounded" style={{width: `${progress(i)}%`}} />
                  </div>
                </td>
                <td>₹{i.amount - i.paid}</td>
                <td>
                  <input type="number" disabled={i.paid>=i.amount}
                    className="border px-2 py-1 w-24 rounded"
                    onBlur={(e)=>pay(i.id, Number(e.target.value))} />
                </td>
                <td>
                  <select value={i.mode} onChange={(e)=>updateMode(i.id, e.target.value)} className="border">
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Card</option>
                  </select>
                </td>
                <td>
                  <input type="checkbox" checked={i.paid>=i.amount}
                    onChange={()=>markPaid(i.id)} />
                </td>
                <td>
                  {i.paid === 0 && (
                    <button className="text-red-500" onClick={()=> safeDelete(i.id, data) && remove(i.id)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {pending === 0 && (
        <div className="mt-4 text-center">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow"
            onClick={()=>setClosed(true)}
          >
            Close Deal
          </button>
        </div>
      )}
    </>
  );
};

const InvoiceView = ({ installments, finalAmount }) => {
  const totalPaid = installments.reduce((s,i)=>s+i.paid,0);

  return (
    <div className="mt-6 border rounded-2xl p-6 shadow-lg bg-white">
      <div className="border-b pb-3 mb-4">
        <h3 className="font-bold text-xl text-slate-800">Invoice</h3>
        <div className="text-sm text-gray-500">Payment Summary</div>
      </div>

      <div className="mb-2 font-medium">{numberToWords(finalAmount)}</div>

      <div className="grid grid-cols-4 gap-4 font-semibold border-b pb-2 mb-2">
        <span>Inst</span><span>Amount</span><span>Date</span><span>Mode</span>
      </div>

      {installments.map(i => (
        i.history.map((h, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-4 border-b py-2 text-sm">
            <span>Inst {i.id}</span>
            <span>₹{h.amt}</span>
            <span>{h.date}</span>
            <span>{h.mode}</span>
          </div>
        ))
      ))}

      <div className="mt-4 font-bold">Total Paid: ₹{totalPaid}</div>
    </div>
  );
};

// ---------------- MAIN ----------------
export default function CostComponent() {
  const [base, setBase] = useState(50000);
  const [discount, setDiscount] = useState(0);
  const [isPercent, setIsPercent] = useState(false);
  const [count, setCount] = useState(3);
  const [manuallyClosed, setManuallyClosed] = useState(false);

  const discountAmt = isPercent ? (base * discount) / 100 : discount;
  const finalAmount = base - discountAmt;

  const [installments, setInstallments] = useState(generateInstallments(finalAmount, count));

  useEffect(()=>{
    setInstallments(generateInstallments(finalAmount, count));
  }, [finalAmount, count]);

  const totalPaid = installments.reduce((s,i)=>s+i.paid,0);
  // 🔥 CRITICAL FIX: pending should be based on TOTAL INSTALLMENT AMOUNT (not just paid)
  const totalInstallmentAmount = installments.reduce((s,i)=>s+i.amount,0);
  const pending = totalInstallmentAmount - totalPaid;

  const pay = (id,val)=>{
    if(!val) return;

    setInstallments(prev=>{
      let updated = prev.map(i=>
        i.id===id
          ? {
              ...i,
              paid: Math.min(i.amount, i.paid+val),
              history: [...i.history, { amt: val, date: new Date().toISOString().split("T")[0], mode: i.mode }]
            }
          : i
      );

      const totalPaidNow = updated.reduce((s,i)=>s+i.paid,0);
      const remaining = finalAmount - totalPaidNow;

      const hasPending = updated.some(i => i.paid < i.amount);

      if(!hasPending && remaining > 0){
        const today = new Date().toISOString().split("T")[0];
        return [...updated, { id: Date.now(), dueDate: today, amount: remaining, paid: 0, mode:"Cash", history: [] }];
      }

      return updated;
    });
  };

  const markPaid = (id) => {
  setInstallments(prev => {
    let updated = [...prev];

    const index = updated.findIndex(i => i.id === id);
    const current = updated[index];

    // 🔥 DO NOT override paid amount
    const remainingThis = current.amount - current.paid;

    // If nothing pending in this installment → do nothing
    if (remainingThis <= 0) return updated;

    const future = updated.filter((_, idx) => idx > index);

    // 🔥 If no future installments → create new one
    if (future.length === 0) {
      const today = new Date().toISOString().split("T")[0];

      return [
        ...updated,
        {
          id: Date.now(),
          dueDate: today,
          amount: remainingThis,
          paid: 0,
          mode: "Cash",
          history: []
        }
      ];
    }

    // 🔥 Redistribute remaining to future installments
    const split = Math.floor(remainingThis / future.length);

    updated = updated.map((inst, idx) => {
      if (idx > index) {
        return {
          ...inst,
          amount:
            idx === updated.length - 1
              ? inst.amount + (remainingThis - split * (future.length - 1))
              : inst.amount + split
        };
      }
      return inst;
    });

    return updated;
  });
};

  const updateDate = (id, date)=>{
    setInstallments(p=>p.map(i=> i.id===id ? {...i, dueDate: date} : i));
  };

  const updateMode = (id, mode)=>{
    setInstallments(p=>p.map(i=> i.id===id ? {...i, mode} : i));
  };

  const remove = (id)=>{
    setInstallments(prev=> prev.filter(i=>i.id!==id));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">Cost Component</h2>

      {/* Top Controls */}
      <div className="grid grid-cols-4 gap-4 mb-6 border rounded-xl p-4 bg-white shadow-sm">
        <input type="number" value={base} onChange={e=>setBase(Number(e.target.value))}
          className="border p-2 rounded" placeholder="Total Amount" />

        <div>
          <input type="number" value={discount} onChange={e=>setDiscount(Number(e.target.value))}
            className="border p-2 rounded w-full" placeholder="Discount" />
          <label className="text-xs">
            <input type="checkbox" checked={isPercent} onChange={()=>setIsPercent(!isPercent)} /> %
          </label>
        </div>

        <input type="number" value={count} onChange={e=>setCount(Number(e.target.value))}
          className="border p-2 rounded" placeholder="No. of Installments" />
      </div>

      <PaymentSummary
        base={base}
        discountAmt={discountAmt}
        finalAmount={finalAmount}
        pending={pending}
        isClosed={manuallyClosed}
      />

      {!manuallyClosed && (
        <InstallmentPlanner
          data={installments}
          pay={pay}
          markPaid={markPaid}
          remove={remove}
          updateDate={updateDate}
          updateMode={updateMode}
          pending={pending}
          setClosed={setManuallyClosed}
        />
      )}

      {manuallyClosed && (
        <InvoiceView installments={installments} finalAmount={finalAmount} />
      )}
    </div>
  );
}

// ---------------- TEST CASES ----------------
// 1. Delete installment with paid amount → should block
// 2. Overdue installment should show red badge
// 3. Pending = 0 → Close button visible
// 4. Extra amount after last installment → new installment auto added
// 5. Invoice shows all payment history with date + mode
