import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <ChakraProvider>
      <QueryClientProvider client={queryClient}>
      <App />
      </QueryClientProvider>
    </ChakraProvider>
  </BrowserRouter>
)
