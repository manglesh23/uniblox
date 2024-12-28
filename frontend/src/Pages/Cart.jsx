import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Button,
  useToast,
} from "@chakra-ui/react";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const toast = useToast();

  useEffect(() => {
    const fetchUserCart = async () => {
      try {
        let getToken = localStorage.getItem("authToken");
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "http://localhost:4000/cart/getcartproduct",
          headers: {
            Authorization: getToken,
          },
        };

        let response = await axios(config);
        console.log(response);
        setCartProducts(response.data.items || []);
      } catch (e) {
        console.error("Error fetching cart products:", err);
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchUserCart();
  }, []);

  const calculateSubtotal = () => {
    return cartProducts.reduce((total, item) => {
      const price = item.productId?.price || 0;
      const quantity = item.quantity || 0;
      //   setTotal(total+price*quantity);
      return total + price * quantity;
    }, 0);
  };

  const handlepayment = async () => {
    try {
      console.log("handle payment");
      const subtotal = calculateSubtotal();
      console.log(subtotal);
      let getToken = localStorage.getItem("authToken");
      let data = JSON.stringify({
        couponCode: "10PERCENT",
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:4000/order/orderplace",
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken,
        },
        data: data,
      };

      let response = await axios(config);
      console.log("Checkout Response:-", response);
      if (response.data.success) {
        toast({
          title: "Order Placed Succssfully",
          description: "",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Falied to Place order",
          description: "",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (e) {
      toast({
        title: "Falied to Place order",
        description: e,
        status: "Falied",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <Box
      p={8}
      backgroundColor="white"
      width="1350px"
      margin="0"
      justifyContent="center"
    >
      <Heading mb={6}>Cart Products</Heading>
      {loading ? (
        <HStack justifyContent="center">
          <Spinner size="lg" />
        </HStack>
      ) : error ? (
        <Alert status="error" mb={6}>
          <AlertIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : cartProducts.length > 0 ? (
        <>
          <VStack spacing={6} align="stretch">
            {cartProducts.map((item, index) => (
              <Box
                key={index}
                p={4}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                boxShadow="sm"
              >
                <HStack spacing={4}>
                  <Image
                    src="https://via.placeholder.com/100"
                    alt="Product Image"
                    boxSize="100px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                  <VStack align="start" spacing={1}>
                    <Text fontSize="lg" fontWeight="bold">
                      {item.productId?.name || "Unknown Product"}
                    </Text>
                    <Text>Price: {item.productId?.price || "N/A"}</Text>
                    <Text>Quantity: {item.quantity}</Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
          <Divider my={6} />
          <Flex justifyContent="flex" alignItems="center" mt={4}>
            <Text fontSize="xl" fontWeight="bold">
              Subtotal: {calculateSubtotal().toFixed(2)}
            </Text>
            <Button
              justifyContent="flex-end"
              margin="10"
              onClick={handlepayment}
            >
              Check Out
            </Button>
          </Flex>
        </>
      ) : (
        <Text>Your cart is empty.</Text>
      )}
    </Box>
  );
};

export default Cart;
