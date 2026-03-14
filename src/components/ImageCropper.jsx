import React, { useState } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../lib/cropImage'
import { X, Check, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import './ImageCropper.css'

const ImageCropper = ({ image, onCropComplete, onCancel, circular = true }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropChange = (crop) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom) => {
    setZoom(zoom)
  }

  const onCropCompleteInternal = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleDone = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation)
      onCropComplete(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="cropper-overlay">
      <div className="cropper-container">
        <div className="cropper-header">
          <h3>Crop Image</h3>
          <button className="close-cropper" onClick={onCancel}>
            <X size={24} />
          </button>
        </div>

        <div className="cropper-body">
          <div className="crop-area-container">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1 / 1}
              cropShape={circular ? 'round' : 'rect'}
              showGrid={true}
              onCropChange={onCropChange}
              onCropComplete={onCropCompleteInternal}
              onZoomChange={onZoomChange}
            />
          </div>
        </div>

        <div className="cropper-controls">
          <div className="control-group">
            <ZoomOut size={18} />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="zoom-range"
            />
            <ZoomIn size={18} />
          </div>

          <div className="control-group">
            <RotateCcw size={18} />
            <input
              type="range"
              value={rotation}
              min={0}
              max={360}
              step={1}
              aria-labelledby="Rotation"
              onChange={(e) => setRotation(Number(e.target.value))}
              className="rotation-range"
            />
          </div>
        </div>

        <div className="cropper-footer">
          <button className="cropper-btn cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="cropper-btn confirm" onClick={handleDone}>
            <Check size={18} />
            Crop & Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageCropper
