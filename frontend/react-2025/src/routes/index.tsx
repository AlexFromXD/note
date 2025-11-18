
import { BasicLayout } from "@/layouts/BasicLayout"
import { ContentPanel } from '@/layouts/ContentPanel'
import { MainPanel } from '@/layouts/MainPanel'
import { createBrowserRouter, Navigate } from "react-router-dom"
import { DMContentPanel } from "../features/dm/components/ContentPanel"
import { DMRouteWrapper } from "../features/dm/components/DMRouteWrapper"
import { DMMainPanel } from "../features/dm/components/MainPanel"
import { ProtectedDMRoute } from "../features/dm/components/ProtectedDMRoute"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/home",
    element: (
      <BasicLayout
        contentPanel={<ContentPanel feature='Home' />}
        mainPanel={<MainPanel feature='Home' />}
      />
    ),
  },
  {
    path: "/home/*",
    element: (
      <BasicLayout
        contentPanel={<ContentPanel feature='Home' />}
        mainPanel={<MainPanel feature='Home' />}
      />
    ),
  },
  {
    path: "/dm",
    element: (
      <DMRouteWrapper>
        <BasicLayout
          contentPanel={<DMContentPanel />}
          mainPanel={<DMMainPanel/>}
        />
      </DMRouteWrapper>
    ),
  },
  {
    path: "/dm/:id",
    element: (
      <DMRouteWrapper>
        <ProtectedDMRoute />
      </DMRouteWrapper>
    ),
  },
  {
    path: "/activity/*",
    element: (
      <BasicLayout
        contentPanel={<ContentPanel feature="Activity" />}
        mainPanel={<MainPanel feature="Activity"/>}
      />
    ),
  },
  {
    path: "/file/*",
    element: (
      <BasicLayout
        contentPanel={<ContentPanel feature="File" />}
        mainPanel={<MainPanel feature="File"/>}
      />
    ),
  },
    {
    path: "/later/*",
    element: (
      <BasicLayout
        contentPanel={<ContentPanel feature="Later" />}
        mainPanel={<MainPanel feature="Later"/>}
      />
    ),
  },
      {
    path: "/tool/*",
    element: (
      <BasicLayout
        contentPanel={<ContentPanel feature="Tool" />}
        mainPanel={<MainPanel feature="Tool"/>}
      />
    ),
  },
  {
    path: "*",
    element: <Navigate to="/home" replace />,
  }
])
export default router
