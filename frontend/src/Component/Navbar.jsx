import React, { useEffect, useState } from "react";
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
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Navbar = () => {
  const [role, setRole] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          let user = jwtDecode(token);
          //   console.log("User:-", user);
          setRole(user.role);
        } else {
          console.warn("not token");
        }
      } catch (err) {
        console.log("Error:-", err);
      }
    };
    fetchUserRole();
  }, []);

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
        // console.log("Cart Product:-", response);
        // setCartProducts(response.data.items || []);
        setCartCount(response.data.items.length);
        // cartCount = response.data.items.length;
      } catch (e) {
        console.error("Error fetching cart products:", e);
        // setError(err.response?.data?.message || "An error occurred");
      }
    };
    fetchUserCart();
  }, []);

  const getMyProfile = async() => {
    console.log("get my profile");
    try {
        let getToken = localStorage.getItem("authToken");
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "http://localhost:4000/user/getuser",
          headers: {
            Authorization: getToken,
          },
        };
  
        let response = await axios(config);
        // console.log("User Profile:-", response);
        if (response) {
          navigate("/user", { state: { apiData: response.data.msg } });
        }
      } catch (e) {
        console.error(e);
      }
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

  const handleCart = () => {
    console.log("Handle Cart");
    navigate("/cart");
  };

  const getOrderHistory = async () => {
    console.log("order history");
    let getToken = localStorage.getItem("authToken");
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:4000/order/getorder",
      headers: {
        Authorization: getToken,
      },
    };

    let response = await axios(config);
    // console.log(response);
    // setOrder(response.data);
    if (response.data) {
      navigate("/order", { state: { apiData: response.data } });
      // <Order data={response.data}/>
    }
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
        role="button"
        tabIndex="0"
        onClick={() => navigate("/home")}
        onKeyDown={(e) => e.key === "Enter" && navigate("/home")}
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
