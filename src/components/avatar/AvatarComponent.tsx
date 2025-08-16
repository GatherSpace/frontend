// gatherspace/src/components/avatar/AvatarComponent.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Image,
  Text,
  Flex,
  Heading,
  useColorModeValue,
  Button,
  useToast,
} from "@chakra-ui/react";
import { updateMetadata } from "../../utils/api";

interface AvatarComponentProps {
  avatarDetails: {
    imageUrl: string;
    name: string;
    id?: string;
  };
}

const AvatarComponent: React.FC<AvatarComponentProps> = ({ avatarDetails }) => {
  const bg = useColorModeValue("white", "gray.800");
  const toast = useToast();

  const handleUpdate = async () => {
    try {
      // Ensure avatarDetails.id is a string and not undefined
      if (avatarDetails.id) {
        await updateMetadata(avatarDetails.id);
        toast({
          title: "Metadata updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Avatar ID is missing",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating metadata:", error);
      toast({
        title: "Error updating metadata",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bg}
      border="2px solid"
      transition="all 0.2s"
    >
      <Box position="relative" height="120px">
        <Image
          src={avatarDetails.imageUrl}
          alt={avatarDetails.name || "Avatar"}
          objectFit="cover"
          width="100%"
          height="100%"
        />
      </Box>

      <Box p={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Box flex="1">
            <Heading size="sm" mb={1}>
              {avatarDetails.name}
            </Heading>
          </Box>
          <Button onClick={() => handleUpdate()}>Use Avatar</Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default AvatarComponent;
