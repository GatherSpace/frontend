import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  Container,
  Image,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const signout = useAuthStore((state) => state.signout);

  const handleSignOut = () => {
    signout();
    navigate("/auth/signin");
  };

  return (
    <Box bg={useColorModeValue("white", "gray.800")} px={4} shadow="sm">
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Link to="/dashboard">
            <Image src="/logo.png" alt="GatherSpace Logo" h="40px" />
          </Link>

          <Flex alignItems="center">
            <Stack direction="row" spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
              <Button onClick={handleSignOut} variant="ghost">
                Sign Out
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
