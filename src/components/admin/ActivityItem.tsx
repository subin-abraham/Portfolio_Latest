import React from 'react';

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, title, time }) => (
  <div className="flex items-start">
    <div className="p-2.5 bg-blue-50 rounded-xl mr-3">{icon}</div>
    <div>
      <p className="font-medium text-gray-800">{title}</p>
      <p className="text-gray-500 text-sm mt-1">{time}</p>
    </div>
  </div>
);

export default ActivityItem;