import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  useToast
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../utils/api';

const JoinSpace = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [spaceId, setSpaceId] = useState('');

  const joinSpaceMutation = useMutation({
    mutationFn: () => userApi.joinSpace(spaceId),
    onSuccess: () => {
      toast({
        title: 'Joined space successfully!',
        status: 'success',
        duration: 3000
      });
      navigate(`/space/${spaceId}`);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to join space',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spaceId.trim()) {
      toast({
        title: 'Space ID required',
        description: 'Please enter a space ID',
        status: 'error',
        duration: 3000
      });
      return;
    }
    joinSpaceMutation.mutate();
  };

  return (
    <Box maxW="container.md" mx="auto">
      <Heading mb={6}>Join Space</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Space ID</FormLabel>
            <Input
              value={spaceId}
              onChange={(e) => setSpaceId(e.target.value)}
              placeholder="Enter space ID"
              isDisabled={joinSpaceMutation.isPending}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={joinSpaceMutation.isPending}
            loadingText="Joining..."
          >
            Join Space
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default JoinSpace;
