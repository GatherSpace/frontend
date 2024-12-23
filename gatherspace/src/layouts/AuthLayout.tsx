import { Box, Container, Flex, Image } from "@chakra-ui/react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import SignIn from "../components/auth/SignIn";
import SignUp from "../components/auth/SignUp";

const AuthLayout = () => {
  return (
    // center the content
    <Box minH="100vh" bg="gray.50" minW="100vw">
      <Container maxW="container.sm" py={10}>
        <Flex direction="column" align="center" mb={8}>
          <Link to="/">
            <Image src={logo} alt="GatherSpace Logo" h="60px" mb={4} />
          </Link>
        </Flex>
        <Box
          bg="white"
          p={8}
          borderRadius="lg"
          boxShadow="sm"
          border="1px"
          borderColor="gray.100"
        >
          <Routes>
            <Route path="/" element={<Navigate to="/auth/signin" replace />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/auth/signin" replace />} />
          </Routes>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;
