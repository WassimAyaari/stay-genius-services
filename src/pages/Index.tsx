
import React, { Suspense } from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import MainServicesSection from '@/components/home/MainServicesSection';
import FeaturedExperienceSection from '@/components/home/FeaturedExperienceSection';
import EventsStories from '@/components/EventsStories';
import TodayHighlightsSection from '@/components/home/TodayHighlightsSection';
import AdditionalServicesSection from '@/components/home/AdditionalServicesSection';
import AssistanceSection from '@/components/home/AssistanceSection';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Custom error boundary fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="p-6 border-2 border-red-300 rounded-md bg-red-50 m-4">
    <h2 className="text-xl font-bold text-red-800 mb-2">Something went wrong:</h2>
    <p className="text-red-600 mb-4">{error.message}</p>
    <button 
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
    >
      Try again
    </button>
  </div>
);

// Error boundary component
class SectionErrorBoundary extends React.Component<
  { children: React.ReactNode; id: string },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; id: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in section ${this.props.id}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error!} resetErrorBoundary={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}

const SectionWrapper = ({ children, id }: { children: React.ReactNode; id: string }) => {
  return (
    <div id={id} className="section-container">
      <SectionErrorBoundary id={id}>
        {children}
      </SectionErrorBoundary>
    </div>
  );
};

const Index = () => {
  console.log("Index page rendering started");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="pb-20">
        {/* Hero Section */}
        <SectionWrapper id="hero-section">
          <Suspense fallback={<div className="p-6 text-center">Loading hero section...</div>}>
            <HeroSection />
            
            {/* Bouton de connexion si l'utilisateur n'est pas authentifié */}
            {!isAuthenticated && (
              <div className="text-center my-6">
                <p className="text-lg mb-4">Connectez-vous pour accéder à tous les services de l'hôtel</p>
                <Button 
                  variant="default" 
                  size="lg" 
                  onClick={() => navigate('/auth/login')}
                  className="mx-auto"
                >
                  Se connecter
                </Button>
              </div>
            )}
          </Suspense>
        </SectionWrapper>

        {/* Main Services Section */}
        <SectionWrapper id="main-services">
          <Suspense fallback={<div className="p-6 text-center">Loading services...</div>}>
            <MainServicesSection />
          </Suspense>
        </SectionWrapper>

        {/* Featured Experience */}
        <SectionWrapper id="featured-experience">
          <Suspense fallback={<div className="p-6 text-center">Loading experiences...</div>}>
            <FeaturedExperienceSection />
          </Suspense>
        </SectionWrapper>

        {/* Instagram-style Stories Section */}
        <SectionWrapper id="events-stories">
          <Suspense fallback={<div className="p-6 text-center">Loading events...</div>}>
            <section className="px-6 mb-10">
              <EventsStories />
            </section>
          </Suspense>
        </SectionWrapper>

        {/* Today's Highlights Section */}
        <SectionWrapper id="highlights">
          <Suspense fallback={<div className="p-6 text-center">Loading highlights...</div>}>
            <TodayHighlightsSection />
          </Suspense>
        </SectionWrapper>

        {/* Additional Services */}
        <SectionWrapper id="additional-services">
          <Suspense fallback={<div className="p-6 text-center">Loading services...</div>}>
            <AdditionalServicesSection />
          </Suspense>
        </SectionWrapper>

        {/* Need Assistance */}
        <SectionWrapper id="assistance">
          <Suspense fallback={<div className="p-6 text-center">Loading assistance section...</div>}>
            <AssistanceSection />
          </Suspense>
        </SectionWrapper>
      </div>
    </Layout>
  );
};

export default Index;
