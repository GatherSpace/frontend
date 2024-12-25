// import React from "react";
// import {
//   Box,
//   Image,
//   Text,
//   Flex,
//   Heading,
//   useColorModeValue,
// } from "@chakra-ui/react";
// import { Space } from "../../types/api.types";

// interface SpaceComponentProps {
//   space?: Space;
// }

// const SpaceComponent: React.FC<SpaceComponentProps> = ({ space }) => {
//   // If space prop is provided, use space data
//   const data = space;

//   return (
//     <Box
//       borderWidth="1px"
//       borderRadius="lg"
//       overflow="hidden"
//       bg="white"
//       border="2px solid"
//       transition="all 0.2s"
//     >
//       <Box position="relative" height="180px">
//         <Image
//           src={data?.thumbnail}
//           alt={data?.name || "Map Thumbnail"}
//           objectFit="cover"
//           width="100%"
//           height="100%"
//         />
//       </Box>

//       <Box p={4}>
//         <Flex justifyContent="space-between" alignItems="center">
//           <Box flex="1">
//             <Heading size="md" mb={1} noOfLines={1}>
//               {data?.name}
//             </Heading>
//             <Text color="gray.600" fontSize="sm">
//               {data?.width} x {data?.height}
//             </Text>
//           </Box>
//         </Flex>
//       </Box>
//     </Box>
//   );
// };

// export default SpaceComponent;

// import React, { useState } from "react";
// import {
//   Box,
//   Image,
//   Text,
//   Flex,
//   Heading,
//   useColorModeValue,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   IconButton,
// } from "@chakra-ui/react";
// import { Space } from "../../types/api.types";
// import { HiDotsVertical } from "react-icons/hi"; // Or any other three-dot icon you prefer
// import { useNavigate } from "react-router-dom";

// interface SpaceComponentProps {
//   space?: Space;
// }

// const SpaceComponent: React.FC<SpaceComponentProps> = ({ space }) => {
//   const navigate = useNavigate();
//   // If space prop is provided, use space data
//   const data = space;
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const handleEdit = () => {
//     // Navigate to the edit page for the specific space
//     navigate(`/edit-space/${data?.id}`); // Assuming you have a route like '/edit-space/:spaceId'
//     setIsMenuOpen(false);
//   };

//   const handleDelete = () => {
//     // Implement your delete logic here
//     console.log("Delete space:", data?.id);
//     setIsMenuOpen(false);
//     // You might want to show a confirmation dialog before deleting
//   };

//   return (
//     <Box
//       borderWidth="1px"
//       borderRadius="lg"
//       overflow="hidden"
//       bg="white"
//       border="2px solid"
//       transition="all 0.2s"
//     >
//       <Box position="relative" height="180px">
//         <Image
//           src={data?.thumbnail}
//           alt={data?.name || "Map Thumbnail"}
//           objectFit="cover"
//           width="100%"
//           height="100%"
//         />
//       </Box>

//       <Box p={4}>
//         <Flex justifyContent="space-between" alignItems="center">
//           <Box flex="1">
//             <Heading size="md" mb={1} noOfLines={1}>
//               {data?.name}
//             </Heading>
//             <Text color="gray.600" fontSize="sm">
//               {data?.width} x {data?.height}
//             </Text>
//           </Box>

//           <Box>
//             <Menu>
//               <MenuButton
//                 as={IconButton}
//                 aria-label="Options"
//                 icon={<HiDotsVertical />}
//                 variant="ghost"
//               />
//               <MenuList>
//                 <MenuItem onClick={handleEdit}>Edit</MenuItem>
//                 <MenuItem onClick={handleDelete}>Delete</MenuItem>
//               </MenuList>
//             </Menu>
//           </Box>
//         </Flex>
//       </Box>
//     </Box>
//   );
// };

// export default SpaceComponent;

import React, { useState } from "react";
import {
  Box,
  Image,
  Text,
  Flex,
  Heading,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { Space } from "../../types/api.types";

import { HiDotsVertical } from "react-icons/hi"; // Or any other three-dot icon you prefer
import { useNavigate } from "react-router-dom";
import { deleteSpace } from "../../utils/api";

interface SpaceComponentProps {
  space?: Space;
}

const SpaceComponent: React.FC<SpaceComponentProps> = ({ space }) => {
  const navigate = useNavigate();
  // If space prop is provided, use space data
  const data = space;
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const handleEdit = () => {
    // Navigate to the edit page for the specific space
    navigate(`/space/edit-space/${data?.id}`); // Assuming you have a route like '/edit-space/:spaceId'
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    // Implement your delete logic here
    if (data === undefined) return;
    deleteSpace(data?.id);
    console.log("Delete space:", data?.id);
    setIsMenuOpen(false);

    // want to reload the page
    window.location.reload();
    // You might want to show a confirmation dialog before deleting
  };

  return (
    <Box overflow="hidden" bg="white" transition="all 0.2s">
      <Box position="relative" height="180px">
        <Image
          src={data?.thumbnail}
          alt={data?.name || "Map Thumbnail"}
          objectFit="cover"
          width="100%"
          height="100%"
        />
        <Box position="absolute" top="2" right="2">
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HiDotsVertical />}
              variant="ghost"
              _hover={{ bg: "transparent" }}
              _focus={{ boxShadow: "none" }}
              _active={{ bg: "transparent" }}
              _expanded={{ bg: "transparent" }}
            />
            <MenuList>
              <MenuItem
                onClick={handleEdit}
                _focus={{ outline: "none", bg: "transparent" }}
                _active={{ outline: "none", bg: "transparent" }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={handleDelete}
                _focus={{ outline: "none", bg: "transparent" }}
                _active={{ outline: "none", bg: "transparent" }}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
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

export default SpaceComponent;
