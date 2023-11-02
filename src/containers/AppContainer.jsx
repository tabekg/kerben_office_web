import ChangePasswordModalComponent from '../components/ChangePasswordModalComponent.jsx'
import OperatorsModalComponent from '../components/OperatorsModalComponent.jsx'
import LayoutContainer from './LayoutContainer.jsx'
import HomeContainer from './HomeContainer.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import ArchiveContainer from './ArchiveContainer.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutContainer />,
    children: [
      {
        path: '',
        element: <HomeContainer />,
      },
      {
        path: '/archive',
        element: <ArchiveContainer />,
      },
    ],
  },
])

export default function AppContainer() {
  return (
    <>
      <ChangePasswordModalComponent />
      <OperatorsModalComponent />

      <RouterProvider router={router} />
    </>
  )
}
