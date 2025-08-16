import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { wsService } from "../../services/WebSocketService";

const JoinSpace = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [spaceId, setSpaceId] = useState("");

  const joinSpaceMutation = useMutation({
    mutationFn: async () => {
      wsService.connect();
      wsService.joinSpace(spaceId);
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Joined space successfully!",
        status: "success",
        duration: 3000,
      });
      navigate(`/space/${spaceId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to join space",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spaceId) {
      toast({
        title: "Space ID is required",
        status: "error",
        duration: 3000,
      });
      return;
    }
    joinSpaceMutation.mutate();
  };

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <form onSubmit={handleSubmit}>
        <Box borderWidth={1} borderRadius="lg" p={6}>
          <FormControl>
            <FormLabel>Space ID</FormLabel>
            <Input
              value={spaceId}
              onChange={(e) => setSpaceId(e.target.value)}
              placeholder="Enter space ID"
              isDisabled={joinSpaceMutation.isPending}
            />
          </FormControl>

          <Button
            mt={4}
            type="submit"
            colorScheme="blue"
            isLoading={joinSpaceMutation.isPending}
            loadingText="Joining..."
            width="full"
          >
            Join Space
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default JoinSpace;
