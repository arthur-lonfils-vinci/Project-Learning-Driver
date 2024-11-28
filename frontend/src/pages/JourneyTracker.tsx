import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store'; // Import typed hooks
import { Car, MapPin, Clock, Cloud } from 'lucide-react';
import { startSession, endSession } from '@/store/slices/journeySlice';
import type { RootState } from '@/store';
import type { Location } from '@/types/journey';

export default function JourneyTracker() {
  const dispatch = useAppDispatch();
  const { activeSession, isLoading } = useAppSelector(
    (state: RootState) => state.journey
  );
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleStartSession = () => {
    if (currentLocation) {
      dispatch(startSession(currentLocation));
    }
  };

  const handleEndSession = () => {
    if (activeSession && currentLocation) {
      dispatch(endSession({ 
        sessionId: activeSession.id, 
        endLocation: currentLocation 
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-belgian-yellow" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-belgian-black mb-4">
          Journey Tracker
        </h1>
        <p className="text-xl text-gray-600">
          Record and monitor your driving sessions
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {activeSession ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Clock className="h-6 w-6 text-belgian-yellow" />
                <div>
                  <p className="text-sm text-gray-500">Started</p>
                  <p className="font-medium">
                    {new Date(activeSession.startTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Cloud className="h-6 w-6 text-belgian-yellow" />
                <div>
                  <p className="text-sm text-gray-500">Weather</p>
                  <p className="font-medium">{activeSession.weather}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleEndSession}
              className="w-full bg-belgian-red text-white py-3 rounded-md font-medium hover:bg-opacity-90"
            >
              End Session
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Car className="h-16 w-16 text-belgian-yellow mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-belgian-black mb-2">
              Ready to start driving?
            </h3>
            <p className="text-gray-600 mb-6">
              Click the button below to begin recording your journey
            </p>
            <button
              onClick={handleStartSession}
              disabled={!currentLocation}
              className="bg-belgian-yellow text-belgian-black px-6 py-3 rounded-md font-medium hover:bg-opacity-90 disabled:opacity-50"
            >
              Start Session
            </button>
            {!currentLocation && (
              <p className="text-sm text-red-600 mt-2">
                Please enable location services to start a session
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}