import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Car,
  Book,
  Map,
  Trophy,
  ArrowRight,
  Users,
  Clock,
  Shield,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import type { RootState } from '@/store';

export default function Home() {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2070"
            alt="Driving in Belgium"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-belgian-black/80 to-belgian-black/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Master Driving in Belgium with Confidence
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              Your comprehensive companion for learning to drive in Belgium.
              Track your progress, master road rules, and achieve your driving
              goals with our innovative platform.
            </p>
            <div className="flex flex-wrap gap-4">
              {!isAuthenticated ? (
                <>
                  <Button
                    as={Link}
                    to="/register"
                    className="text-lg px-8 py-3"
                  >
                    Get Started For FREE!
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline"
                    className="text-lg px-8 py-3 bg-white/10 text-white border-white hover:bg-white hover:text-belgian-black"
                  >
                    Sign In
                  </Button>
                </>
              ) : (
                <div className="flex gap-4">
                  <Button as={Link} to="/journey" className="text-lg px-8 py-3">
                    Start Driving
                    <Car className="ml-2 h-5 w-5" />
                  </Button>
                  {user?.role === 'INSTRUCTOR' && (
                    <Button
                      as={Link}
                      to="/instructor"
                      variant="outline"
                      className="text-lg px-8 py-3 bg-white/10 text-white border-white hover:bg-white hover:text-belgian-black"
                    >
                      Instructor Dashboard
                      <Users className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-belgian-black mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our comprehensive platform provides all the tools and resources you
            need to become a confident driver in Belgium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Book}
            title="Interactive Road Rules"
            description="Learn Belgian traffic rules and regulations through our comprehensive, multilingual guide."
            link="/rules"
          />
          <FeatureCard
            icon={Map}
            title="Journey Tracking"
            description="Record your driving sessions, track progress, and get real-time feedback on your performance."
            link="/journey"
          />
          <FeatureCard
            icon={Trophy}
            title="Achievement System"
            description="Earn achievements and track your progress as you develop your driving skills."
            link="/achievements"
          />
          <FeatureCard
            icon={Users}
            title="Instructor Connection"
            description="Connect with professional instructors or practice with family members."
          />
          <FeatureCard
            icon={Clock}
            title="Real-time Monitoring"
            description="Get instant feedback on speed, distance, and driving patterns during your sessions."
          />
          <FeatureCard
            icon={Shield}
            title="Safety First"
            description="Focus on developing safe driving habits with our comprehensive monitoring system."
          />
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-belgian-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <StatCard number="20k+" label="Active Users" />
            <StatCard number="500k+" label="Hours Tracked" />
            <StatCard number="1M+" label="Kilometers Driven" />
            <StatCard number="98%" label="Success Rate" />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-belgian-yellow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-belgian-black mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-belgian-black/80 max-w-xl">
                Join thousands of learners who have successfully mastered
                driving in Belgium with our comprehensive platform.
              </p>
            </div>
            {!isAuthenticated && (
              <Button
                as={Link}
                to="/register"
                variant="secondary"
                className="text-lg px-8 py-3 whitespace-nowrap"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  link,
}: {
  icon: typeof Book;
  title: string;
  description: string;
  link?: string;
}) {
  const content = (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="bg-belgian-yellow/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-belgian-yellow" />
      </div>
      <h3 className="text-xl font-semibold text-belgian-black mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }

  return content;
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-3xl lg:text-4xl font-bold text-belgian-yellow mb-2">
        {number}
      </div>
      <div className="text-gray-300">{label}</div>
    </div>
  );
}

/*
import { Link } from 'react-router-dom';
import { Car, Book, Trophy } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-belgian-black mb-4">
            Welcome to Belgian Driving
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your journey to becoming a confident driver starts here
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <FeatureCard
              icon={<Book className="h-12 w-12" />}
              title="Learn Road Rules"
              description="Study Belgian traffic rules and regulations with interactive lessons"
              link="/rules"
            />
            <FeatureCard
              icon={<Car className="h-12 w-12" />}
              title="Track Progress"
              description="Record your driving sessions and monitor your improvement"
              link="/journey"
            />
            <FeatureCard
              icon={<Trophy className="h-12 w-12" />}
              title="Earn Achievements"
              description="Complete milestones and collect achievements"
              link="/achievements"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, link }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <Link
      to={link}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="text-belgian-yellow mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-belgian-black mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}
*/
