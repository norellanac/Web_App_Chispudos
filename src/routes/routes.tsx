import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import ProtectedRoutesWrapper from '../components/molecules/ProtectedRoutesWrapper';
import { LoginPage } from '../features/auth/components/pages/LoginPage';
import { LandingPage } from '../features/landing/components/pages/LandingPage';
import { HomePage } from '../features/home/components/pages/HomePage';
import { SearchServicesPage } from '../features/Services/components/pages/SearchServicesPage';
import { ServiceDetailPage } from '../features/Services/components/pages/ServiceDetailPage';
import { TaskDetailsPage } from '../features/Services/components/pages/TaskDetailsPage';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectAuth } from '../redux/slices/authSlice';
import { selectBranding } from '../redux/slices/brandingSlice';
import PasswordRecovery from '../features/auth/components/pages/PasswordRecovery';
import RegisterPage from '../features/auth/components/pages/RegisterPage';
import ErrorPage from '../components/organisms/ErrorPage';
import { BusinessStepper } from '../features/Business/Components/pages/BusinessStepperPage';
import ErrorBoundaryWrapper from '../components/Generics/ErrorBoundaryWrapper';
import { TasksPage } from '../features/tasks/components/pages/TaskPage';
import { FavoritesPage } from '../features/favorites/components/pages/FavoritesPage';
import { ProfilePage } from '../features/profile/components/pages/ProfilePage';
import BusinessProfilePage from '../features/Business/Components/Organisms/BusinessProfile';
import ChatsComponent from '../features/Business/Components/Organisms/ChatsComponent';

const AppRoutes = () => {
  const { isAuthenticated } = useAppSelector(selectAuth);
  const { config } = useAppSelector(selectBranding);
  const tasksEnabled = !config || config.features.tasksEnabled;
  const chatEnabled = !config || config.features.chatEnabled;

  return (
    <div>
      <Router>
        <ErrorBoundaryWrapper>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/home" /> : <LoginPage />
              }
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/password-recovery" element={<PasswordRecovery />} />

            {/* Publicly accessible pages (FIX) */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/search-services" element={<SearchServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoutesWrapper />}>
              <Route path="/service-details" element={<TaskDetailsPage />} />
              <Route path="/addProduct" element={<BusinessStepper />} />
              <Route path="/profile" element={<ProfilePage />} />
              {tasksEnabled && <Route path="/tasks" element={<TasksPage />} />}
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/myProducts" element={<BusinessProfilePage />} />
              {chatEnabled && <Route path="/messages" element={<ChatsComponent />} />}
              {chatEnabled && <Route path="/messages/:chatId" element={<ChatsComponent />} />}
            </Route>

            {/* Error Page */}
            <Route path="*" element={<ErrorPage errorCode="404" />} />
          </Routes>
        </ErrorBoundaryWrapper>
      </Router>
    </div>
  );
};

export default AppRoutes;
