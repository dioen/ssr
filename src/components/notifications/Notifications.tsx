import { useNotification } from '../../contexts/use-notification/useNotification';
import { NotificationItem } from './notification-item/NotificationItem';

export const Notifications = () => {
  const { notifications } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};
