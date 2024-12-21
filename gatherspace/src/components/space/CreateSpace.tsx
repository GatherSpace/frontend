import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  VStack,
  useToast
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMap, fetchElements } from '../../utils/api';

const CreateSpace = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    dimensions: '',
    thumbnail: '',
    defaultElements: []
  });

  const { data: elements } = useQuery({
    queryKey: ['elements'],
    queryFn: fetchElements
  });

  const createMapMutation = useMutation({
    mutationFn: createMap,
    onSuccess: () => {
      toast({
        title: 'Space created successfully!',
        status: 'success',
        duration: 3000
      });
      navigate('/space');
    },
    onError: (error) => {
      toast({
        title: 'Failed to create space',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMapMutation.mutate(formData);
  };

  return (
    <Box maxW="container.md" mx="auto">
      <Heading mb={6}>Create New Space</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Space Name</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter space name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Dimensions (width x height)</FormLabel>
            <Input
              value={formData.dimensions}
              onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
              placeholder="e.g., 200x300"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Thumbnail URL</FormLabel>
            <Input
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="Enter thumbnail URL"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={createMapMutation.isPending}
            loadingText="Creating..."
          >
            Create Space
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateSpace;
