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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSpace, getAllMaps } from "../../utils/api";
import { Map } from "../../types/api.types";
import MapComponent from "./MapComponent"; // Assuming MapComponent is in the same directory

const CreateSpace = () => {
  console.log("CreateSpace component rendered");
  const navigate = useNavigate();
  const toast = useToast();
  const [maps, setMaps] = useState<Map[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    mapId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedMap = maps.find((map) => map.id === formData.mapId);
      if (!selectedMap) {
        throw new Error("Selected map not found");
      }
      const dimensions = selectedMap.width + "x" + selectedMap.height;
      await createSpace(formData.name, dimensions, formData.mapId);

      toast({
        title: "Space created successfully!",
        status: "success",
        duration: 3000,
      });
      setFormData({
        name: "",
        mapId: "",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Failed to create space",
        description: error.message,
        status: "error",
        duration: 3000,
      });
      console.error("Error creating space:", error);
    }
  };

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const maps = await getAllMaps();
        console.log("Fetched maps:", maps);
        setMaps(maps);
      } catch (error) {
        console.error("Error fetching maps:", error);
      }
    };
    fetchMaps();
  }, []);

  return (
    <Box maxW="container.md" mx="auto">
      <Heading mb={6}>Create New Space</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Space Name</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter space name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Select Map</FormLabel>
            <Grid
              templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
              gap={4}
            >
              {maps.map((map) => (
                <MapComponent
                  key={map.id}
                  map={map}
                  isSelectable={true}
                  isSelected={formData.mapId === map.id}
                  onSelect={(selectedMapId) =>
                    setFormData({ ...formData, mapId: selectedMapId })
                  }
                />
              ))}
            </Grid>
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            loadingText="Creating..."
            isDisabled={!formData.mapId}
          >
            Create Space
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateSpace;
