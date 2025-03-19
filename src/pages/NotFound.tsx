
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-xl text-gray-600 mb-6">
            Oops! Page non trouvée
          </p>
          <div className="flex flex-col items-center gap-2">
            <Button asChild variant="outline">
              <Link to="/" className="flex items-center gap-2">
                <ChevronLeft size={16} />
                Retour à l'accueil
              </Link>
            </Button>
            <Button asChild variant="link">
              <Link to="/admin/hotels" className="text-blue-500 hover:text-blue-700">
                Gestion des hôtels
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
