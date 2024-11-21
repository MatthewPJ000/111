// components/Notification.tsx
import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  onClose: () => void;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // Duration in milliseconds
}

const Notification: React.FC<NotificationProps> = ({ message,type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [onClose, duration]);

    const getAlertColor = () => {
      switch (type) {
        case 'success':
          return 'bg-green-100 border-green-500 text-green-700';
        case 'error':
          return 'bg-red-100 border-red-500 text-red-700';
        case 'warning':
          return 'bg-yellow-100 border-yellow-500 text-yellow-700';
        default:
          return 'bg-blue-100 border-blue-500 text-blue-700';
      }
    };

  return (
    <div className={`flex items-center border-l-4 p-4 z-21 mb-4 rounded ${getAlertColor()}`}
    role="alert">
      {message}
      <button
        onClick={onClose}
        className="ml-4 text-lg font-bold text-black/80 hover:text-black transition transform hover:scale-110"
      >
        &times;
      </button>
    </div>
  );
};

export default Notification;
