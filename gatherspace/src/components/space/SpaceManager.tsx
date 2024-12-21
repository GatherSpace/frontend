import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchUserSpaces } from "../../utils/api";
import { Space } from "../../types";

const SpaceManager = () => {
  const { data: spaces, isLoading } = useQuery({
    queryKey: ["spaces"],
    queryFn: fetchUserSpaces,
  });

  return (
    <Box>
      <Box
        mb={6}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="lg">My Spaces</Heading>
        <Box>
          <Button as={Link} to="/space/create" colorScheme="blue" mr={3}>
            Create Space
          </Button>
          <Button as={Link} to="/space/join" colorScheme="green">
            Join Space
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <Text>Loading spaces...</Text>
      ) : spaces?.length === 0 ? (
        <Text>No spaces found. Create or join a space to get started!</Text>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
          {spaces?.map((space: Space) => (
            <Box
              key={space.id}
              p={5}
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
              _hover={{ shadow: "md" }}
            >
              <Heading size="md" mb={2}>
                {space.name}
              </Heading>
              <Text color="gray.600" mb={4}>
                {space.dimensions}
              </Text>
              <Button
                as={Link}
                to={`/space/${space.id}`}
                colorScheme="blue"
                size="sm"
              >
                Enter Space
              </Button>
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SpaceManager;
