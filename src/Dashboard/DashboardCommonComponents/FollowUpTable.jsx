import React from "react";

const FollowUpTable = ({ leads }) => {

    return (

        <div className="bg-white rounded-xl shadow-sm mt-6 overflow-hidden">

            <table className="min-w-full">

                <thead>

                    <tr className="bg-slate-100">

                        <th className="p-3 text-left">Customer</th>

                        <th className="p-3 text-left">Follow-up</th>

                        <th className="p-3 text-left">Status</th>

                        <th className="p-3 text-left">Executive</th>

                        <th className="p-3 text-left">Priority</th>

                    </tr>

                </thead>

                <tbody>

                    {leads.map((lead) => (

                        <tr
                            key={lead.id}
                            className="border-b hover:bg-slate-50"
                        >

                            <td className="p-3">

                                <div className="font-medium">

                                    {lead.customerName}

                                </div>

                                <div className="text-sm text-gray-500 mt-1">

                                    {lead.notes}

                                </div>

                            </td>

                            <td className="p-3">

                                {lead.followUpDate}

                            </td>

                            <td className="p-3">

                                {lead.status}

                            </td>

                            <td className="p-3">

                                {lead.executive}

                            </td>

                            <td className="p-3">

                                {lead.priority}

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

};

export default FollowUpTable;