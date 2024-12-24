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
} from "@chakra-ui/react";
import { Link as RouterLink, Routes, Route, Navigate } from "react-router-dom";
import { FiHome, FiUsers, FiMap, FiCircle, FiMapPin } from "react-icons/fi";
import SpaceManager from "../components/space/SpaceManager";
import CreateSpace from "../components/space/CreateSpace";
import JoinSpace from "../components/space/JoinSpace";
import logo from "../assets/logo.png";
import CreateMap from "../components/Map/CreateMap";
import CreateElement from "../components/element/CreateElement";
import { LiaSortNumericUpAltSolid } from "react-icons/lia";
import ListMap from "../components/Map/ListMap";
import CreateAvatar from "../components/avatar/CreateAvatar";
interface NavItemProps {
  icon: any;
  children: string;
  to: string;
}

const NavItem = ({ icon, children, to }: NavItemProps) => {
  const activeBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Link
      as={RouterLink}
      to={to}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
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

  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Box
        w="64"
        bg={bg}
        borderRight="1px"
        borderRightColor={borderColor}
        position="fixed"
        h="full"
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Image src={logo} alt="GatherSpace Logo" h="60px" />
        </Flex>
        <Stack spacing={0}>
          <NavItem icon={FiHome} to="dashboard">
            My Spaces
          </NavItem>
          <NavItem icon={FiMap} to="/dashboard/maps">
            Map List
          </NavItem>
          <NavItem icon={FiCircle} to="/dashboard/element">
            Create Element
          </NavItem>

          <NavItem icon={FiMapPin} to="/dashboard/createMap">
            Create Map
          </NavItem>

          <NavItem icon={FiUsers} to="/dashboard/avatar">
            Create Profile Avatar
          </NavItem>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box ml="64" w="full">
        <Box as="main" p="4">
          <Container maxW="container.xl">
            <Routes>
              <Route index element={<SpaceManager />} />
              <Route path="dashboard/maps" element={<ListMap />} />
              <Route path="dashboard/element" element={<CreateElement />} />
              <Route path="dashboard/createMap" element={<CreateMap />} />
              <Route path="dashboard/avatar" element={<CreateAvatar />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
