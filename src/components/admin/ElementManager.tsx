import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Switch,
  VStack,
  useToast,
  Image,
  Text,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { adminApi, fetchElements } from "../../utils/api";

interface Element {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
  staticValue: boolean;
}

interface ElementFormData {
  imageUrl: string;
  width: number;
  height: number;
  staticValue: boolean;
}

const ElementManager = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ElementFormData>({
    imageUrl: "",
    width: 1,
    height: 1,
    staticValue: true,
  });

  const {
    data: elements,
    isLoading,
    error,
  } = useQuery<Element[]>({
    queryKey: ["elements"],
    queryFn: () => fetchElements(),
  });

  const createElementMutation = useMutation({
    mutationFn: () => adminApi.createElement(formData),
    onSuccess: () => {
      toast({
        title: "Element created successfully!",
        status: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["elements"] });
      setFormData({
        imageUrl: "",
        width: 1,
        height: 1,
        staticValue: true,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create element",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    },
  });

  const updateElementMutation = useMutation({
    mutationFn: ({ id, imageUrl }: { id: string; imageUrl: string }) =>
      adminApi.updateElement(id, imageUrl),
    onSuccess: () => {
      toast({
        title: "Element updated successfully!",
        status: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["elements"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update element",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.imageUrl.trim() ||
      formData.width <= 0 ||
      formData.height <= 0
    ) {
      toast({
        title: "Invalid input",
        description: "Please fill in all required fields with valid values",
        status: "error",
        duration: 3000,
      });
      return;
    }
    createElementMutation.mutate();
  };

  if (error) {
    return (
      <Box>
        <Text color="red.500">
          Error loading elements: {(error as Error).message}
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Element Manager
      </Heading>

      <Box mb={8}>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Image URL</FormLabel>
              <Input
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="Enter image URL"
                isDisabled={createElementMutation.isPending}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Width (in tiles)</FormLabel>
              <NumberInput
                min={1}
                value={formData.width}
                onChange={(_, value) =>
                  setFormData({ ...formData, width: value || 1 })
                }
                isDisabled={createElementMutation.isPending}
              >
                <NumberInputField placeholder="Enter width" />
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Height (in tiles)</FormLabel>
              <NumberInput
                min={1}
                value={formData.height}
                onChange={(_, value) =>
                  setFormData({ ...formData, height: value || 1 })
                }
                isDisabled={createElementMutation.isPending}
              >
                <NumberInputField placeholder="Enter height" />
              </NumberInput>
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Static Element</FormLabel>
              <Switch
                isChecked={formData.staticValue}
                onChange={(e) =>
                  setFormData({ ...formData, staticValue: e.target.checked })
                }
                isDisabled={createElementMutation.isPending}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={createElementMutation.isPending}
              loadingText="Creating..."
            >
              Create Element
            </Button>
          </VStack>
        </form>
      </Box>

      <Heading size="md" mb={4}>
        Existing Elements
      </Heading>

      {isLoading ? (
        <Text>Loading elements...</Text>
      ) : !elements?.length ? (
        <Text>No elements available. Create one to get started!</Text>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
          {elements.map((element) => (
            <Box
              key={element.id}
              p={4}
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
              _hover={{ shadow: "md" }}
            >
              <Image
                src={element.imageUrl}
                alt={`Element ${element.id}`}
                mb={2}
                maxH="100px"
                objectFit="contain"
              />
              <Text>
                Size: {element.width}x{element.height}
              </Text>
              <Text>Static: {element.staticValue ? "Yes" : "No"}</Text>
              <Button
                size="sm"
                mt={2}
                colorScheme="blue"
                isLoading={updateElementMutation.isPending}
                onClick={() =>
                  updateElementMutation.mutate({
                    id: element.id,
                    imageUrl: element.imageUrl,
                  })
                }
              >
                Update Image
              </Button>
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ElementManager;
