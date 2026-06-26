// Imports
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

// Layouts
import RootLayout from "./layouts/RootLayout"

// Pages
import Main from "./pages/Main/Main"
import About from "./pages/About/About"
import ErrorPage from "./pages/ErrorPage/ErrorPage"

// Styles
import './App.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
      <Route index element={<Main />} />
      <Route path="/about" element={<About />} />
    </Route>
  )
)

export default function App() {
  return (
    <RouterProvider router={router}>
    </RouterProvider>
  )
}
