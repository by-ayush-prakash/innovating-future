import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Layout } from "./Layout.tsx";
import { Home } from "./Home.tsx";
import { Leadership } from "./Leadership.tsx";
import { Credo } from "./Credo.tsx";
import { Careers } from "./Careers.tsx";
import { Contact } from "./Contact.tsx";
import { Ventures } from "./Ventures.tsx";
import { VenturesPortfolio } from "./VenturesPortfolio.tsx";
import { News } from "./News.tsx";
import { Podcast } from "./Podcast.tsx";
import { Books } from "./Books.tsx";
import { Terms } from "./Terms.tsx";
import { Privacy } from "./Privacy.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/members",
        element: <Navigate to="/leadership" replace />,
      },
      {
        path: "/leadership",
        element: <Leadership />,
      },
      {
        path: "/credo",
        element: <Credo />,
      },
      {
        path: "/careers",
        element: <Careers />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/terms",
        element: <Terms />,
      },
      {
        path: "/privacy",
        element: <Privacy />,
      },
      {
        path: "/news",
        element: <News />,
      },
      {
        path: "/podcast",
        element: <Podcast />,
      },
      {
        path: "/books",
        element: <Books />,
      },
      {
        path: "/ventures",
        element: <Ventures />,
      },
      {
        path: "/ventures/portfolio",
        element: <VenturesPortfolio />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
