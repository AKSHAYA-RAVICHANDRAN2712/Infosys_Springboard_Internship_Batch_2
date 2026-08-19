import { createContext, useContext, useState, useCallback } from 'react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null); // { title, content }

  const open = useCallback((title, content) => {
    setModal({ title, content });
  }, []);

  const close = useCallback(() => setModal(null), []);

  return (
    <ModalContext.Provider value={{ open, close, isOpen: !!modal }}>
      {children}
      <div className={`modal-overlay${modal ? ' active' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        {modal && (
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16, marginBottom: 20 }}>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.25rem' }}>{modal.title}</h3>
              <button onClick={close} style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
            </div>
            <div>{modal.content}</div>
          </div>
        )}
      </div>
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}
