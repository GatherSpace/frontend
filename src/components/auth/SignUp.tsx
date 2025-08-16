import { useState } from "react";
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
  Select,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Admin" | "User">("User");
  const [isLoading, setIsLoading] = useState(false);
  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(username, password, role);
      toast({
        title: "Account created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/auth/signin");
    } catch (error) {
      toast({
        title: "Error creating account",
        description: "Please try again with different credentials",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box px={24} bg="white" rounded="lg" shadow="base">
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        <Heading size="lg">Sign Up</Heading>

        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Role</FormLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value as "Admin" | "User")}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </Select>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          isLoading={isLoading}
        >
          Sign Up
        </Button>

        <Text>
          Already have an account?{" "}
          <ChakraLink as={Link} to="/auth/signin" color="blue.500">
            Sign In
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  );
}
