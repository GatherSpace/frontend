import {
  Box,
  Flex,
  Button,
  Heading,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function Navbar() {
  const navigate = useNavigate();
  const signout = useAuthStore((state) => state.signout);
  const user = useAuthStore((state) => state.user);

  const handleSignOut = () => {
    signout();
    navigate('/auth/signin');
  };

  return (
    <Box bg={useColorModeValue('white', 'gray.900')} px={4} shadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Heading size="md" as={Link} to="/space">
          GatherSpace
        </Heading>

        <HStack spacing={4}>
          {user?.role === 'Admin' && (
            <>
              <Button as={Link} to="/space/create-map" variant="ghost">
                Create Map
              </Button>
              <Button as={Link} to="/space/elements" variant="ghost">
                Elements
              </Button>
              <Button as={Link} to="/space/avatars" variant="ghost">
                Avatars
              </Button>
            </>
          )}
          <Button onClick={handleSignOut} colorScheme="red" variant="outline">
            Sign Out
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}
