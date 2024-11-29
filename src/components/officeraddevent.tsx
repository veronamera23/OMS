import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import CloseIcon from "@mui/icons-material/Close";

interface OfficerAddEventProps {
  close: () => void;
}
const OfficerAddEvent: React.FC<OfficerAddEventProps> = ({ close }) => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventPrice, setEventPrice] = useState("");
  const [eventImages, setEventImages] = useState<File[]>([]);
  const [isOpenForAll, setIsOpenForAll] = useState(true);
  const [isFree, setIsFree] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEventImages([...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "events"), {
        eventName,
        eventDate: new Date(eventDate),
        eventDescription,
        eventPrice: isFree ? 0 : parseFloat(eventPrice),
        isOpenForAll,
      });

      console.log("Event added successfully!");
      alert("Event added successfully!");
      close();
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center left-[18%] z-40"
      style={{ backgroundColor: "rgba(128, 128, 128, 0.5)" }}
    >
      <div
        className="bg-white p-6 rounded-lg w-full max-w-3xl shadow-xl relative"
        style={{ backgroundColor: "#f9f9f9" }}
      >
        {/* Close Button */}
        <button
          onClick={close}
          className="absolute top-2 right-2 p-2 rounded-md hover:bg-purple-200 hover:text-white transition duration-200"
          style={{ backgroundColor: "#e8e8e8" }}
        >
          <CloseIcon className="h-5 w-5 text-[#8736EA]" />
        </button>

        <h2
          className="text-2xl font-semibold mb-4 text-center"
          style={{ color: "#8736EA" }}
        >
          Add New Event
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium"
                style={{ color: "#8736EA" }}
              >
                Event Image
              </label>
              <div 
                className="mt-2 w-full h-32 border-2 border-dashed rounded-md border-gray-300 flex justify-center items-center hover:bg-purple-300 cursor-pointer" 
              >
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="eventImageInput"
                />
                <label htmlFor="eventImageInput" className="cursor-pointer w-full h-full flex justify-center items-center">
                  <span
                    className="text-gray-500"
                    style={{ color: "#666699" }}
                  >
                    Click to upload image
                  </span>
                </label>
              </div>
            </div>

            <div>
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: "#8736EA" }}
                >
                  Event Name
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="mt-2 block w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500"
                  style={{ borderColor: "#cccccc" }}
                  required
                />
              </div>
              <div className="mt-4">
                <label
                  className="block text-sm font-medium"
                  style={{ color: "#8736EA" }}
                >
                  Event Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="mt-2 block w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500"
                  style={{ borderColor: "#cccccc" }}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium"
              style={{ color: "#8736EA" }}
            >
              Event Description
            </label>
            <textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              className="mt-2 block w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500"
              style={{ borderColor: "#cccccc" }}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium"
                style={{ color: "#8736EA" }}
              >
                Event Price (PHP)
              </label>
              <div className="mt-2 relative">
                <input
                  type="number"
                  value={eventPrice}
                  onChange={(e) => setEventPrice(e.target.value)}
                  className="mt-2 block w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500"
                  style={{ borderColor: "#cccccc" }}
                  min="0"
                  required={!isFree}
                  disabled={isFree}
                />
                <label className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-purple-600"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-500">
                    Free
                  </span>
                </label>
              </div>
            </div>
            <div>
              <label
                className="block text-sm font-medium"
                style={{ color: "#8736EA" }}
              >
                Open For
              </label>
              <select
                value={isOpenForAll ? "all" : "members"}
                onChange={(e) => setIsOpenForAll(e.target.value === "all")}
                className="mt-2 block w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500"
                style={{ borderColor: "#cccccc" }}
              >
                <option value="all">Open for All</option>
                <option value="members">Members Only</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="mt-4 bg-[#8736EA] text-white px-6 py-2 rounded-md shadow-md hover:bg-purple-700 transition duration-200 w-full"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfficerAddEvent;