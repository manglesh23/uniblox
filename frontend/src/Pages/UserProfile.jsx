import React from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Heading,
  VStack,
  HStack,
  Divider,
  Button,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

function UserProfile() {
  let location = useLocation();
  //   console.log("Location:-", location.state.apiData);
  const { name, email, mobileNumber, role, image, address } =
    location.state.apiData;
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      height="100%"
      bg="gray.50"
    >
      <Box
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="lg"
        maxWidth="400px"
        width="full"
      >
        <Flex justifyContent="center" mb={6}>
          <Avatar size="xl" src={image || "https://via.placeholder.com/150"} />
        </Flex>
        <VStack spacing={4} align="start">
          <Heading size="lg" color="teal.600">
            {name || "John Doe"}
          </Heading>
          <Text fontSize="sm" color="gray.500">
            Role: {role || "User"}
          </Text>
          <Divider />
          <HStack>
            <Text fontWeight="bold" color="gray.700">
              Mobile:
            </Text>
            <Text>{mobileNumber || "Not Provided"}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold" color="gray.700">
              Email Id:
            </Text>
            <Text>{email || "Not Provided"}</Text>
          </HStack>
          <HStack alignItems="start">
            <Text fontWeight="bold" color="gray.700">
              Address:
            </Text>
            <Text>{address || "Not Provided"}</Text>
          </HStack>
          <Divider />
          <Button
            colorScheme="teal"
            width="full"
            onClick={() => alert("Profile Clicked")}
          >
            Edit Profile
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}

export default UserProfile;
