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
  Checkbox,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createElement } from "../../utils/api";
import { Element } from "../../types/api.types";

const CreateElement = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState<Element>({
    imageUrl: "",
    width: 1,
    height: 1,
    staticValue: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
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
    try {
      await createElement(formData);
      toast({
        title: "Element created successfully!",
        status: "success",
        duration: 3000,
      });
      setFormData({
        imageUrl: "",
        width: 1,
        height: 1,
        staticValue: true,
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Failed to create element",
        description: error.message,
        status: "error",
        duration: 3000,
      });
      console.error("Error creating element:", error);
    }
  };

  return (
    <Box maxW="container.md" mx="auto">
      <Heading mb={6}>Create New Element</Heading>
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
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Width</FormLabel>
            <Input
              value={formData.width}
              type="number"
              onChange={(e) =>
                setFormData({ ...formData, width: parseInt(e.target.value) })
              }
              placeholder="Enter width"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Height</FormLabel>
            <Input
              value={formData.height}
              type="number"
              onChange={(e) =>
                setFormData({ ...formData, height: parseInt(e.target.value) })
              }
              placeholder="Enter height"
            />
          </FormControl>

          <FormControl>
            <Checkbox
              isChecked={formData.staticValue}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  staticValue: e.target.checked,
                })
              }
            >
              Static Value
            </Checkbox>
            {/* <Input
              type="checkbox"
              checked={formData.staticValue}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  staticValue: e.target.checked,
                })
              }
            /> */}
          </FormControl>

          <Button type="submit" colorScheme="blue" loadingText="Creating...">
            Create Element
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateElement;
