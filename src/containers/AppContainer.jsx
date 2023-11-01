import {useState} from 'react'
import ChangePasswordModalComponent from '../components/ChangePasswordModalComponent.jsx'
import OperatorsModalComponent from '../components/OperatorsModalComponent.jsx'
import LayoutContainer from './LayoutContainer.jsx'
import HomeContainer from './HomeContainer.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutContainer />,
    children: [
      {
        path: '',
        element: <HomeContainer />,
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
