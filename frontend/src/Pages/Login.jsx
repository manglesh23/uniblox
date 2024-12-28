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
  useToast
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const toast=useToast();

  const handleLogin = async (event) => {
    try {
      event.preventDefault();
      console.log(email, password);
      let data = JSON.stringify({
        email: email,
        password: password,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:4000/user/login",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      let response = await axios(config);
      console.log("Response:-", response);
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        navigate("/home");
      } else {
        toast({
            title: 'Login Failed.',
            description: 'Incorrect Credentials',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
      }
      console.log("Login Submitted");
    } catch (e) {
      alert("Incorrect Credentials");
    }
  };

  const handleClick=()=>{
    console.log("click")
    navigate("/signup")
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="white" backgroundColor="white">
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl">Sign in to your account</Heading>
          {/* <Text fontSize="lg" color="gray.600">
            to enjoy all our cool <Link color="blue.400">features</Link> ✌️
          </Text> */}
        </Stack>
        <Box rounded="lg" bg="white" boxShadow="lg" p={8}>
          <Stack spacing={4}>
            <form onSubmit={handleLogin}>
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
                <Button type="submit" mt={4} colorScheme="blue" size="lg" >
                  Sign In
                </Button>
              </Stack>
            </form>
            <Stack pt={6}>
              <Text align="center">
                Don't have an account? <Link color="blue.400" onClick={handleClick}>Sign Up</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default LoginPage;
