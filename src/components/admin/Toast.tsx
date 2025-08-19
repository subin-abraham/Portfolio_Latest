import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500';
  const textColor = type === 'success' ? 'text-green-700' : 'text-red-700';
  const icon = type === 'success' ? <FaCheckCircle className="text-green-500 text-xl" /> : <FaTimesCircle className="text-red-500 text-xl" />;

  return (
    <div className={`fixed top-4 right-4 z-50 border-l-4 ${bgColor} ${textColor} p-4 rounded-lg shadow-lg max-w-xs flex items-start transition-all duration-300 animate-fadeIn`}>
      <div className="mr-3">{icon}</div>
      <div className="flex-1">
        <p className="font-medium">{type === 'success' ? 'Success!' : 'Error!'}</p>
        <p className="text-sm">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default Toast;