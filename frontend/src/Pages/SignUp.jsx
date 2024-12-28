import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    try {
      event.preventDefault();
      console.log("Sign up");
      console.log(name, email, mobileNumber, password);

      let data = JSON.stringify({
        name: name,
        mobileNumber: mobileNumber,
        email: email,
        password: password,
        role: "Customer",
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:4000/user/signup",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      let response = await axios(config);
      console.log("Response:-", response);
      if (response.data.success) {
        toast({
          title: "Sign Up successful.",
          description: "You have successfully Registered in!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      } else {
        toast({
          title: "Sign Up Failed",
          description: "",
          status: "failed",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (e) {
      alert("failed");
    }
  };

  return (
    <Flex minH="90vh" align="center" justify="center" bg="white">
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
        <Box rounded="lg" bg="white" boxShadow="lg" p={8} w="400px">
          <form onSubmit={handleSignUp}>
            <FormControl id="name" isRequired>
              <FormLabel>Name </FormLabel>
              <Input
                type="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl id="mobilenumber" isRequired>
              <FormLabel>Mobile Number</FormLabel>
              <Input
                type="mobilenumber"
                placeholder="Enter your Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={10}>
              <Button type="submit" mt={4} colorScheme="blue" size="lg">
                Sign Up
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}

export default SignUp;
