import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  Center,
  Stack,
  Flex,
  HStack,
  VStack,
  Image,
} from "@chakra-ui/react";

const Order = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  console.log(location);
  const { apiData } = location.state || {};
  console.log("data:-", apiData);
  //   let product=[...apiData.OrderDetails];
  //   console.log("Product:-",product);
  return (
    <Flex align="left" width="100%">
      <Box
        p={8}
        backgroundColor="gray.200"
        maxWidth="100%"
        margin="0 auto"
        borderRadius="lg"
        boxShadow="lg"
        align="left"
      >
        <Heading mb={2} textAlign="left" color="teal.600">
          Ordered History
        </Heading>
        {/* <Text fontSize="sm" color="gray.900">
          Discount: {apiData.Total_Discount_Amount.toFixed(2)}
        </Text>
        <Text fontSize="sm" color="gray.900">
          Total Order: {apiData.Total_Order}
        </Text> */}
        {loading ? (
          <HStack justifyContent="center">
            <Spinner size="lg" color="teal.500" />
          </HStack>
        ) : error ? (
          <Alert status="error" mb={6} borderRadius="md">
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : apiData.OrderDetails && apiData.OrderDetails.length > 0 ? (
          <VStack spacing={6} align="start" width="100%">
            <Text fontSize="sm" color="gray.900">
              Discount: {apiData.Total_Discount_Amount.toFixed(2)}
            </Text>
            <Text fontSize="sm" color="gray.900">
              Total Order: {apiData.Total_Order}
            </Text>
            {apiData.OrderDetails.map((item, index) => (
              <Box
                key={index}
                p={4}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                boxShadow="sm"
                backgroundColor="white"
                _hover={{ boxShadow: "md", transform: "scale(1.02)" }}
                transition="all 0.3s ease"
                width="100%"
              >
                {item.products.map((product, productIndex) => (
                  <HStack spacing={4} align="left" key={productIndex}>
                    <Image
                      src={"https://via.placeholder.com/100"}
                      alt={item.name || "Product Image"}
                      boxSize="100px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="lg" fontWeight="bold" color="teal.700">
                        {product.name || "Unknown Product"}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Price: {product.price || "N/A"}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Discount: {product.discountOnProduct || "N/A"}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Quantity: {product.quantity}
                      </Text>
                    </VStack>
                  </HStack>
                ))}
              </Box>
            ))}
          </VStack>
        ) : (
          <Flex justifyContent="center" alignItems="center" height="200px">
            <Text fontSize="lg" color="gray.600">
              No Order From You
            </Text>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default Order;
