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
  return (
    <Box h="100vh" w="100vw">
      <Navbar />
      <div>
        <Routes>
          <Route path="/:spaceId" element={<SpaceView />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Box>
  );
};

export default SpaceLayout;
