import { Button } from 'components'
import {
  Link,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'

const router = createBrowserRouter([
  {
    element: (
      <div>
        <div>navigate</div>
        <Outlet />
      </div>
    ),
    errorElement: <>Error Page</>,
    children: [
      {
        path: '/',
        element: (
          <div>
            React Application
            <br />
            <Button />
            <Link to="/test">go to test</Link>
          </div>
        ),
      },
      {
        path: '/test',
        element: (
          <div>
            React Application test
            <br />
            <Button />
          </div>
        ),
      },
    ],
  },
])

export const AppRoutes = () => <RouterProvider router={router} />
