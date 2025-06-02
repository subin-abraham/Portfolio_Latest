import React from 'react';
import { X } from 'lucide-react';

const WarningModal = ({ visible, onClose, title, message, buttonLabel = 'Close', icon }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 max-w-sm w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-yellow-700 hover:text-yellow-900"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-yellow-800">
          <div className="mb-4">
            {icon ? (
              icon
            ) : (
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M4.93 4.93a10 10 0 0114.14 0 10 10 0 010 14.14 10 10 0 01-14.14 0 10 10 0 010-14.14z"
                />
              </svg>
            )}
          </div>
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          <p className="text-center">{message}</p>
          <button
            onClick={onClose}
            className="mt-6 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-md hover:bg-yellow-500 transition"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
