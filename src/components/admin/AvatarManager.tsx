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
  Image,
  Text,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { adminApi, fetchAvatars } from "../../utils/api";

interface Avatar {
  id: string;
  name: string;
  imageUrl: string;
}

interface AvatarFormData {
  name: string;
  imageUrl: string;
}

const AvatarManager = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<AvatarFormData>({
    imageUrl: "",
    name: "",
  });

  const {
    data: avatars,
    isLoading,
    error,
  } = useQuery<Avatar[]>({
    queryKey: ["avatars"],
    queryFn: () => fetchAvatars(),
  });

  const createAvatarMutation = useMutation({
    mutationFn: () => adminApi.createAvatar(formData),
    onSuccess: () => {
      toast({
        title: "Avatar created successfully!",
        status: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["avatars"] });
      setFormData({
        imageUrl: "",
        name: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create avatar",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.imageUrl.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
      });
      return;
    }
    createAvatarMutation.mutate();
  };

  if (error) {
    return (
      <Box>
        <Text color="red.500">
          Error loading avatars: {(error as Error).message}
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Avatar Manager
      </Heading>

      <Box mb={8}>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Avatar Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter avatar name"
                isDisabled={createAvatarMutation.isPending}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Image URL</FormLabel>
              <Input
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="Enter image URL"
                isDisabled={createAvatarMutation.isPending}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={createAvatarMutation.isPending}
              loadingText="Creating..."
            >
              Create Avatar
            </Button>
          </VStack>
        </form>
      </Box>

      <Heading size="md" mb={4}>
        Available Avatars
      </Heading>

      {isLoading ? (
        <Text>Loading avatars...</Text>
      ) : !avatars?.length ? (
        <Text>No avatars available. Create one to get started!</Text>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
          {avatars.map((avatar) => (
            <Box
              key={avatar.id}
              p={4}
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
              _hover={{ shadow: "md" }}
            >
              <Image
                src={avatar.imageUrl}
                alt={avatar.name}
                mb={2}
                maxH="100px"
                objectFit="contain"
              />
              <Text fontWeight="bold">{avatar.name}</Text>
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AvatarManager;
