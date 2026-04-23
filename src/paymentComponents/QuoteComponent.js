import React, { useState ,useEffect } from "react";

// --- Number to Words ---
const numberToWords = (num) => {
  if (!num) return "";

  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const inWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + " " + a[n % 10];
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred " + inWords(n % 100);
    if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand " + inWords(n % 1000);
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + " Lakh " + inWords(n % 100000);
    return inWords(Math.floor(n / 10000000)) + " Crore " + inWords(n % 10000000);
  };

  return inWords(Math.floor(num)) + " only";
};

export default function QuoteCalculator({
baseAmt = 0,
discountPct = 0,
discountAmt = 0,
finalAmt = 0,
onBaseChange,
onDiscountChange,
onFinalChange,
isViewMode = false,
}) {
  const [baseAmount, setBaseAmount] = useState(baseAmt);
  const [discountPercent, setDiscountPercent] = useState(discountPct);
  const [discountAmount, setDiscountAmount] = useState(discountAmt);
  const [finalAmount, setFinalAmount] = useState(finalAmt);
  const [lastEdited, setLastEdited] = useState(null);

  const [isInitialized, setIsInitialized] = useState(false);




  const clampDiscount = (base, discount) => (discount > base ? base : discount);

useEffect(() => {
  if (!isInitialized && baseAmount > 0 && discountAmount > 0) {
    const percent = (discountAmount / baseAmount) * 100;
    setDiscountPercent(Number(percent.toFixed(2)));
    setIsInitialized(true); // 🔥 ensures it runs only once
  }
}, [baseAmount, discountAmount, isInitialized]);

  const recalculate = (base, percent, amount, mode) => {
    base = parseFloat(base || 0);

    if (!base) {
      setFinalAmount(0);
      return;
    }

    if (mode === "percent") {
      let amt = (base * percent) / 100;
      amt = clampDiscount(base, amt);

      setDiscountAmount(Math.round(amt));
      setFinalAmount(Number((base - amt).toFixed(0)));
      debugger ;
      onDiscountChange && onDiscountChange(percent, amt);
      onFinalChange && onFinalChange(base - amt);
    }

    if (mode === "amount") {
      let amt = clampDiscount(base, amount);
      const pct = (amt / base) * 100;

      setDiscountAmount(Math.round(amt));
      setDiscountPercent(pct.toFixed(2));
      setFinalAmount(Number((base - amt).toFixed(0)));

      debugger; 
      onDiscountChange && onDiscountChange(pct, amt);
      onFinalChange && onFinalChange(base - amt);
    }
  };

  const handlePercentChange = (value) => {
    setLastEdited("percent");
    setDiscountPercent(value);

    const percent = parseFloat(value || 0);
    recalculate(baseAmount, percent, 0, "percent");
  };

  const handleAmountChange = (value) => {
    setLastEdited("amount");
    setDiscountAmount(value);

    const amount = parseFloat(value || 0);
    recalculate(baseAmount, 0, amount, "amount");
  };

  const handleBaseChange = (value) => {
    setBaseAmount(value);

    debugger;
    
    const base = parseFloat(value || 0);
    onBaseChange && onBaseChange(base);

    if (lastEdited === "percent") {
      recalculate(base, parseFloat(discountPercent || 0), 0, "percent");
    } else if (lastEdited === "amount") {
      recalculate(base, 0, parseFloat(discountAmount || 0), "amount");
    } else {
      setFinalAmount(base);
      onFinalChange && onFinalChange(base);
    }


  };

  const wordsBlock = (text) => (
    <p className="text-xs text-gray-500 mt-1 min-h-[16px]">{text || ""}</p>
  );

  return (
    <div className="p-4 border rounded-2xl shadow-md w-full">
      {/* <h3 className="text-lg font-semibold mb-4">Quote Calculator</h3> */}

      {/* RESPONSIVE LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Base */}
        <div className="w-full">
          <label className="block text-sm mb-1">Base Amount (₹)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={baseAmount}
            onChange={(e) => handleBaseChange(e.target.value)}
          />
          {wordsBlock(baseAmount ? numberToWords(Number(baseAmount)) : "")}
        </div>

        {/* Discount */}
        <div className="w-full">
          <label className="block text-sm mb-1">Discount</label>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-1 w-full">
              <span className="text-sm text-gray-600">%</span>
              <input
                type="number"
                step="0.01"
                className="w-full border p-2 rounded bg-green-50"
                value={discountPercent}
                onChange={(e) => handlePercentChange(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-1 w-full">
              <span className="text-sm text-gray-600">₹</span>
              <input
                type="number"
                
                className="w-full border p-2 rounded bg-green-50"
                value={discountAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
              />
            </div>
          </div>

          {wordsBlock("")}
        </div>

        {/* Final */}
        <div className="w-full">
          <label className="block text-sm mb-1">Final Amount</label>
          <div className="border p-2 rounded font-semibold text-green-600 w-full">
            ₹ {finalAmount}
          </div>
          {wordsBlock(finalAmount > 0 ? numberToWords(Number(finalAmount)) : "")}
        </div>

      </div>
    </div>
  );
}
