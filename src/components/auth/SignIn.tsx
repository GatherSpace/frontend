import { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link as ChakraLink,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "../../store/useAuthStore";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const signin = useAuthStore((state) => state.signin);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      await signin(username, password);
      // Navigation will be handled by useEffect
    } catch (error) {
      toast({
        title: "Error signing in",
        description: "Please check your credentials and try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box px={24} bg="white" rounded="lg" shadow="base">
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        <Heading size="lg">Sign In</Heading>

        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          isLoading={isLoading}
        >
          Sign In
        </Button>

        <Text>
          Don't have an account?{" "}
          <ChakraLink as={Link} to="/auth/signup" color="blue.500">
            Sign Up
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  );
}
