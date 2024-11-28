import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store'; // Import typed hooks
import { UserCircle, Users, Calendar, Target, Heading1, Clock } from 'lucide-react';
import { fetchStudents } from '@/store/slices/instructorSlice';
import type { RootState } from '@/store';

export default function InstructorDashboard() {
  const dispatch = useAppDispatch();
  const { students, isLoading } = useAppSelector(
    (state: RootState) => state.instructor
  );
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    dispatch(fetchStudents());

    const timer = setTimeout(() => {
      if (isLoading) {
        setLoadingTimeout(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  if (isLoading && !loadingTimeout) {
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
          Instructor Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Manage your students and track their progress
        </p>
      </div>

      {students.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {students.map((student) => (
            <div key={student.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-4 mb-4">
                <UserCircle className="h-12 w-12 text-belgian-yellow" />
                <div>
                  <h3 className="text-xl font-semibold text-belgian-black">
                    {student.name}
                  </h3>
                  <p className="text-sm text-gray-500">{student.socialId}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-belgian-yellow" />
                    <span className="text-gray-600">Practice Hours</span>
                  </div>
                  <span className="font-medium">
                    {student.progress.practiceHours}h
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-belgian-yellow" />
                    <span className="text-gray-600">Sessions</span>
                  </div>
                  <span className="font-medium">
                    {student.progress.completedSessions}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-belgian-yellow" />
                    <span className="text-gray-600">Average Rating</span>
                  </div>
                  <span className="font-medium">
                    {student.progress.averageRating.toFixed(1)}/5
                  </span>
                </div>
              </div>

              <button className="mt-6 w-full bg-belgian-yellow text-belgian-black py-2 rounded-md font-medium hover:bg-opacity-90">
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-xl font-semibold text-belgian-black mb-2">
            You don't have any Students
          </h1>
          <p className="text-gray-600">Add one now !</p>
        </div>
      )}
    </div>
  );
}
