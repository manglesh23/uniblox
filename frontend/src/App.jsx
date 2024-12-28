import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './Pages/Login'
import Home from './Pages/Home'
import SignUp from './Pages/SignUp'
import ProtectedRoute from "./helper/protectedRouter"
import Cart from './Pages/Cart'
import AddProduct from './Pages/AddProduct'
import Order from './Pages/Order'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
         <Route path='/' element={<LoginPage/>}/>
         <Route path='/home' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
         <Route path='/signup' element={<SignUp/>}/>
         <Route path='/cart' element={<Cart/>}/>
         <Route path='/addproduct' element={<AddProduct/>}/>
         <Route path='/order' element={<Order/>}/>
      </Routes>
    </>
  )
}

export default App
