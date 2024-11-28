import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import SettingsIcon from "@mui/icons-material/Settings";

const OfficerSidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-gray-100 shadow-lg flex flex-col">
      {/* Sidebar Title with Logo */}
      <div className="p-6 bg-gray-100 flex justify-center items-center">
        <img src="/assets/OMSLOGO.png" alt="OMS Logo" className="h-12 mt-4" /> 
      </div>

      {/* Navigation */}
      <nav className="flex-grow mt-4">
        <a
          href="#"
          className="flex items-center px-6 py-3 text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors"
        >
          <img src="/assets/komsai.png" alt="Komsai" className="h-6" />
          <span className="ml-3 text-md font-medium">Komsai.Org</span>
        </a>

        {/* Reuse code if more than one org */}


        <hr className="my-4 border-gray-300" />

        <a
          href="#"
          className="flex items-center px-6 py-3 text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors"
        >
          <InfoIcon />
          <span className="ml-3 text-md font-medium">Information</span>
        </a>

        <a
          href="#"
          className="flex items-center px-6 py-3 text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors"
        >
          <SettingsIcon />
          <span className="ml-3 text-md font-medium">Profile Settings</span>
        </a>
      </nav>

      {/* Footer */}
      <div className="p-4 text-sm text-gray-500 border-t border-gray-300">
        © 2024 OMS Platform
      </div>
    </aside>
  );
};

export default OfficerSidebar;
