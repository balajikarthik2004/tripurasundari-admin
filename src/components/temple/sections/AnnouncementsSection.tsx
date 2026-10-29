import { useState } from "react";
import { toast } from "sonner";
const channels = [
  { id: "app", label: "Mobile App Push Notification", on: true },
  { id: "screens", label: "Temple Display Screens", on: true },
  { id: "wa", label: "Staff WhatsApp Group", on: true },
  { id: "sms", label: "SMS to Registered Devotees", on: false },
  { id: "web", label: "Website Notice", on: false },
];
const history = [
  {
    t: "14:00",
    msg: "Queue B now open — additional volunteers Added",
    channel: "App + Screens",
    to: "4,200 devices",
    status: "Delivered",
  },
  {
    t: "13:30",
    msg: "Wait time reduced to 35 min at Lane A",
    channel: "All",
    to: "4,200 devices",
    status: "Delivered",
  },
  {
    t: "12:00",
    msg: "Temple closed 12–3 PM for cleaning",
    channel: "All",
    to: "4,200 devices",
    status: "Delivered",
  },
];
export function AnnouncementsSection() {
  const [chs, setChs] = useState(channels);
  const [priority, setPriority] = useState("normal");
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-2 font-medium">New Announcement</div>
        <div className="space-y-3">
          <input
            placeholder="Title"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <textarea
            rows={4}
            placeholder="Message…"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <div>
            <div className="mb-2 text-sm font-semibold text-muted-foreground">Channels</div>
            <div className="grid gap-2 md:grid-cols-2">
              {chs.map((c) => (
                <label
                  key={c.id}
                  className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={c.on}
                    onChange={(e) =>
                      setChs(chs.map((x) => (x.id === c.id ? { ...x, on: e.target.checked } : x)))
                    }
                    className="accent-saffron"
                  />
                  {c.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold text-muted-foreground">Priority</div>
            <div className="flex gap-2">
              {[
                ["normal", "Normal", "bg-info text-white"],
                ["urgent", "Urgent", "bg-status-busy text-white"],
                ["emergency", "Emergency", "bg-danger text-white"],
              ].map(([id, l, cls]) => (
                <button
                  key={id}
                  onClick={() => setPriority(id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-normal ${priority === id ? cls : "bg-surface text-foreground"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl border border-border bg-surface px-4 py-2 text-sm">
              Preview
            </button>
            <button className="rounded-xl border border-border bg-surface px-4 py-2 text-sm">
              Schedule
            </button>
            <button
              onClick={() => toast.success("✓ Announcement sent to 4,200 devices")}
              className="ml-auto rounded-xl bg-saffron px-4 py-2 text-sm font-normal text-white"
            >
              Broadcast Now →
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-3 font-medium">Announcement History</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs text-muted-foreground">
              <tr>
                {["Time", "Message", "Channel", "Sent To", "Status"].map((h) => (
                  <th key={h} className="px-4 py-2 text-left font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="">
              {history.map((h, i) => (
                <tr key={i} className="hover:bg-surface">
                  <td className="px-4 py-2 font-mono text-xs">{h.t}</td>
                  <td className="px-4 py-2">"{h.msg}"</td>
                  <td className="px-4 py-2 text-muted-foreground">{h.channel}</td>
                  <td className="px-4 py-2 tabular-nums">{h.to}</td>
                  <td className="px-4 py-2">
                    <span className="rounded-xl bg-emerald/15 px-2 py-0.5 text-xs text-emerald">
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
