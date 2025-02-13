import {
  Box,
  Container,
  Flex,
  Heading,
  Icon,
  Link,
  Image,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import React from "react";
import { Link as RouterLink, Routes, Route, Navigate } from "react-router-dom";
import { FiHome, FiMap, FiGrid, FiUser, FiPlusSquare, FiLogOut } from "react-icons/fi";
import SpaceManager from "../components/space/SpaceManager";
import logo from "../assets/logo.png";
import CreateMap from "../components/Map/CreateMap";
import CreateElement from "../components/element/CreateElement";

import ListMap from "../components/Map/ListMap";
import CreateAvatar from "../components/avatar/CreateAvatar";
import CreateSpace from "../components/space/CreateSpace";
import EditSpace from "../components/space/EditSpace";
import { auth } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
interface NavItemProps {
  icon: any;
  children: string;
  to: string;
  onClick?: () => void;
}

const NavItem = ({ icon, children, to, onClick }: NavItemProps) => {
  const activeBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Link
      as={RouterLink}
      to={to}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
      onClick={onClick}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: activeBg,
        }}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "blue.500",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const DashboardLayout = () => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const signout = useAuthStore((state) => state.signout);
  const userRole = useAuthStore((state) => state.userRole);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    signout();
    onClose();
    navigate("/auth/signin");
  };

  return (
    <Flex minH="100vh" bg="gray.50" minW="100vw">
      {/* Sidebar */}
      <Box
        w="64"
        bg={bg}
        borderRight="1px"
        borderRightColor={borderColor}
        position="fixed"
        h="full"
        display="flex"
        flexDirection="column"
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Image src={logo} alt="GatherSpace Logo" h="60px" />
        </Flex>
        <Stack spacing={0}>
          <NavItem icon={FiHome} to="/dashboard">
            My Spaces
          </NavItem>
          <NavItem icon={FiMap} to="/dashboard/maps">
            Maps
          </NavItem>
          {userRole === "Admin" && (
            <NavItem icon={FiGrid} to="/dashboard/element">
              Elements
            </NavItem>
          )}
          <NavItem icon={FiUser} to="/dashboard/avatar">
            Avatars
          </NavItem>
          {userRole === "Admin" && (
            <NavItem icon={FiPlusSquare} to="/dashboard/createMap">
              Create Map
            </NavItem>
          )}
        </Stack>
        <Box mt="auto" mb={4}>
          <NavItem icon={FiLogOut} to="#" onClick={onOpen}>
            Logout
          </NavItem>
        </Box>

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Logout Confirmation
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to logout?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleLogout} ml={3}>
                  Logout
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>

      {/* Main Content */}
      <Box ml="64" flex="1" w="full">
        <Box as="main" p="4" w="full">
          <Container maxW="full" px="4">
            <Routes>
              <Route path="/" element={<SpaceManager />} />
              <Route path="maps" element={<ListMap />} />
              <Route path="element" element={<CreateElement />} />
              <Route path="createMap" element={<CreateMap />} />
              <Route path="avatar" element={<CreateAvatar />} />
              <Route path="spaceCreate" element={<CreateSpace />} />
              <Route path="/edit-space/:spaceId" element={<EditSpace />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
