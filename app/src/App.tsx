// Imports
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

// Layouts
import RootLayout from "./layouts/RootLayout"

// Pages
import Main from "./pages/Main/Main"
import ErrorPage from "./pages/ErrorPage/ErrorPage"
import ProductPage from './pages/ProductPage/ProductPage'

// Styles
import './App.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
      <Route path="/" element={<Main />}>
        <Route path="product/:product" element={<ProductPage />} />
      </Route>
    </Route>
  )
)

export default function App() {
  return (
    <RouterProvider router={router}>
    </RouterProvider>
  )
}
