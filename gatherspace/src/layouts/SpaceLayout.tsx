import { Box, Container } from '@chakra-ui/react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useCallback, useRef } from 'react';
import Navbar from '../components/common/Navbar';
import SpaceManager from '../components/space/SpaceManager';
import CreateSpace from '../components/space/CreateSpace';
import JoinSpace from '../components/space/JoinSpace';
import AdminDashboard from '../components/admin/AdminDashboard';
import SpaceView from '../components/game/SpaceView';
import { useAuthStore } from '../store/useAuthStore';

const DEBOUNCE_DELAY = 300; // milliseconds

const SpaceLayout = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const lastNavigationTime = useRef(0);

  const handleNavigation = useCallback((targetPath: string) => {
    const now = Date.now();
    if (now - lastNavigationTime.current < DEBOUNCE_DELAY) {
      return; // Debounce navigation
    }
    lastNavigationTime.current = now;
    navigate(targetPath, { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (!user) {
      handleNavigation('/auth/signin');
    }
  }, [user, handleNavigation]);

  if (!user) {
    return null;
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <Routes>
          <Route path="/" element={<SpaceManager />} />
          <Route path="/create" element={<CreateSpace />} />
          <Route path="/join" element={<JoinSpace />} />
          <Route path="/:spaceId" element={<SpaceView />} />
          {user.role === 'Admin' && (
            <Route path="/admin" element={<AdminDashboard />} />
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default SpaceLayout;
