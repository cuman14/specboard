import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";

const OnboardingPage = lazy(() => import("@/pages/OnboardingPage"));
const ChangesDashboard = lazy(() => import("@/pages/ChangesDashboard"));
const ChangeDetail = lazy(() => import("@/pages/ChangeDetail"));
const KanbanPage = lazy(() => import("@/pages/KanbanPage"));
const SpecsExplorer = lazy(() => import("@/pages/SpecsExplorer"));

function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#464554] border-t-[#6366f1]" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <OnboardingPage />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "changes",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ChangesDashboard />
          </Suspense>
        ),
      },
      {
        path: "changes/:changeId",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ChangeDetail />
          </Suspense>
        ),
      },
      {
        path: "kanban",
        element: (
          <Suspense fallback={<PageLoader />}>
            <KanbanPage />
          </Suspense>
        ),
      },
      {
        path: "specs",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SpecsExplorer />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/changes" replace />,
      },
    ],
  },
]);
