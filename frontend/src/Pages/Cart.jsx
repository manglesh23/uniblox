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
  Input,
} from "@chakra-ui/react";
import Navbar from "../Component/Navbar";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [userCoupons, setUserCoupons] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [coupon, setCoupon] = useState("");
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

  useEffect(() => {
    const fetchCouponCode = async () => {
      let getToken = localStorage.getItem("authToken");
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "http://localhost:4000/coupon/getcoupon",
          headers: {
            Authorization: getToken,
          },
        };

        let response = await axios(config);
        console.log("Coupon Code:-", response);
        setUserCoupons(response.data.message);
      } catch (e) {
        console.error("Error fetching cart products:", err);
        setError(err.response?.data?.message || "An error occurred");
      }
    };
    fetchCouponCode();
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
      console.log(coupon);
      let getToken = localStorage.getItem("authToken");
      let data = JSON.stringify({
        couponCode: coupon,
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
      }
    } catch (e) {
      const errorMessage =
        e.response && e.response.data && e.response.data.message
          ? e.response.data.message
          : "Failed to Place Order";

      // Show error message in toast
      toast({
        title: "Failed to Place Order",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const removeFromCart=()=>{
    console.log("remove from cart")
  }

  return (
    <Box>
      <Navbar/>
    <Box display="flex" width="190vh">
      <Box p={8} backgroundColor="white" width="100%" margin="0">
        <Heading mb={6} textAlign="left" fontStyle="oblique" fontSize={30}>
          Cart Products
        </Heading>

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
            <VStack spacing={6} align="start">
              {cartProducts.map((item, index) => (
                <Box
                  key={index}
                  p={4}
                  border="1px"
                  borderColor="gray.200"
                  borderRadius="md"
                  boxShadow="sm"
                  width="100%"
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
                      <Button onClick={removeFromCart}>Remove</Button>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
            <Divider my={6} />

            <Box display="flex" justifyContent="flex-start" width="100%" mt={4}>
              <Input
                width="70%"
                id="coupon"
                name="coupon"
                placeholder="Enter Coupon Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
            </Box>

            <Flex justifyContent="space-between" alignItems="center" mt={4}>
              <Text fontSize="xl" fontWeight="bold">
                Subtotal: {calculateSubtotal().toFixed(2)}
              </Text>
              <Button colorScheme="blue" onClick={handlepayment}>
                Check Out
              </Button>
            </Flex>
          </>
        ) : (
          <Text>Your cart is empty.</Text>
        )}
      </Box>
      <Box
        mb={4}
        margin="50px"
        width="70%"
        borderRadius="10px"
        borderColor="black"
      >
        <Text fontSize="lg" fontWeight="bold">
          Available Coupon Codes:
        </Text>
        <VStack
          spacing={2}
          align="center"
          borderRadius="10px"
          borderColor="black"
          borderWidth="1px"
        >
          {userCoupons.length > 0 ? (
            userCoupons.map((couponCode, index) => (
              <Box
                key={index}
                p={2}
                border="10px"
                borderColor="gray.900"
                borderRadius="md"
                width="fit-content"
                justifyContent="flex-end"
              >
                <Text
                  fontSize="sm"
                  color="gray.600"
                  fontWeight="bold"
                  width="100%"
                >
                  {couponCode.code}
                </Text>
              </Box>
            ))
          ) : (
            <Text>No coupons available for use.</Text>
          )}
        </VStack>
      </Box>
    </Box>
    </Box>
  );
};

export default Cart;
