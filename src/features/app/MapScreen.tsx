export default function MapScreen() {
  return (
    <div className="app-screen">
      <div className="app-header">
        <div className="app-header-row">
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Bản đồ trạm sạc</h2>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', flexDirection: 'column', gap: 16 }}>
        <span style={{ fontSize: 64 }}>🗺️</span>
        <h3 style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>Bản đồ trạm sạc</h3>
        <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Tính năng bản đồ đang được phát triển cho phiên bản Web</p>
        <div style={{ padding: '12px 24px', background: 'rgba(37,99,235,0.1)', borderRadius: 12, color: '#2563eb', fontWeight: 600, fontSize: 14 }}>
          Sắp ra mắt 🚀
        </div>
      </div>
    </div>
  );
}
