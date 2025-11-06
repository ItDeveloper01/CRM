import axios from "axios";
import { useEffect, useState } from "react";
import config from "./config";
import {useGetSessionUser} from  "./SessionContext"
import { Trash2 } from "lucide-react";
import { useMessageBox } from "./Notification"; 
import { MESSAGE_TYPES, BannerMessages, ApiEndpoints } from "./Constants";

function AppreciationBannerAdmin() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { user: sessionUser } = useGetSessionUser();
  const [messages, setMessages] = useState([]);
  const { showMessage } = useMessageBox();


//userId: sessionUser.user.userId
useEffect (() => {
  const fetchMessages = async () => {
    debugger;
    setLoading(true);
    try {
      const apiStr = config.apiUrl + ApiEndpoints.GET_USER_MESSAGES_FOR_DELETE;
      const response = await axios.get(apiStr, {
        params: { userId: sessionUser.user.userId },
      });
      debugger
      setMessages(response.data);
      console.log("Fetched messages:", response.data);
      debugger;
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchMessages();
}, []);


  const handleDelete = async (messageToDelete) => {
    //const messageToDelete = messages[index];
debugger;
    console.log("Deleting message:", messageToDelete);
    if (!messageToDelete) return;

    

    setLoading(true);
    try {
      const deleteUrl = config.apiUrl + ApiEndpoints.DELETE_MESSAGE;

      await axios.post(deleteUrl, messageToDelete, {
        headers: { "Content-Type": "application/json" },
               });

     // showMessage("Message deleted successfully!", MESSAGE_TYPES.INFO);

      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageToDelete.id)
      );

      // Show success message
      showMessage(BannerMessages.DELETE_SUCCESS, MESSAGE_TYPES.INFO);

    } catch (error) {
      console.error("Error deleting message:", error);
      showMessage(BannerMessages.DELETE_FAIL, MESSAGE_TYPES.ERROR);
    } finally {
      setLoading(false);
    }
  };


  const sendMessage = async () => {
    if (!text.trim()) {
      showMessage(BannerMessages.EMPTY_MESSAGE_ERROR, MESSAGE_TYPES.ERROR);
      return;
    }

    setLoading(true);
    try {
      debugger;
      const apiStr = config.apiUrl + ApiEndpoints.POST_MESSAGE;
      await axios.post(
        apiStr,
        { message: text ,
          UserId: sessionUser.user.userId
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      showMessage(BannerMessages.BROADCAST_SUCCESS, MESSAGE_TYPES.INFO);
      setText(""); // clear textarea

    } catch (error) {

      console.error("Error sending message:", error);
      showMessage(BannerMessages.SEND_FAIL, MESSAGE_TYPES.ERROR);

    } finally {

      setLoading(false);
      
    }
  };

  return (
    <div>
    <div className="p-4 bg-white shadow rounded-md max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-3">Send Appreciation Message</h2>

      <textarea
        className="border border-gray-300 p-2 w-full rounded-md focus:ring focus:ring-blue-100"
        rows="3"
        placeholder="Type appreciation message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />

      <button
        onClick={sendMessage}
        className={`bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Appreciation"}
      </button>
    </div>
   <div className="flex justify-center mt-10">
      <div className="w-full max-w-3xl bg-white rounded-xl border border-blue-100 shadow-md p-5">
        <h2 className="text-lg font-semibold mb-4 text-blue-800 border-b-2 border-blue-300 pb-1 text-center">
          Sent Messages
        </h2>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm text-gray-700 border-collapse">
            <thead className="bg-blue-50 text-blue-700">
              <tr>
                <th className="py-2 px-4 text-left font-medium border-b border-blue-100">#</th>
                <th className="py-2 px-4 text-left font-medium border-b border-blue-100">Message</th>
                <th className="py-2 px-4 text-left font-medium border-b border-blue-100">Date</th>
                <th className="py-2 px-4 text-center font-medium border-b border-blue-100">Action</th>
              </tr>
            </thead>

            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="py-4 px-4 text-center text-gray-500 italic"
                  >
                    No messages found.
                  </td>
                </tr>
              ) : (
                messages.map((msg, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{msg.message}</td>
                    <td className="py-2 px-4 text-gray-600 text-sm">
                      {new Date(msg.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => handleDelete(msg)}
                        className="text-blue-600 hover:text-red-600 transition-colors"
                        title="Delete message"
                      >
                        <Trash2 size={16} strokeWidth={1.6} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>


    </div>
  );
}

export default AppreciationBannerAdmin;
