import React, { useState } from "react";

const AboutUs = () => {
  // State for managing the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-4">
      {/* Logo Section */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 bg-white p-8 rounded-lg shadow-md w-full max-w-6xl mb-12">
        <img
          src="assets/OMSLOGO.png"
          alt="OMS Logo"
          className="h-20 lg:h-32"
        />
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-bold text-[#8736EA] mb-4">About OMS</h1>
          <p className="text-gray-600 mb-6">
            OMS (Organizational Management System) is a platform dedicated to
            fostering collaboration, growth, and innovation within communities
            and organizations. It offers tools to manage members, events, and
            resources, aiming to simplify processes and create meaningful
            connections. With a focus on inclusivity, integrity, and making a
            positive impact, OMS strives to empower individuals and
            organizations to achieve their goals together.
          </p>
          <a
            href="/learnmore"
            className="text-white bg-[#8736EA] px-6 py-2 rounded-md hover:bg-purple-700"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="w-full text-center py-12 px-4 lg:px-16">
        <h2 className="text-3xl font-bold text-purple mb-8">Output Task</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
        >
          Open Contact Form
        </button>
      </div>

      {/* Modal Component */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>

            {/* Modal Title */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Us</h3>

            {/* Form */}
            <form className="space-y-4">
              {/* Time Range Selection */}
              <div>
                <label className="block text-gray-700 mb-2">Start Time</label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">End Time</label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              {/* Person Assigned */}
              <div>
                <label className="block text-gray-700 mb-2">Person Assigned</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Enter name"
                />
              </div>

              {/* Brief Description */}
              <div>
                <label className="block text-gray-700 mb-2">Brief Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Enter description"
                ></textarea>
              </div>

              {/* Other Notes */}
              <div>
                <label className="block text-gray-700 mb-2">Other Notes</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Additional notes"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUs;
