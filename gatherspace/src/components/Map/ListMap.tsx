import React from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllMaps } from "../../utils/api";
import { Map } from "../../types/api.types";
import MapComponent from "../space/MapComponent";

const ListMap = () => {
  const { data: maps, isLoading } = useQuery({
    queryKey: ["maps"],
    queryFn: getAllMaps,
  });
  console.log("Maps data:", maps);
  return (
    <Box p={6}>
      <Box>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">My Maps</Heading>
          <Button as={Link} to="/dashboard/createMap" colorScheme="blue" mr={2}>
            Create Map
          </Button>
        </Flex>

        {isLoading ? (
          <Text>Loading Map...</Text>
        ) : maps?.length === 0 ? (
          <Text>No maps found. Create or join a map to get started!</Text>
        ) : (
          <Grid
            templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            gap={6}
            w="full"
          >
            {maps?.map((map: Map) => (
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
                key={map.id}
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
                <MapComponent map={map} key={map.id} />
              </div>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default ListMap;
