import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const LandingLayout = () => {
  return (
    <Box>
      {/* Navigation */}
      <Box as="nav" bg={useColorModeValue('white', 'gray.800')} shadow="sm">
        <Container maxW="container.xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            <Image src="/logo.png" alt="GatherSpace" h="40px" />
            <Stack direction="row" spacing={4}>
              <Button as={RouterLink} to="/auth/signin" variant="ghost">
                Sign In
              </Button>
              <Button as={RouterLink} to="/auth/signup" colorScheme="blue">
                Sign Up
              </Button>
            </Stack>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={20}>
        <Container maxW="container.xl">
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            spacing={8}
            alignItems="center"
          >
            <Stack flex={1} spacing={6}>
              <Heading
                fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                fontWeight="bold"
                lineHeight="shorter"
              >
                Create Your Virtual Space
                <Text
                  as="span"
                  bgGradient="linear(to-r, blue.400, purple.400)"
                  bgClip="text"
                  display="block"
                >
                  Connect & Interact
                </Text>
              </Heading>
              <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.300')}>
                GatherSpace is a virtual environment where you can create custom spaces,
                interact with others, and build unique experiences. Perfect for virtual
                meetups, team collaborations, or just hanging out with friends.
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                <Button
                  as={RouterLink}
                  to="/auth/signup"
                  size="lg"
                  colorScheme="blue"
                  px={8}
                >
                  Get Started
                </Button>
                <Button
                  as={RouterLink}
                  to="/demo"
                  size="lg"
                  variant="outline"
                  px={8}
                >
                  View Demo
                </Button>
              </Stack>
            </Stack>
            <Box
              flex={1}
              position="relative"
              w="full"
              maxW={{ base: '400px', lg: '600px' }}
            >
              <Image
                src="/hero-image.png"
                alt="Virtual Space Preview"
                w="full"
                rounded="lg"
                shadow="2xl"
              />
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <Stack spacing={12}>
            <Heading textAlign="center" size="xl" mb={4}>
              Features
            </Heading>
            <Stack
              direction={{ base: 'column', lg: 'row' }}
              spacing={8}
              justify="center"
            >
              {features.map((feature, index) => (
                <Box
                  key={index}
                  bg={useColorModeValue('white', 'gray.800')}
                  p={8}
                  rounded="lg"
                  shadow="base"
                  flex={1}
                  maxW={{ base: 'full', lg: '320px' }}
                >
                  <Stack spacing={4} align="center" textAlign="center">
                    <Box
                      p={2}
                      bg={useColorModeValue('blue.50', 'blue.900')}
                      rounded="full"
                    >
                      {feature.icon}
                    </Box>
                    <Heading size="md">{feature.title}</Heading>
                    <Text color={useColorModeValue('gray.600', 'gray.300')}>
                      {feature.description}
                    </Text>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={8}>
        <Container maxW="container.xl">
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align="center"
            spacing={4}
          >
            <Text>© 2024 GatherSpace. All rights reserved.</Text>
            <Stack direction="row" spacing={6}>
              <Button variant="link">About</Button>
              <Button variant="link">Contact</Button>
              <Button variant="link">Privacy</Button>
              <Button variant="link">Terms</Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

const features = [
  {
    title: 'Custom Spaces',
    description:
      'Create and customize your own virtual spaces with different layouts and themes.',
    icon: (
      <Box as="span" fontSize="3xl" role="img" aria-label="customize">
        🎨
      </Box>
    )
  },
  {
    title: 'Real-time Interaction',
    description:
      'Interact with others in real-time through movement and proximity-based interactions.',
    icon: (
      <Box as="span" fontSize="3xl" role="img" aria-label="interact">
        👥
      </Box>
    )
  },
  {
    title: 'Interactive Elements',
    description:
      'Add interactive elements and objects to make your space more engaging and functional.',
    icon: (
      <Box as="span" fontSize="3xl" role="img" aria-label="elements">
        🎮
      </Box>
    )
  }
];

export default LandingLayout;
