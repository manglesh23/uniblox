// import { Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Text,
  Heading,
  VStack,
  Button,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const PaymentComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderId, setOrderId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isMounted, setIsMounted] = useState(true); // Tracks if the component is mounted

  console.log("Location for price description:", location);
  const { price, productName, description } = location.state;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      setIsMounted(false); // Mark component as unmounted
      document.body.removeChild(script); // Cleanup Razorpay script
    };
  }, []);

  const handlePayment = async () => {
    try {
      const response = await fetch("http://localhost:4000/payment/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: price, // Amount in INR
          currency: "INR",
          receipt: "order_rcptid_11", // Unique identifier
        }),
      });

      const data = await response.json();
      console.log("Create Order:", data);

      setOrderId(data.id);
      openRazorpayCheckout(data.id, data.amount, data.currency);
    } catch (error) {
      console.error("Error creating order:", error);
      if (isMounted)
        setPaymentStatus("Error initiating payment. Please try again.");
    }
  };

  const openRazorpayCheckout = (orderId, amount, currency) => {
    console.log("Opening Razorpay checkout");
    const options = {
      key: "rzp_test_FgDeQOasYdxuEs", // Razorpay Key ID
      amount, // Amount in paise
      currency,
      order_id: orderId,
      name: "E-Commerce App",
      description: "Test Transaction",
      handler: async (response) => {
        console.log("Payment successful. Response:", response);
        await verifyPayment(response);
      },
      prefill: {
        name: "Test User",
        email: "test.user@example.com",
        contact: "8084377799",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const verifyPayment = async (paymentDetails) => {
    try {
      console.log("Verifying payment");
      const response = await fetch(
        "http://localhost:7000/payment/verifypayment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentDetails),
        }
      );

      const data = await response.json();
      console.log("Payment verification response:", data);

      if (isMounted) {
        if (data.success) {
          setPaymentStatus("Payment Done Successfully!");
          setTimeout(() => {
            // console.log("After three 3 seconds");
            navigate("/home"); // Navigate to home on success
          }, 3000);
        } else {
          setPaymentStatus("Payment Verification Failed!");
        }
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      if (isMounted) setPaymentStatus("Payment Verification Failed!");
    }
  };

  return (
    <Box
      maxW="500px"
      mx="auto"
      mt={8}
      p={6}
      borderRadius="md"
      boxShadow="lg"
      backgroundColor="gray.50"
    >
      <Heading as="h2" size="lg" mb={4} textAlign="center" color="teal.500">
        Checkout
      </Heading>
      <VStack spacing={3} align="stretch">
        <Text fontSize="md">
          <Text as="span" fontWeight="bold">
            Product:
          </Text>{" "}
          {productName}
        </Text>
        <Text fontSize="md">
          <Text as="span" fontWeight="bold">
            Description:
          </Text>{" "}
          {description}
        </Text>
        <Text fontSize="md">
          <Text as="span" fontWeight="bold">
            Price:
          </Text>{" "}
          ₹{price?.toFixed(2)}
        </Text>
        {paymentStatus && (
          <Alert
            status={paymentStatus.includes("Failed") ? "error" : "success"}
            borderRadius="md"
          >
            <AlertIcon />
            {paymentStatus}
          </Alert>
        )}
        <Button
          colorScheme="teal"
          size="md"
          onClick={handlePayment}
          alignSelf="center"
        >
          Proceed to Payment
        </Button>
      </VStack>
    </Box>
  );
};

export default PaymentComponent;
