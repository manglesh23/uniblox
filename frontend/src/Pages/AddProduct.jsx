import React, { useState } from "react";
import {
  Box,
  Input,
  FormLabel,
  Button,
  Textarea,
  Stack,
  useToast
} from "@chakra-ui/react";
import axios from "axios";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const toast=useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let token = localStorage.getItem("authToken");
    try {
      console.log("Add product");

      let data = JSON.stringify({
        name: name,
        category: category,
        stock: stock,
        price: price,
        description: description,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:4000/product/createproduct",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: data,
      };

      let response = await axios(config);
      console.log("Response:-", response);
      if(response.data.success){
        setName("");
        setCategory("");
        setPrice("");
        setDescription("");
        setStock("");
        toast({
          title: "Product Added Successfully",
          description: "",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (e) {
      console.warn(e.message);
      toast({
        title: "Failed to add product",
        description: "",
        status: "Failed",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <Box
      maxW="300px"
      mx="auto"
      mt="10"
      p="6"
      borderWidth="1px"
      borderRadius="md"
      boxShadow="lg"
      bg="white"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {/* Name */}
          <Box>
            <FormLabel htmlFor="name">Product Name</FormLabel>
            <Input
              id="name"
              name="name"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Box>

          {/* Category */}
          <Box>
            <FormLabel htmlFor="category">Category</FormLabel>
            <Input
              id="category"
              name="category"
              placeholder="Enter product category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Box>

          {/* Price */}
          <Box>
            <FormLabel htmlFor="price">Price (in $)</FormLabel>
            <Input
              id="price"
              name="price"
              placeholder="Enter product price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Box>

          {/* Stock */}
          <Box>
            <FormLabel htmlFor="stock">Stock</FormLabel>
            <Input
              id="stock"
              name="stock"
              placeholder="Enter available stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </Box>

          {/* Description */}
          <Box>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Box>

          {/* Submit Button */}
          <Button type="submit" colorScheme="blue" size="lg" width="full">
            Add Product
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default AddProduct;
