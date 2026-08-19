import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

let toastCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const remove = useCallback((id) => {
    setToasts(prev => prev.map(t => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  const show = useCallback((message, type = 'info', title = '') => {
    const id = ++toastCounter;
    setToasts(prev => [...prev, { id, message, type, title, leaving: false }]);
    timers.current[id] = setTimeout(() => remove(id), 4000);
  }, [remove]);

  const api = {
    success: (msg, title = 'Success') => show(msg, 'success', title),
    error: (msg, title = 'Error') => show(msg, 'error', title),
    warning: (msg, title = 'Warning') => show(msg, 'warning', title),
    info: (msg, title = 'Notification') => show(msg, 'info', title)
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-container">
        {toasts.map(t => {
          const color = t.type === 'success' ? '#22C55E' : t.type === 'error' ? '#EF4444' : t.type === 'warning' ? '#F59E0B' : '#3B82F6';
          const icon = t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : t.type === 'warning' ? '⚠' : 'ℹ';
          return (
            <div key={t.id} className={`toast-item${t.leaving ? ' leaving' : ''}`} style={{ borderLeft: `4px solid ${color}` }}>
              <div className="toast-icon" style={{ color }}>{icon}</div>
              <div className="toast-body">
                {t.title && <div className="toast-title">{t.title}</div>}
                <div className="toast-message">{t.message}</div>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
