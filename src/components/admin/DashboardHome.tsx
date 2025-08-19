import React from 'react';
import DashboardCard from './DashboardCard';
import ActivityItem from './ActivityItem';
import { FaBriefcase, FaCode, FaLaptopCode, FaBlog, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

interface DashboardHomeProps {
  stats: {
    experiences: number;
    skills: number;
    projects: number;
    blogs: number;
  };
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ stats }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <DashboardCard 
        title="Experiences" 
        value={stats.experiences} 
        icon={<FaBriefcase className="text-blue-600 text-xl" />} 
        color="bg-blue-100" 
      />
      <DashboardCard 
        title="Skills" 
        value={stats.skills} 
        icon={<FaCode className="text-indigo-600 text-xl" />} 
        color="bg-indigo-100" 
      />
      <DashboardCard 
        title="Projects" 
        value={stats.projects} 
        icon={<FaLaptopCode className="text-green-600 text-xl" />} 
        color="bg-green-100" 
      />
      <DashboardCard 
        title="Blogs" 
        value={stats.blogs} 
        icon={<FaBlog className="text-amber-600 text-xl" />} 
        color="bg-amber-100" 
      />
    </div>
    
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        <ActivityItem 
          icon={<FaEdit className="text-blue-600" />} 
          title="Updated About Section" 
          time="2 hours ago" 
        />
        <ActivityItem 
          icon={<FaPlus className="text-green-600" />} 
          title="Added new project" 
          time="Yesterday" 
        />
        <ActivityItem 
          icon={<FaTrash className="text-red-600" />} 
          title="Removed outdated experience" 
          time="3 days ago" 
        />
      </div>
    </div>
  </div>
);

export default DashboardHome;