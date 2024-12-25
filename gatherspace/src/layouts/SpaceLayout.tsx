import { Box, Container } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import SpaceManager from "../components/space/SpaceManager";
import CreateSpace from "../components/space/CreateSpace";
import JoinSpace from "../components/space/JoinSpace";
import SpaceView from "../components/game/SpaceView";
import { useAuthStore } from "../store/useAuthStore";
import EditSpace from "../components/space/EditSpace";

const SpaceLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <Routes>
          <Route path="/edit-space/:spaceId" element={<EditSpace />} />
          <Route path="/create" element={<CreateSpace />} />
          <Route path="/join" element={<JoinSpace />} />
          <Route path="/:spaceId" element={<SpaceView />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default SpaceLayout;
