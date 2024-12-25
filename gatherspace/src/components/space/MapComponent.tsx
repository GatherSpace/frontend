import React from 'react';
import { 
  Box, 
  Image, 
  Text, 
  Flex, 
  Heading, 
  useColorModeValue 
} from '@chakra-ui/react';
import { Map } from '../../types/api.types';

interface MapComponentProps {
  space?: any;
  map?: Map;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: (mapId: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  space, 
  map, 
  isSelectable = false, 
  isSelected = false, 
  onSelect 
}) => {
  // If space prop is provided, use space data
  const data = map || space;

  const borderColor = useColorModeValue(
    isSelected ? 'blue.500' : 'gray.200', 
    isSelected ? 'blue.300' : 'gray.700'
  );

  const handleClick = () => {
    if (isSelectable && onSelect && data?.id) {
      onSelect(data.id);
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      cursor={isSelectable ? 'pointer' : 'default'}
      border="2px solid"
      borderColor={borderColor}
      _hover={isSelectable ? { 
        transform: 'translateY(-2px)', 
        shadow: 'lg',
        borderColor: 'blue.400'
      } : {}}
      transition="all 0.2s"
      onClick={handleClick}
    >
      <Box position="relative" height="180px">
        <Image
          src={data?.thumbnail}
          alt={data?.name || 'Map Thumbnail'}
          objectFit="cover"
          width="100%"
          height="100%"
        />
      </Box>
      
      <Box p={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Box flex="1">
            <Heading size="md" mb={1} noOfLines={1}>
              {data?.name}
            </Heading>
            <Text color="gray.600" fontSize="sm">
              {data?.width} x {data?.height}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default MapComponent;
