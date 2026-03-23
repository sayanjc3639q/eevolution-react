import React from 'react'

const CropperStub = ({ image }) => (
  <div style={{ padding: '20px', textAlign: 'center', background: '#333', borderRadius: '8px' }}>
    <p>Loading Cropper Library...</p>
    <img src={image} style={{ maxWidth: '100%', maxHeight: '300px' }} alt="Preview" />
    <p style={{ fontSize: '12px', opacity: 0.6 }}>Please wait while the dependency finishes installing.</p>
  </div>
)

export default CropperStub
