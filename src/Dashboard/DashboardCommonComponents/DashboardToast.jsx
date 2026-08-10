import React from "react";

const DashboardToast = ({ message }) => {

    if (!message)
        return null;

    return (

        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
            {message}
        </div>

    );

};

export default DashboardToast;