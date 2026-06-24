import { useState } from "react";
import NotificationCard from "../../components/notification/NotificationCard.jsx";
import Button from "../../components/common/Button.jsx";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  const filtered = notifications.filter((n) => filter === "unread" ? !n.read : true);

  const markRead = (notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <div className="flex gap-3">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white">
            <option value="all" className="bg-navy">All</option>
            <option value="unread" className="bg-navy">Unread</option>
          </select>
          <Button size="sm" variant="outline" onClick={markAllRead}>Mark all read</Button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((n) => (
            <NotificationCard key={n.id} notification={n} onMarkRead={markRead} />
          ))
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-sm text-gray-400">
            No notifications are available yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
