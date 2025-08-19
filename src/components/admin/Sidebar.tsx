import React from 'react';
import { 
  FaChartLine, FaBriefcase, FaCode, FaUser, 
  FaLaptopCode, FaBlog, FaCogs, FaSignOutAlt 
} from 'react-icons/fa';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isSidebarOpen, 
  setIsSidebarOpen 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaChartLine /> },
    { id: 'experience', label: 'Experience', icon: <FaBriefcase /> },
    { id: 'skills', label: 'Skills', icon: <FaCode /> },
    { id: 'about', label: 'About', icon: <FaUser /> },
    { id: 'projects', label: 'Projects', icon: <FaLaptopCode /> },
    { id: 'blogs', label: 'Blogs', icon: <FaBlog /> },
    { id: 'services', label: 'Services', icon: <FaCogs /> },
  ];

  return (
    <div className={`bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white transition-all duration-300 flex flex-col h-full ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-5 flex justify-between items-center border-b border-white/10">
        {isSidebarOpen && <h1 className="text-xl font-bold">Portfolio Admin</h1>}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {isSidebarOpen ? 
            <span className="text-xl">◀</span> : 
            <span className="text-xl">▶</span>
          }
        </button>
      </div>
      
      <nav className="mt-6 flex-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 w-full p-4 transition-colors ${
              activeTab === item.id 
                ? 'bg-white/10 text-white' 
                : 'hover:bg-white/5 text-gray-300'
            }`}
          >
            <span className={`text-lg ${activeTab === item.id ? 'text-blue-400' : 'text-gray-400'}`}>
              {item.icon}
            </span>
            {isSidebarOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/10 transition-colors text-gray-300">
          <FaSignOutAlt className="text-lg" />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;