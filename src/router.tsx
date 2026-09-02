import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    defaultNotFoundComponent: () => (
      <div className="px-4 py-20 text-center">
        <p className="font-display text-3xl">Not found</p>
        <p className="mt-2 text-sm text-muted">That page is not on the desk.</p>
        <a href="/" className="mt-6 inline-block text-sm text-fg underline">
          Back to the lab
        </a>
      </div>
    ),
  });
}
