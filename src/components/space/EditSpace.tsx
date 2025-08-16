import React, { useState, useRef, useEffect } from "react";
import {
  useParams,
  useLocation,
  UNSAFE_getPatchRoutesOnNavigationFunction,
} from "react-router-dom";
import {
  Box,
  Button,
  useToast,
  Heading,
  Image,
  Flex,
  Grid,
  Text,
} from "@chakra-ui/react";
import {
  addElementToSpace,
  fetchSpaceDetails,
  fetchElements,
} from "../../utils/api";
import { Space, Element } from "../../types/api.types";
import { useNavigate } from "react-router-dom";

interface SpaceElementParameter {
  spaceId?: string;
  elementId?: string;
  imageUrl: string;
  id?: string;
  width: number;
  height: number;
  staticValue: boolean;
  x: number;
  y: number;
}
const CELL_SIZE = 25;
const EditSpace = () => {
  const toast = useToast();
  const navigate = useNavigate();
  //const { spaceId } = useParams<{ spaceId: string }>();
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [space, setSpace] = useState<Space>();
  // const [preview, setPreview] = useState(false)
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const location = useLocation();
  const [placedElements, setPlacedElements] = useState<SpaceElementParameter[]>(
    []
  );
  const [gridDimensions, setGridDimensions] = useState({
    gridWidth: 0,
    gridHeight: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loadElements = async (currentSpace: Space) => {
      try {
        const fetchedElements: Element[] = await fetchElements();
        setElements(fetchedElements);

        const initialElements = currentSpace?.elements || [];
        const convertedElements: SpaceElementParameter[] = initialElements.map(
          (element) => ({
            ...element,
            x: element.x || 0,
            y: element.y || 0,
            imageUrl:
              fetchedElements.find((el: any) => el.id === element.elementId)
                ?.imageUrl || "",
            width:
              fetchedElements.find((el: any) => el.id === element.elementId)
                ?.width || 0,
            height:
              fetchedElements.find((el: any) => el.id === element.elementId)
                ?.height || 0,
            staticValue:
              fetchedElements.find((el: any) => el.id === element.elementId)
                ?.staticValue || false,
          })
        );

        console.log("Initial Elements:", initialElements);
        console.log("Converted Elements:", convertedElements);
        setPlacedElements(convertedElements);
      } catch (error) {
        toast({
          title: "Error fetching elements",
          description: error instanceof Error ? error.message : "Unknown error",
          status: "error",
          duration: 3000,
        });
      }
    };

    if (location.state?.space) {
      const spaceData = location.state.space;
      setSpace(spaceData);
      console.log("Space Data:", spaceData);

      setGridDimensions({
        gridWidth: spaceData.width,
        gridHeight: spaceData.height,
      });

      loadElements(spaceData); // Pass the space data directly to avoid timing issues.
    } else {
      console.warn("Space data is missing from the navigation state");
      toast({
        title: "Space data is not available",
        status: "error",
        duration: 3000,
      });
    }
  }, [location.state, toast]);

  const handleSaveSpace = async () => {
    try {
      const existingElementId = space?.elements?.map((ele) => ele.id);
      const newElements = placedElements.filter(
        (element) => !existingElementId?.includes(element.id || " ")
      );
      newElements.forEach(async (element) => {
        console.log(element?.elementId || "", element.spaceId || "");
        await addElementToSpace(
          element.spaceId || "",
          element?.elementId || "",

          element.x,
          element.y
        );
      });
      toast({
        title: "Space saved successfully",
        status: "success",
        duration: 3000,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error saving space",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
      });
    }
  };
  const handleElementClick = (element: Element) => {
    setSelectedElement(element);
  };

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
    // Update preview position for showing the element preview
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

  const handleMapClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !selectedElement) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - position.x) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top - position.y) / CELL_SIZE);
    if (
      x < 0 ||
      y < 0 ||
      x >= gridDimensions.gridWidth ||
      y >= gridDimensions.gridHeight
    )
      return;

    const isValidLocation = !placedElements.some(
      (el) => el.x === x && el.y === y
    );

    if (isValidLocation) {
      setPlacedElements((prev) => {
        const newElement = {
          ...selectedElement,
          x,
          y,
          spaceId: space?.id,
          elementId: selectedElement.id,
        };
        return [...prev, newElement];
      });
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
    width: `${gridDimensions.gridWidth * CELL_SIZE}px`,
    height: `${gridDimensions.gridHeight * CELL_SIZE}px`,
    backgroundImage: `
      linear-gradient(to right, #ddd 1px, transparent 1px),
      linear-gradient(to bottom, #ddd 1px, transparent 1px)
    `,
    backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
    border: "1px solid #ccc",
    transform: `translate(
      ${Math.min(
        Math.max(position.x, -0.2 * gridDimensions.gridWidth * CELL_SIZE),
        0.2 * gridDimensions.gridWidth * CELL_SIZE
      )}px,
      ${Math.min(
        Math.max(position.y, -0.2 * gridDimensions.gridHeight * CELL_SIZE),
        0.2 * gridDimensions.gridHeight * CELL_SIZE
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
    element: SpaceElementParameter,
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
        w="200px"
        borderRight="1px solid"
        borderColor="gray.200"
        overflowY="auto"
        p={4}
      >
        <Heading size="sm">Element Selection</Heading>
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
              _hover={{
                bg: selectedElement?.id === element.id ? "blue.50" : "gray.50",
              }}
              transition="all 0.2s"
            >
              <Image
                src={element.imageUrl}
                alt={element.imageUrl}
                objectFit="cover"
                w="90px"
                height="90px"
                p={2}
              />
            </Box>
          ))}
        </Grid>
      </Box>

      {/* Space Editor */}
      <Box flex="1" w="100%">
        <Box position="relative" w="100%" h="calc(100vh-96px)">
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
                src={space?.thumbnail}
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
              onClick={handleSaveSpace}
              isDisabled={placedElements.length === 0}
              size="lg"
            >
              Save Space
            </Button>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default EditSpace;
