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
import { FiShoppingCart, FiUser, FiSearch } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import Order from "./Order";

const fetchProduct = async ({ pageParam = 1 }) => {
  // console.log("Page Param:-", pageParam);
  let response = await axios.get(
    `http://localhost:4000/product/getproduct?page=${pageParam}&limit=4`
  );
  return response.data;
  // console.log("Response:-", response.data);
};

const Home = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: fetchProduct,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const { currentPage, totalPages } = lastPage;

      let nextPage = currentPage <= totalPages ? currentPage + 1 : undefined;

      return nextPage;
    },
  });

  const [role, setRole] = useState(null);
  const [order, setOrder] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchUserRole = () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          let user = jwtDecode(token);
          console.log("User:-", user);
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

  const logout = () => {
    console.log("Log Out");
    localStorage.removeItem("authToken");
    // alert("Logged out successfully!");
    window.location.href = "/";
  };

  const addproduct = () => {
    navigate("/addproduct");
  };

  const handleBuyNow = (product) => {
    console.log("Buy Now");
    navigate("/payment", {
      state: {
        price: product.price, // Example price
        productName: product.name,
        description: "Product Description",
      },
    });
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box textAlign="center" mt="10">
        <Text fontSize="lg" color="red.500">
          Failed to load products. Please try again later.
        </Text>
      </Box>
    );
  }

  const handleClick = async (product) => {
    console.log("Add to cart", product);
    let getToken = localStorage.getItem("authToken");
    // console.log("Token:-",getToken)
    let data = JSON.stringify({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:4000/cart/addtocart",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken,
      },
      data: data,
    };

    let response = await axios(config);
    console.log("Response:-", response);
    if (response.data.success) {
      toast({
        title: "Added to Cart Successfully",
        description: "",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Failed to Add",
        description: "",
        status: "failed",
        duration: 3000,
        isClosable: true,
      });
    }
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
    setOrder(response.data);
    if (response.data) {
      navigate("/order", { state: { apiData: response.data } });
      // <Order data={response.data}/>
    }
  };

  const getMyProfile = async () => {
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

  return (
    <Box
      bg="gray.50"
      minH="100vh"
      display="flex"
      flexDirection="column"
      width="190vh"
    >
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
      <Box
        width="100%"
        h="300px"
        bgImage="url('https://via.placeholder.com/1200x300')"
        bgSize="cover"
        bgPosition="center"
        position="relative"
      >
        <Flex
          direction="column"
          justify="center"
          align="center"
          h="full"
          bg="rgba(0, 0, 0, 0.5)"
          color="white"
          textAlign="center"
          width="100%"
          size="lg"
        >
          <Text fontSize="3xl" fontWeight="bold">
            Welcome to Uniblox Store
          </Text>
          <Text fontSize="lg" mt={2}>
            Your one-stop destination for all your shopping needs.
          </Text>
          <Button mt={4} colorScheme="teal" size="lg">
            Shop Now
          </Button>
        </Flex>
      </Box>

      {/* Category Section */}
      <Box p={4} w="100%">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          {/* Categories */}
        </Text>
        <Flex gap={4} overflowX="auto" width="100%" justifyContent="center">
          {["Electronics", "Fashion", "Mobile", "Books", "Sports", "Shoes"].map(
            (category) => (
              <Button key={category} colorScheme="teal" size="sm">
                {category}
              </Button>
            )
          )}
        </Flex>
      </Box>

      {/* Featured Products */}
      <Box p={4} width="100%">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Featured Products
        </Text>
        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
          {data?.pages.map((page, pageIndex) =>
            page.products.map((product) => (
              <GridItem
                key={`${pageIndex}-${product._id}`}
                bg="white"
                p={4}
                borderRadius="md"
                boxShadow="sm"
                borderWidth="1px"
                borderColor="gray.200"
              >
                <Image
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.name}
                  borderRadius="md"
                  mb={3}
                />
                <Text fontSize="lg" fontWeight="bold" noOfLines={1}>
                  {product.name}
                </Text>
                <Text color="teal.500" fontSize="md" mt={1}>
                  ₹{product.price}
                </Text>
                <HStack spacing={4} mt={3} width="100%">
                  <Button
                    colorScheme="teal"
                    size="sm"
                    onClick={() => handleClick(product)}
                    width="50%"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    colorScheme="teal"
                    size="sm"
                    onClick={() => handleBuyNow(product)}
                    width="50%"
                  >
                    Buy Now
                  </Button>
                </HStack>
              </GridItem>
            ))
          )}
        </Grid>
        {hasNextPage && (
          <Box textAlign="center" mt={8}>
            <Button
              onClick={() => fetchNextPage()}
              isDisabled={!hasNextPage || isFetchingNextPage}
              isLoading={isFetchingNextPage}
              colorScheme="teal"
            >
              {isFetchingNextPage
                ? "Loading..."
                : hasNextPage
                ? "Load More"
                : "No More Products"}
            </Button>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box bg="gray.800" color="white" p={6} mt={8}>
        <Flex justify="space-between" flexWrap="wrap">
          <VStack align="flex-start" spacing={2}>
            <Text fontWeight="bold">Uniblox</Text>
            <Text>About Us</Text>
            <Text>Contact Us</Text>
          </VStack>
          <VStack align="flex-start" spacing={2}>
            <Text fontWeight="bold">Support</Text>
            <Text>FAQs</Text>
            <Text>Return Policy</Text>
          </VStack>
          <VStack align="flex-start" spacing={2}>
            <Text fontWeight="bold">Follow Us</Text>
            <Text>Facebook</Text>
            <Text>Instagram</Text>
          </VStack>
        </Flex>
      </Box>
    </Box>
  );
};

export default Home;
