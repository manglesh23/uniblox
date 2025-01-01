import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Image,
  Input,
  Button,
  Grid,
  GridItem,
  IconButton,
  HStack,
  VStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  Spinner,
  useToast,
  Badge,
  
} from "@chakra-ui/react";
// import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";
import { FiShoppingCart, FiUser, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const [role, setRole] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const navigate=useNavigate();

  const getMyProfile = () => {
    console.log("get my profile");
  };
  const addproduct = () => {
    console.log("add product");
    navigate("/addproduct");
  };
  const logout = () => {
    console.log("Log Out");
    localStorage.removeItem("authToken");
    // alert("Logged out successfully!");
    window.location.href = "/";
  };
  
  const getOrderHistory = () => {
    console.log("get order history");
  };
  
  const handleCart = () => {
    console.log("cart");
  };
  

  return (
    <Flex
      justify="space-between"
      align="center"
      bg="white"
      p={4}
      boxShadow="sm"
      position="sticky"
      w="100%"
      zIndex="dropdown"
    >
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color="teal.500"
        fontStyle="oblique"
        align="start"
      >
        Uniblox
      </Text>
      <Flex gap={2} width="70%" alignContent="flex-start">
        <Input
          placeholder="Search For Products"
          width="90%"
          bg="white"
          borderRadius="md"
        />
        <IconButton
          aria-label="Search"
          icon={<FiSearch />}
          colorScheme="teal"
          //  w="full"
        />

        <HStack spacing={4}>
          <Menu isLazy placement="top">
            <Tooltip label="User Profile" aria-label="User Profile Tooltip">
              <MenuButton
                as={IconButton}
                aria-label="User Profile"
                icon={<FiUser />}
                variant="ghost"
                fontSize="xl"
              />
            </Tooltip>
            <MenuList zIndex="dropdown" borderRadius="md" boxShadow="md">
              <MenuItem onClick={getMyProfile}>Profile</MenuItem>
              {/* <MenuItem>Settings</MenuItem> */}
              <MenuItem onClick={getOrderHistory}>Order</MenuItem>
              {role === "Admin" && (
                <MenuItem onClick={addproduct}>Add Product</MenuItem>
              )}
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>

          <Box position="relative" display="inline-block">
            <IconButton
              aria-label="Shopping Cart"
              icon={<FiShoppingCart />}
              variant="ghost"
              fontSize="xl"
              onClick={handleCart}
            />
            {cartCount > 0 && (
              <Badge
                position="absolute"
                top="-1"
                right="-1"
                backgroundColor=""
                color="black"
                borderRadius="full"
                fontSize="xs"
                px={2}
                py={1}
              >
                {cartCount}
              </Badge>
            )}
          </Box>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default Navbar;
