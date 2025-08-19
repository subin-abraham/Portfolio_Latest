import React from 'react';
import { FaSearch, FaBars } from 'react-icons/fa';

interface DashboardHeaderProps {
  activeTab: string;
  toggleSidebar: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ activeTab, toggleSidebar }) => {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'about': return 'About Section';
      default: return `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management`;
    }
  };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <FaBars className="text-gray-600 text-xl" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">{getTitle()}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white md:w-64"
          />
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center text-white font-semibold">
          A
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;