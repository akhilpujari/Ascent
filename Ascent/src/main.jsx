import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import DashBoard from './DashBoard.jsx'
import './index.css'
import Analytics from './Analytics.jsx';
import { Provider } from 'react-redux';
import {store} from './utils/store.jsx'



const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<Login/>
  },
  {
    path:'/register',
    element:<Register></Register>
  },
  {
    path: "/",
    element: <App />, // App wraps sidebar + outlet
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashBoard/>
          </ProtectedRoute>
        )
      },
      {
        path: "analytics",
        element: (
          <ProtectedRoute>
            <Analytics/>
          </ProtectedRoute>
        )
      },
      // {
      //   path: "notes",
      //   element: <Notes />,
      // },
    ],
  },
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={appRouter}/>
          {/* Toast Container for notifications */}
      <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored" // or "dark"
      style={{ marginTop: '80px' }} // Adjust based on your header height
    />
    </Provider> 
  </StrictMode>,
)
