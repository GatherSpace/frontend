import { Box, Container, Flex, Image } from '@chakra-ui/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';

const AuthLayout = () => {
  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.sm" py={10}>
        <Flex direction="column" align="center" mb={8}>
          <Image src="/logo.png" alt="GatherSpace Logo" h="60px" mb={4} />
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
