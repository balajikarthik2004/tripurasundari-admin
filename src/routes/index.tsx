import { createFileRoute, redirect } from "@tanstack/react-router";
import { TempleShell } from "@/components/temple/TempleShell";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  head: () => ({
    meta: [
      { title: "OMG Smart Temple — Admin Dashboard" },
      {
        name: "description",
        content:
          "Temple admin operations dashboard: live crowd, AI heatmap, CCTV, queues, staff and emergencies.",
      },
    ],
  }),
  component: TempleShell,
});
