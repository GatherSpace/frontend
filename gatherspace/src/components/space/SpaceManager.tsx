import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchUserSpaces } from "../../utils/api";
import { Space } from "../../types/api.types";
// import MapComponent from "./MapComponent";
import SpaceComponent from "./SpaceComponent";

const SpaceManager = () => {
  const { data: spaces, isLoading } = useQuery({
    queryKey: ["spaces"],
    queryFn: fetchUserSpaces,
  });

  console.log("Spaces data:", spaces);

  return (
    <Box p={6}>
      <Box>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">My Spaces</Heading>
          <Button
            as={Link}
            to="/dashboard/spaceCreate"
            colorScheme="blue"
            mr={2}
          >
            Create Space
          </Button>
        </Flex>

        {isLoading ? (
          <Text>Loading spaces...</Text>
        ) : spaces?.length === 0 ? (
          <Text>No spaces found. Create or join a space to get started!</Text>
        ) : (
          <Grid
            templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            gap={6}
            w="full"
          >
            {spaces?.map((space: Space) => (
              // <Box
              //   key={space.id}
              //   borderWidth="1px"
              //   borderRadius="lg"
              //   overflow="hidden"
              //   _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              //   transition="all 0.2s"
              //   bg="white"
              // >
              //   <Box position="relative" height="180px">
              //     <Image
              //       src={space.thumbnail}
              //       alt={space.name}
              //       objectFit="cover"
              //       width="100%"
              //       height="100%"
              //     />
              //   </Box>

              //   <Box p={4}>
              //     <Flex justifyContent="space-between" alignItems="center" gap={4}>
              //       <Box flex="1">
              //         <Heading size="md" mb={1} noOfLines={1}>
              //           {space.name}
              //         </Heading>
              //         <Text color="gray.600" fontSize="sm">
              //           {space.width} x {space.height}
              //         </Text>
              //       </Box>
              //       <Button
              //         as={Link}
              //         to={`/space/${space.id}`}
              //         colorScheme="blue"
              //         size="sm"
              //         flexShrink={0}
              //       >
              //         Enter Space
              //       </Button>
              //     </Flex>
              //   </Box>
              // </Box>

              // adding hover effect and transition
              <div
                key={space.id}
                style={{
                  transition: "all 0.2s",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <SpaceComponent space={space} key={space.id} />
              </div>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default SpaceManager;
