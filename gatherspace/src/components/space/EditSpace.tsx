import React, { useState, useRef, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  useToast,
  Heading,
  Image,
  Flex,
  Grid,
  Text,
} from "@chakra-ui/react";
import {
  addElementToSpace,
  fetchSpaceDetails,
  fetchElements,
} from "../../utils/api";
import { Space, Element } from "../../types/api.types";

interface SpaceElementParameter {
  spaceId: string;
  elementId: string;
  x: number;
  y: number;
}

const EditSpace = () => {
  const toast = useToast();
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [space, setSpace] = useState<Space>();
  const location = useLocation();

  useEffect(() => {
    const loadElements = async () => {
      try {
        const fetchedElements = await fetchElements();
        setElements(fetchedElements);
      } catch (error) {
        toast({
          title: "Error fetching elements",
          description: error instanceof Error ? error.message : "Unknown error",
          status: "error",
          duration: 3000,
        });
      }
    };

    if (location.state?.space) {
      setSpace(location.state.space);
      loadElements();
    } else {
      console.warn("Space data is missing from the navigation state");
      toast({
        title: "Space data is not available",
        status: "error",
        duration: 3000,
      });
    }
  }, [location.state, toast]);

  const handleElementClick = (element: Element) => {
    setSelectedElement(element);
  };

  return (
    <Flex h="100vh" w="100%" p={4}>
      {/* Element Selection Panel */}
      <Box
        w="200px"
        borderRight="1px solid"
        borderColor="gray.200"
        overflowY="auto"
        p={4}
      >
        <Heading size="sm">Element Selection</Heading>
        <Grid templateColumns="repeat(2, 1fr)">
          {elements.map((element) => (
            <Box
              key={element.id}
              border="1px solid"
              borderColor={
                selectedElement?.id === element.id ? "blue.500" : "gray.200"
              }
              cursor="pointer"
              onClick={() => handleElementClick(element)}
              _hover={{
                bg: selectedElement?.id === element.id ? "blue.50" : "gray.50",
              }}
              transition="all 0.2s"
            >
              <Image
                src={element.imageUrl}
                alt={element.imageUrl}
                objectFit="cover"
                w="90px"
                height="90px"
                p={2}
              />
            </Box>
          ))}
        </Grid>
      </Box>
    </Flex>
  );
};

export default EditSpace;
