/*import React, { useState, useRef } from "react";
import { Box, Button, useToast } from "@chakra-ui/react";
import { createMap } from "../../utils/api";

interface MapElement {
  id?: string;
  imageUrl: string;
  width: number;
  height: number;
  staticValue: boolean;
  x?: number;
  y?: number;
}

interface MapDetails {
  thumbnail: string;
  name: string;
  dimensions: string;
}

interface EditMapProps {
  elements: MapElement[];
  mapDetails: MapDetails;
}

const CELL_SIZE = 50; // Each grid cell is 50x50px

const EditMap: React.FC<EditMapProps> = ({ elements, mapDetails }) => {
  const toast = useToast();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [placedElements, setPlacedElements] = useState<MapElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  console.log(elements);
  console.log(mapDetails);
  // Parse dimensions
  const [gridWidth, gridHeight] = mapDetails.dimensions.split("x").map(Number);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleElementDrop = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - position.x) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top - position.y) / CELL_SIZE);

    // Check if the drop location is valid
    const isValidLocation = !placedElements.some(
      (el) => el.x === x && el.y === y
    );

    if (isValidLocation) {
      // Add the element to placed elements
      const droppedElement = elements.find(
        (el) => !placedElements.includes(el)
      );
      if (droppedElement) {
        setPlacedElements((prev) => [...prev, { ...droppedElement, x, y }]);
      }
    } else {
      toast({
        title: "Invalid Placement",
        description: "An element already exists at this location",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleSaveMap = async () => {
    try {
      // Prepare the map data to be sent to the API
      const mapData = {
        thumbnail: mapDetails.thumbnail,
        name: mapDetails.name,
        dimensions: mapDetails.dimensions,
        defaultElements: placedElements
          .filter(
            (el): el is MapElement & { id: string } => el.id !== undefined
          )
          .map((el) => ({
            elementId: el.id,
            x: el.x || 0,
            y: el.y || 0,
          })),
      };

      // Call the API to create the map
      await createMap({
        name: mapData.name,
        dimensions: mapData.dimensions,
        thumbnail: mapData.thumbnail,
        defaultElements: mapData.defaultElements,
      });

      toast({
        title: "Map Created Successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error creating map:", error);
      toast({
        title: "Error Creating Map",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
      });
    }
  };

  const wrapperStyle: React.CSSProperties = {
    overflow: "auto",
    width: "100%",
    height: "100vh",
    position: "relative",
    cursor: isDragging ? "grabbing" : "grab",
  };

  const canvasStyle: React.CSSProperties = {
    position: "absolute",
    width: `${gridWidth * CELL_SIZE}px`,
    height: `${gridHeight * CELL_SIZE}px`,
    backgroundImage: `
      linear-gradient(to right, #ddd 1px, transparent 1px),
      linear-gradient(to bottom, #ddd 1px, transparent 1px)
    `,
    backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
    border: "1px solid #ccc",
    transform: `translate(${position.x}px, ${position.y}px)`,
    userSelect: "none",
  };

  const mainImageStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    pointerEvents: "none",
  };

  const elementStyle = (element: MapElement): React.CSSProperties => ({
    position: "absolute",
    left: `${(element.x || 0) * CELL_SIZE}px`,
    top: `${(element.y || 0) * CELL_SIZE}px`,
    width: `${element.width * CELL_SIZE}px`,
    height: `${element.height * CELL_SIZE}px`,
    objectFit: "contain",
    pointerEvents: "none",
    opacity: element.staticValue ? 0.7 : 1,
  });

  return (
    <div>
      <div className="spacer" style={{ height: "100px" }}></div>
      <Box position="relative" width="100%" height="100vh">
        <div
          ref={containerRef}
          style={wrapperStyle}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleElementDrop}
        >
          <div style={canvasStyle}>
            <img
              src={mapDetails.thumbnail}
              alt="Map background"
              style={mainImageStyle}
              draggable={false}
            />
            {placedElements.map((element, index) => (
              <img
                key={element.id}
                src={element.imageUrl}
                alt={`Placed element ${index + 1}`}
                style={elementStyle(element)}
                draggable={false}
              />
            ))}
          </div>
        </div>

        <Box
          position="absolute"
          bottom={4}
          left={0}
          right={0}
          textAlign="center"
        >
          <Button
            colorScheme="blue"
            onClick={handleSaveMap}
            isDisabled={placedElements.length === 0}
          >
            Save Map
          </Button>
        </Box>

        {/* Optional: Element Palette }
        <Box position="absolute" top={4} right={4} display="flex" gap={2}>
          {elements
            .filter((el) => !placedElements.includes(el))
            .map((element) => (
              <img
                key={element.id}
                src={element.imageUrl}
                alt={`Element ${element.id}`}
                style={{
                  width: `${element.width * CELL_SIZE}px`,
                  height: `${element.height * CELL_SIZE}px`,
                  cursor: "pointer",
                  border: "1px solid #ccc",
                }}
              />
            ))}
        </Box>
      </Box>
    </div>
  );
};

export default EditMap;  
*/

import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  useToast,
  Heading,
  Text,
  VStack,
  Image,
  Flex,
  Grid,
} from "@chakra-ui/react";
import { createMap } from "../../utils/api";

interface MapElement {
  id?: string;
  imageUrl: string;
  width: number;
  height: number;
  staticValue: boolean;
  x?: number;
  y?: number;
}

interface MapDetails {
  thumbnail: string;
  name: string;
  dimensions: string;
}
interface EditMapProps {
  elements: MapElement[];
  mapDetails: MapDetails;

  setShowCanvas: React.Dispatch<React.SetStateAction<boolean>>;
  setFormData: React.Dispatch<React.SetStateAction<MapDetails>>;
}

const CELL_SIZE = 25;

const EditMap: React.FC<EditMapProps> = ({
  elements,
  mapDetails,

  setShowCanvas,
  setFormData,
}) => {
  const toast = useToast();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [placedElements, setPlacedElements] = useState<MapElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<MapElement | null>(
    null
  );
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [gridWidth, gridHeight] = mapDetails.dimensions.split("x").map(Number);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selectedElement) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    if (containerRef.current && selectedElement) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left - position.x) / CELL_SIZE);
      const y = Math.floor((e.clientY - rect.top - position.y) / CELL_SIZE);
      setPreviewPosition({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleElementClick = (element: MapElement) => {
    setSelectedElement(element);
  };

  const handleMapClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !selectedElement) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - position.x) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top - position.y) / CELL_SIZE);

    if (x < 0 || y < 0 || x >= gridWidth || y >= gridHeight) return;

    const isValidLocation = !placedElements.some(
      (el) => el.x === x && el.y === y
    );

    if (isValidLocation) {
      setPlacedElements((prev) => [...prev, { ...selectedElement, x, y }]);
      setSelectedElement(null);
    } else {
      toast({
        title: "Invalid Placement",
        description: "An element already exists at this location",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleSaveMap = async () => {
    try {
      const mapData = {
        thumbnail: mapDetails.thumbnail,
        name: mapDetails.name,
        dimensions: mapDetails.dimensions,
        defaultElements: placedElements
          .filter(
            (el): el is MapElement & { id: string } => el.id !== undefined
          )
          .map((el) => ({
            elementId: el.id,
            x: el.x || 0,
            y: el.y || 0,
          })),
      };

      await createMap({
        name: mapData.name,
        dimensions: mapData.dimensions,
        thumbnail: mapData.thumbnail,
        defaultElements: mapData.defaultElements,
      });

      toast({
        title: "Map Created Successfully",
        status: "success",
        duration: 3000,
      });

      setFormData({
        thumbnail: "",
        name: "",
        dimensions: "",
      });
    } catch (error) {
      console.error("Error creating map:", error);
      toast({
        title: "Error Creating Map",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
      });
    }
  };
  const wrapperStyle: React.CSSProperties = {
    overflow: "hidden",
    width: "100%",
    height: "100vh",
    position: "relative",
    backgroundColor: "gray",
    cursor: isDragging ? "grabbing" : selectedElement ? "crosshair" : "grab",
  };

  const canvasStyle: React.CSSProperties = {
    position: "absolute",
    width: `${gridWidth * CELL_SIZE}px`,
    height: `${gridHeight * CELL_SIZE}px`,
    backgroundImage: `
      linear-gradient(to right, #ddd 1px, transparent 1px),
      linear-gradient(to bottom, #ddd 1px, transparent 1px)
    `,
    backgroundColor: "gray",
    backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
    border: "1px solid #ccc",
    transform: `translate(
      ${Math.min(
        Math.max(position.x, -0.2 * gridWidth * CELL_SIZE),
        0.2 * gridWidth * CELL_SIZE
      )}px,
      ${Math.min(
        Math.max(position.y, -0.2 * gridHeight * CELL_SIZE),
        0.2 * gridHeight * CELL_SIZE
      )}px
    )`,
    userSelect: "none",
  };
  const mainImageStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    pointerEvents: "none",
  };

  const elementStyle = (
    element: MapElement,
    isPreview = false
  ): React.CSSProperties => ({
    position: "absolute",
    left: `${(element.x || 0) * CELL_SIZE}px`,
    top: `${(element.y || 0) * CELL_SIZE}px`,
    width: `${element.width * CELL_SIZE}px`,
    height: `${element.height * CELL_SIZE}px`,
    objectFit: "contain",
    pointerEvents: "none",
    opacity: isPreview ? 0.5 : element.staticValue ? 0.7 : 1,
  });

  return (
    <Flex h="100vh" w="100%" p={4}>
      {/* Element Selection Panel */}
      <Box
        w="150px"
        borderRight="1px solid"
        borderColor="gray.200"
        overflowY="auto"
      >
        <Heading size="sm">Select Elements</Heading>
        <Grid templateColumns="repeat(2, 1fr)">
          {elements.map((element) => (
            <Box
              key={element.id}
              border="1px solid"
              borderColor={
                selectedElement?.id === element.id ? "blue.500" : "gray.200"
              }
              cursor="pointer"
              onClick={() => handleElementClick(element)}
              bg={selectedElement?.id === element.id ? "blue.50" : "white"}
              _hover={{
                bg: selectedElement?.id === element.id ? "blue.50" : "gray.50",
              }}
              transition="all 0.2s"
            >
              <Image
                src={element.imageUrl}
                alt={`Element ${element.id}`}
                objectFit="cover"
                w="65px"
                height={"65px"}
                p={2}
              />
            </Box>
          ))}
        </Grid>
      </Box>

      {/* Map Editor */}
      <Box flex="1" w="100%" minHeight="100vh">
        <Box position="relative" w="100%" h="calc(100vh - 96px)">
          <div
            ref={containerRef}
            style={wrapperStyle}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleMapClick}
          >
            <div style={canvasStyle}>
              <img
                src={mapDetails.thumbnail}
                alt="Map background"
                style={mainImageStyle}
                draggable={false}
              />
              {placedElements.map((element, index) => (
                <img
                  key={`${element.id}-${index}`}
                  src={element.imageUrl}
                  alt={`Placed element ${index + 1}`}
                  style={elementStyle(element)}
                  draggable={false}
                />
              ))}
              {selectedElement && (
                <img
                  src={selectedElement.imageUrl}
                  alt="Preview"
                  style={elementStyle(
                    {
                      ...selectedElement,
                      x: previewPosition.x,
                      y: previewPosition.y,
                    },
                    true
                  )}
                  draggable={false}
                />
              )}
            </div>
          </div>

          <Box
            position="absolute"
            bottom={4}
            left={0}
            right={0}
            textAlign="center"
          >
            <Button
              colorScheme="blue"
              onClick={handleSaveMap}
              isDisabled={placedElements.length === 0}
              size="lg"
            >
              Save Map
            </Button>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default EditMap;
