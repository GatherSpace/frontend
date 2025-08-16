import React from "react";
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
import { useEffect, useState } from "react";
import { createAvatar, fetchAvatars } from "../../utils/api";
import { Avatar } from "../../types/api.types";
import { UNSAFE_createClientRoutesWithHMRRevalidationOptOut } from "react-router-dom";
import AvatarComponent from "./AvatarComponent";
import { useAuthStore } from "../../store/useAuthStore";

const CreateAvatar = () => {
  const toast = useToast();
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const userRole = useAuthStore((state) => state.userRole);
  const [formData, setFormData] = useState<Avatar>({
    imageUrl: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl.trim() || !formData.name.trim()) {
      toast({
        title: "Error creating avatar",
        description: "Please fill in all fields.",
        status: "error",
        duration: 3000,
      });
      return;
    }
    try {
      await createAvatar(formData);
      toast({
        title: "Avatar created successfully!",
        status: "success",
        duration: 3000,
      });
      setFormData({
        imageUrl: "",
        name: "",
      });
    } catch (error) {
      console.error("Error creating avatar:", error);
      toast({
        title: "Error creating avatar",
        description: "Please try again.",
        status: "error",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    const loadAvatars = async () => {
      try {
        const avatar: Avatar[] = await fetchAvatars();
        setAvatars(avatar);
      } catch (error) {
        console.error("Error fetching avatars:", error);
      }
    };
    loadAvatars();
  }, [formData]);

  return (
    <Box maxW="container.md" mx="auto">
      {userRole === "Admin" && (
        <>
          <Heading mb={6}>Create Avatar</Heading>
          <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Avatar URL</FormLabel>
            <Input
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              placeholder="Enter Avatar Url"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Avatar Name</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter Avatar Name"
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" loadingText="Creating...">
            Create Avatar
          </Button>
        </VStack>
      </form>
</>)}
      <Box maxW="container.md" mx="auto">
        <Heading mb={6}>Avatars</Heading>
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
          {avatars.map((avatar) => (
            <AvatarComponent key={avatar.id} avatarDetails={avatar} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default CreateAvatar;
