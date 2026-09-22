import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { supabase } from '../lib/supabase';
import type { Notification } from '../lib/types';
import { useAuth } from './AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (
    userId: string,
    title: string,
    message: string,
    type: string,
    relatedJobId?: string,
  ) => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const NotificationContext = createContext<
  NotificationContextValue | undefined
>(undefined);

const POLL_INTERVAL_MS = 30_000; // 30 seconds

// ─── Provider ─────────────────────────────────────────────────────────────────

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Fetch ────────────────────────────────────────────────────────────────

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[NotificationContext] fetch error:', error.message);
      return;
    }

    setNotifications((data as Notification[]) ?? []);
  }, [user?.id]);

  // Initial fetch + polling
  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      return;
    }

    fetchNotifications();

    intervalRef.current = setInterval(fetchNotifications, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [user?.id, fetchNotifications]);

  // ─── Actions ──────────────────────────────────────────────────────────────

  const markAsRead = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read_status: true })
      .eq('id', id);

    if (error) {
      console.error('[NotificationContext] markAsRead error:', error.message);
      return;
    }

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_status: true } : n)),
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read_status: true })
      .eq('user_id', user.id)
      .eq('read_status', false);

    if (error) {
      console.error('[NotificationContext] markAllAsRead error:', error.message);
      return;
    }

    setNotifications((prev) => prev.map((n) => ({ ...n, read_status: true })));
  }, [user?.id]);

  const addNotification = useCallback(
    async (
      userId: string,
      title: string,
      message: string,
      type: string,
      relatedJobId?: string,
    ) => {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          type,
          related_job_id: relatedJobId ?? null,
          read_status: false,
        })
        .select()
        .single();

      if (error) {
        console.error(
          '[NotificationContext] addNotification error:',
          error.message,
        );
        return;
      }

      // Only append to local state if it belongs to the current user
      if (userId === user?.id && data) {
        setNotifications((prev) => [data as Notification, ...prev]);
      }
    },
    [user?.id],
  );

  // ─── Derived State ────────────────────────────────────────────────────────

  const unreadCount = notifications.filter((n) => !n.read_status).length;

  // ─── Context Value ────────────────────────────────────────────────────────

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      'useNotifications must be used within a <NotificationProvider>',
    );
  }
  return ctx;
}
