import React, { useState, useEffect } from 'react';
import { Upload, Play, Pause, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TRANSITION_EFFECTS = {
  fade: {
    name: 'Fade',
    className: 'transition-opacity duration-500 ease-in-out'
  },
  slideLeft: {
    name: 'Slide Left',
    className: 'animate-slideLeft'
  },
  slideRight: {
    name: 'Slide Right',
    className: 'animate-slideRight'
  },
  zoomIn: {
    name: 'Zoom In',
    className: 'animate-zoomIn'
  },
  zoomOut: {
    name: 'Zoom Out',
    className: 'animate-zoomOut'
  },
  panLeft: {
    name: 'Pan Left',
    className: 'animate-panLeft'
  },
  panRight: {
    name: 'Pan Right',
    className: 'animate-panRight'
  },
  rotateIn: {
    name: 'Rotate In',
    className: 'animate-rotateIn'
  }
};

const PhotoMontage = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transitionSpeed, setTransitionSpeed] = useState(3000);
  const [selectedEffect, setSelectedEffect] = useState('fade');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Custom styles for animations
  const style = `
    @keyframes slideLeft {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @keyframes slideRight {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }
    @keyframes zoomIn {
      from { transform: scale(0.5); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @keyframes zoomOut {
      from { transform: scale(1.5); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @keyframes panLeft {
      from { transform: translateX(0); }
      to { transform: translateX(-10%); }
    }
    @keyframes panRight {
      from { transform: translateX(-10%); }
      to { transform: translateX(0); }
    }
    @keyframes rotateIn {
      from { transform: rotate(-180deg) scale(0.5); opacity: 0; }
      to { transform: rotate(0) scale(1); opacity: 1; }
    }
    .animate-slideLeft { animation: slideLeft 500ms ease-out; }
    .animate-slideRight { animation: slideRight 500ms ease-out; }
    .animate-zoomIn { animation: zoomIn 500ms ease-out; }
    .animate-zoomOut { animation: zoomOut 500ms ease-out; }
    .animate-panLeft { animation: panLeft 8s linear infinite; }
    .animate-panRight { animation: panRight 8s linear infinite; }
    .animate-rotateIn { animation: rotateIn 500ms ease-out; }
  `;

  // Handle file selection
  const handleFileSelect = (event: any) => {
    const files: File[] = Array.from(event.target.files);
    const imageFiles = files.filter((file: File) => file.type.startsWith('image/'));
    
    const filePromises = imageFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target!.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(results => {
      setPhotos(prevPhotos => [...prevPhotos, ...results] as any);
      if (!isPlaying && currentPhotoIndex === 0) {
        setIsPlaying(true);
      }
    });
  };

  // Handle playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && photos.length > 0) {
      interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentPhotoIndex(prev => 
            prev === photos.length - 1 ? 0 : prev + 1
          );
          setIsTransitioning(false);
        }, 500);
      }, transitionSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, photos.length, transitionSpeed]);

  // Reset montage
  const handleReset = () => {
    setPhotos([]);
    setCurrentPhotoIndex(0);
    setIsPlaying(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <style>{style}</style>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Photo Montage Creator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Photo display area */}
          <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
            {photos.length > 0 ? (
              <img 
                src={photos[currentPhotoIndex]}
                alt={`Photo ${currentPhotoIndex + 1}`}
                className={`w-full h-full object-cover ${TRANSITION_EFFECTS[selectedEffect as keyof typeof TRANSITION_EFFECTS].className}`}
                key={currentPhotoIndex} // Force re-render for animations
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Upload photos to begin
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  <Upload size={20} />
                  Add Photos
                </div>
              </label>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                disabled={photos.length === 0}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={photos.length === 0}
              >
                <RefreshCw size={20} />
                Reset
              </button>
            </div>

            {/* Progress indicator */}
            <div className="text-sm text-gray-600">
              {photos.length > 0 ? `${currentPhotoIndex + 1} / ${photos.length}` : '0 / 0'}
            </div>
          </div>

          {/* Transition controls */}
          <div className="space-y-4">
            {/* Speed control */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 min-w-24">Speed:</span>
              <input
                type="range"
                min="1000"
                max="5000"
                step="500"
                value={transitionSpeed}
                onChange={(e) => setTransitionSpeed(Number(e.target.value))}
                className="w-48"
              />
              <span className="text-sm text-gray-600 min-w-16">{transitionSpeed/1000}s</span>
            </div>

            {/* Effect selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 min-w-24">Effect:</span>
              <select
                value={selectedEffect}
                onChange={(e) => setSelectedEffect(e.target.value)}
                className="w-48 p-2 border rounded-md"
              >
                {Object.entries(TRANSITION_EFFECTS).map(([key, effect]) => (
                  <option key={key} value={key}>
                    {effect.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoMontage;