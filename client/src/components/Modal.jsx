export default function Modal({ title, onClose, children, wide = false }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div style={{
        position: 'relative', width: '100%', maxWidth: wide ? '720px' : '520px',
        backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '16px',
        boxShadow: '0 24px 48px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', maxHeight: '90vh',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #2a2a2a' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '18px', padding: '2px 6px', borderRadius: '6px' }}>✕</button>
        </div>
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}
