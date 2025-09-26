import React, { useState } from "react";
import { AiOutlineEdit, AiOutlineSave, AiOutlineClose } from "react-icons/ai";

const SMTPFormDemo = () => {
  const [smtp, setSmtp] = useState({
    senderEmailID: "",
    cryptoKey: "",
    supportEmailID: "",
    helpDeskEmailID: "",
    websiteLink: "",
    signature: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const [banner, setBanner] = useState({ message: "", type: "" });

  const toggleEdit = () => {
    setReadOnly(!readOnly);
    setOtp("");
    setOtpSent(false);
    setBanner({ message: "", type: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSmtp((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setOtpSent(true);
    setBanner({ message: "OTP sent to your registered mobile number.", type: "info" });
  };

  const handleVerifyAndSave = () => {
    if (otp === "1234") {
      setReadOnly(true);
      setOtp("");
      setOtpSent(false);
      setBanner({ message: "SMTP details saved successfully!", type: "success" });
    } else {
      setBanner({ message: "Incorrect OTP! Use 1234 for demo.", type: "error" });
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-start pt-10">
      <div className="bg-white rounded-lg shadow-md font-sans p-8 w-full max-w-2xl flex flex-col relative">
        <h2 className="text-2xl font-bold mb-6 text-center">SMTP Details (Demo)</h2>

        {/* Banner */}
        {banner.message && (
          <div
            className={`mb-4 p-3 rounded-md text-sm text-center ${
              banner.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : banner.type === "error"
                ? "bg-red-100 text-red-800 border border-red-300"
                : "bg-blue-100 text-blue-800 border border-blue-300"
            }`}
          >
            {banner.message}
          </div>
        )}

        {/* Edit Button inside form */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleEdit}
            className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md border ${
              readOnly ? "border-blue-400 text-blue-700" : "border-gray-400 text-gray-700"
            }`}
          >
            <AiOutlineEdit className="text-sm" />
            {readOnly ? "Edit" : "Disable"}
          </button>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Sender Email", name: "senderEmailID", type: "email" },
            { label: "Crypto Key / App Password", name: "cryptoKey", type: "text" },
            { label: "Support Email", name: "supportEmailID", type: "email" },
            { label: "Helpdesk Email", name: "helpDeskEmailID", type: "email" },
            { label: "Website Link", name: "websiteLink", type: "text" },
          ].map((field) => (
            <div className="flex flex-col" key={field.name}>
              <label className="font-semibold mb-1">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={smtp[field.name]}
                onChange={handleChange}
                disabled={readOnly}
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            </div>
          ))}

          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold mb-1">Signature</label>
            <textarea
              name="signature"
              value={smtp.signature}
              onChange={handleChange}
              disabled={readOnly}
              rows={4}
              className="px-4 py-2 border border-gray-300 rounded-md w-full"
              placeholder="Enter signature text"
            />
          </div>

          {/* OTP Input */}
          {!readOnly && otpSent && (
            <div className="flex flex-col md:col-span-2">
              <label className="font-semibold mb-1">OTP Verification</label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP sent to your mobile"
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>
          )}
        </div>

        {/* Save / Cancel Buttons */}
        {!readOnly && (
          <div className="flex gap-4 justify-center mt-6">
            {!otpSent ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-4 py-2 rounded-md border border-blue-400 text-blue-700 text-sm"
              >
                <AiOutlineSave className="text-sm" /> Save (Generate OTP)
              </button>
            ) : (
              <button
                onClick={handleVerifyAndSave}
                className="flex items-center gap-1 px-4 py-2 rounded-md border border-green-400 text-green-700 text-sm"
              >
                <AiOutlineSave className="text-sm" /> Verify & Save
              </button>
            )}
            <button
              onClick={() => setReadOnly(true)}
              className="flex items-center gap-1 px-4 py-2 rounded-md border border-red-400 text-red-700 text-sm"
            >
              <AiOutlineClose className="text-sm" /> Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SMTPFormDemo;
