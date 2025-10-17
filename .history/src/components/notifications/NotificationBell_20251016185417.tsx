'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationBellProps {
  userId?: string;
  className?: string;
}

interface NotificationSummary {
  total: number;
  unread: number;
}

export function NotificationBell({ userId, className = '' }: NotificationBellProps) {
  const [summary, setSummary] = useState<NotificationSummary>({ total: 0, unread: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadSummary();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(loadSummary, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadSummary = async () => {
    try {
      const response = await fetch('/api/notifications?summary=true');
      const result = await response.json();

      if (result.success) {
        setSummary(result.data);
        
        // Show animation if there are new unread notifications
        if (result.data.unread > summary.unread && result.data.unread > 0) {
          setIsVisible(true);
          setTimeout(() => setIsVisible(false), 3000);
        }
      }
    } catch (error) {
      console.error('Error loading notification summary:', error);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={isVisible ? { scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <Bell className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
        
        {summary.unread > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
          >
            {summary.unread > 99 ? '99+' : summary.unread}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default NotificationBell;