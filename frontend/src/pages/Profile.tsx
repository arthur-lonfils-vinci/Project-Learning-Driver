import { useSelector } from 'react-redux';
import { UserCircle, Mail, Award } from 'lucide-react';
import type { RootState } from '@/store';

export default function Profile() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-belgian-black px-6 py-12 text-center">
            <UserCircle className="h-24 w-24 text-belgian-yellow mx-auto" />
            <h1 className="mt-4 text-2xl font-bold text-white">
              {user.name}
            </h1>
            <p className="mt-1 text-gray-300">
              {user.role === 'STUDENT' ? 'Student Driver' : 'Driving Instructor'}
            </p>
          </div>

          <div className="px-6 py-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-belgian-yellow" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              {user.role === 'STUDENT' && user.profileType && (
                <div className="flex items-center space-x-4">
                  <Award className="h-6 w-6 text-belgian-yellow" />
                  <div>
                    <p className="text-sm text-gray-500">Experience Level</p>
                    <p className="font-medium">{user.profileType}</p>
                  </div>
                </div>
              )}

              {user.role === 'STUDENT' && user.socialId && (
                <div className="flex items-center space-x-4">
                  <UserCircle className="h-6 w-6 text-belgian-yellow" />
                  <div>
                    <p className="text-sm text-gray-500">Social ID</p>
                    <p className="font-medium">{user.socialId}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}