export interface Location {
  lat: number;
  lng: number;
}

export interface SpeedEvent {
  id: string;
  speed: number;
  speedLimit: number;
  location: Location;
  timestamp: string;
}

export interface SessionNote {
  id: string;
  content: string;
  timestamp: string;
}

export interface DrivingSession {
  id: string;
  studentId: string;
  instructorId?: string;
  startTime: string;
  endTime?: string;
  distance: number;
  weather: string;
  speedEvents: SpeedEvent[];
  notes: SessionNote[];
  rating?: number;
  route?: {
    startLocation: Location;
    endLocation: Location;
    waypoints: Location[];
  };
}

export interface JourneyState {
  activeSession: DrivingSession | null;
  sessions: DrivingSession[];
  isLoading: boolean;
  error: string | null;
}