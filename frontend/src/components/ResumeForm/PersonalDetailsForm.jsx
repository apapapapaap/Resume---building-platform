export default function PersonalDetailsForm({ data, setData, errors }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3>Personal Details</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>Full Name *</label>
        <input
          type="text"
          value={data.fullName || ''}
          onChange={(e) => setData({ ...data, fullName: e.target.value })}
          style={{ 
            width: '100%', 
            padding: '8px', 
            border: `1px solid ${errors.fullName ? 'red' : '#ccc'}`,
            borderRadius: '4px'
          }}
        />
        {errors.fullName && <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.fullName}</div>}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Email *</label>
        <input
          type="email"
          value={data.email || ''}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          style={{ 
            width: '100%', 
            padding: '8px', 
            border: `1px solid ${errors.email ? 'red' : '#ccc'}`,
            borderRadius: '4px'
          }}
        />
        {errors.email && <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.email}</div>}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Phone *</label>
        <input
          type="tel"
          value={data.phone || ''}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
          style={{ 
            width: '100%', 
            padding: '8px', 
            border: `1px solid ${errors.phone ? 'red' : '#ccc'}`,
            borderRadius: '4px'
          }}
        />
        {errors.phone && <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.phone}</div>}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Address</label>
        <input
          type="text"
          value={data.address || ''}
          onChange={(e) => setData({ ...data, address: e.target.value })}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Professional Summary</label>
        <textarea
          value={data.summary || ''}
          onChange={(e) => setData({ ...data, summary: e.target.value })}
          rows={4}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
    </div>
  );
}
