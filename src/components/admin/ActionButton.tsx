import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  onClick, 
  icon, 
  label, 
  variant = 'primary',
  disabled = false
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md ${
        variants[variant]
      } ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
};

export default ActionButton;