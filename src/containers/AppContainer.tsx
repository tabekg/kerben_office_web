import ChangePasswordModalComponent from '../components/ChangePasswordModalComponent'
import OperatorsModalComponent from '../components/OperatorsModalComponent'
import LayoutContainer from './LayoutContainer'
import HomeContainer from './HomeContainer'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import ArchiveContainer from './ArchiveContainer'
import CompletedShipmentsContainer from './CompletedShipmentsContainer'
import InvoicesContainer from './InvoicesContainer'

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
      {
        path: '/shipments/completed',
        element: <CompletedShipmentsContainer />,
      },
      {
        path: '/invoices',
        element: <InvoicesContainer />,
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
