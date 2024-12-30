import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";

import { createMap, fetchElements } from "../../utils/api";
import { Element } from "../../types/api.types";
import EditMap from "./EditMap";

interface Map {
  thumbnail: string;
  name: string;
  dimensions: string;
}

const CreateMap = () => {
  const toast = useToast();
  const [showCanvas, setShowCanvas] = useState(true);
  const [elements, setElements] = useState<Element[]>([]);

  const [formData, setFormData] = useState<Map>({
    thumbnail: "",
    name: "",
    dimensions: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.thumbnail.trim() ||
      !formData.name.trim() ||
      !formData.dimensions.trim()
    ) {
      toast({
        title: "Error creating Map",
        description: "Please fill in all fields.",
        status: "error",
        duration: 3000,
      });

      setShowCanvas(false);
      return;
    }

    setShowCanvas(true);
    setFormData({
      thumbnail: "",
      name: "",
      dimensions: "",
    });
  };

  useEffect(() => {
    const loadElements = async () => {
      try {
        const elementsData = await fetchElements();
        setElements(elementsData);
      } catch (error) {
        console.error("Error fetching elements:", error);
      }
    };
    loadElements();
  }, [formData]);

  return (
    <Box maxW="100%" mx="auto">
      <Heading mb={6}>Create Map</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Map Thumbnail</FormLabel>
            <Input
              value={formData.thumbnail}
              onChange={(e) =>
                setFormData({ ...formData, thumbnail: e.target.value })
              }
              placeholder="Enter Map Thumbnail Url"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Map Name</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter Map Name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Dimensions</FormLabel>
            <Input
              value={formData.dimensions}
              onChange={(e) =>
                setFormData({ ...formData, dimensions: e.target.value })
              }
              placeholder="Enter Map Dimensions"
            />
          </FormControl>

          {/* <Button type="submit" colorScheme="blue" loadingText="Creating...">
            Create Map
          </Button> */}
        </VStack>
      </form>

      {showCanvas && (
        <EditMap
          elements={elements}
          mapDetails={formData}
          setShowCanvas={setShowCanvas}
          setFormData={setFormData}
        />
      )}
    </Box>
  );
};

export default CreateMap;
