import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sports")({ component: SportsLayout });

function SportsLayout() {
  return <Outlet />;
}
