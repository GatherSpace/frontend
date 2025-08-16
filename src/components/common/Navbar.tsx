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
import logo from "../../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const signout = useAuthStore((state) => state.signout);

  const handleSignOut = () => {
    signout();
    navigate("/auth/signin");
  };

  return (
    <Box
      bg="white"
      width="100%"
      px={16}
      py={1}
      backgroundColor={"gray.200"}
      shadow="sm"
      top="0"
      zIndex="999"
    >
      <Box width="100%">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Link to="/dashboard">
            <Image src={logo} alt="GatherSpace Logo" h="60px" />
          </Link>

          <Flex alignItems="center">
            <Stack direction="row" spacing={7}>
              <Button onClick={handleSignOut} variant="ghost">
                Sign Out
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
