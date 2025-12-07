import React from 'react';
import {
  Notification,
  useNotification,
} from '../../../contexts/use-notification/useNotification';

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const { removeNotification } = useNotification();

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`${getBgColor(notification.type)} text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-between animate-slide-in shrink-1`}
    >
      <span>{notification.message}</span>

      <button
        onClick={() => removeNotification(notification.id)}
        className="ml-4 text-white hover:text-gray-200"
      >
        &#x0078;
      </button>
    </div>
  );
};
