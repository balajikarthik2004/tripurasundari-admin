import { useState } from "react";
import { toast } from "sonner";
import { Siren, Flame, HeartPulse, Droplets, Zap, ShieldAlert, Phone } from "lucide-react";
const protocols = [
  { i: Siren, l: "Stampede Protocol", c: "danger" },
  { i: Flame, l: "Fire Emergency", c: "danger" },
  { i: HeartPulse, l: "Medical Emergency", c: "saffron" },
  { i: Droplets, l: "Water/Flood Alert", c: "info" },
  { i: Zap, l: "Power Failure", c: "gold" },
  { i: ShieldAlert, l: "Security Threat", c: "danger" },
];
const contacts = [
  { name: "Temple Executive Officer", phone: "Direct line", c: "saffron" },
  { name: "Palani Police Station", phone: "+91-4545-242100", c: "info" },
  { name: "Government Hospital Palani", phone: "+91-4545-241133", c: "emerald" },
  { name: "Fire Station Palani", phone: "+91-4545-242101", c: "danger" },
  { name: "HR&CE Emergency Line", phone: "+91-44-2856-5777", c: "gold" },
  { name: "District Collector Dindigul", phone: "+91-451-2460-303", c: "info" },
];
const incidents = [
  {
    d: "12 May 2026",
    t: "14:22",
    type: "Medical",
    desc: "Devotee fainted near Sanctum",
    resolved: "Yes",
    actions: "First aid, hospital transfer",
  },
  {
    d: "08 May 2026",
    t: "10:05",
    type: "Crowd Surge",
    desc: "Sudden rush at Gopuram entrance",
    resolved: "Yes",
    actions: "Gate 3 opened, staff Added",
  },
  {
    d: "01 May 2026",
    t: "19:40",
    type: "Power",
    desc: "Brief outage in East Wing",
    resolved: "Yes",
    actions: "Backup activated <2 min",
  },
];
export function EmergencySection() {
  const [active, setActive] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      {active ? (
        <div className="pulse-critical rounded-xl border border-danger bg-danger/10 p-8 text-center">
          <div className="text-xs font-semibold text-danger">● Active Emergency</div>
          <div className="mt-1 text-lg font-montserrat font-semibold text-danger">{active}</div>
          <div className="mt-1 text-xs text-muted-foreground">Protocol active · 00:42 elapsed</div>
          <button
            onClick={() => {
              setActive(null);
              toast.success("Emergency stood down");
            }}
            className="mt-2 rounded-xl bg-foreground px-4 py-1.5 text-xs font-normal text-background"
          >
            Stand Down
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-emerald/30 bg-emerald/10 p-8 text-center">
          <div className="text-base font-semibold text-emerald">
            ● All Clear — No Active Emergencies
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            All systems nominal · 12 cameras live · 48 volunteers on duty
          </div>
        </div>
      )}
      <div>
        <div className="mb-2 text-sm font-medium">Emergency Protocols</div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {protocols.map(({ i: Icon, l, c }) => (
            <div key={l} className={`rounded-xl border bg-card p-8 shadow-sm border-${c}/30`}>
              <div className="flex items-center gap-8">
                <div
                  className={`grid h-12 w-12 place-items-center rounded-xl bg-${c}/15 text-${c}`}
                >
                  <Icon size={22} />
                </div>
                <div className="font-medium">{l}</div>
              </div>
              <button
                onClick={() => setConfirm(l)}
                className={`mt-3 w-full rounded-xl bg-${c} px-3 py-2 text-sm font-normal text-white`}
              >
                Activate
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Emergency Contacts</div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((c) => (
            <div key={c.name} className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <div className="text-xs text-muted-foreground">{c.name}</div>
              <div className="mt-1 font-mono text-sm font-normal">{c.phone}</div>
              <button
                onClick={() => toast(`Calling ${c.name}…`)}
                className={`mt-2 flex w-full items-center justify-center gap-1 rounded-xl bg-${c.c}/15 px-3 py-1.5 text-xs font-normal text-${c.c}`}
              >
                <Phone size={12} /> Call
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-3 font-medium">
          Incident Log (last 30 days)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs text-muted-foreground">
              <tr>
                {["Date", "Time", "Type", "Description", "Resolved", "Actions Taken"].map((h) => (
                  <th key={h} className="px-4 py-2 text-left font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="">
              {incidents.map((i, idx) => (
                <tr key={idx} className="hover:bg-surface">
                  <td className="px-4 py-2">{i.d}</td>
                  <td className="px-4 py-2 font-mono text-xs">{i.t}</td>
                  <td className="px-4 py-2">
                    <span className="rounded-xl bg-saffron/10 px-2 py-0.5 text-xs text-saffron">
                      {i.type}
                    </span>
                  </td>
                  <td className="px-4 py-2">{i.desc}</td>
                  <td className="px-4 py-2">
                    <span className="rounded-xl bg-emerald/15 px-2 py-0.5 text-xs text-emerald">
                      {i.resolved}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">{i.actions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {confirm && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-8"
          onClick={() => setConfirm(null)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-base font-semibold text-danger">Activate: {confirm}?</div>
            <div className="mt-2 text-sm text-muted-foreground">
              This will broadcast the emergency protocol to all staff, Added channels, and notify
              relevant authorities. Confirm to proceed.
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirm(null)}
                className="rounded-xl border border-border bg-surface px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setActive(confirm);
                  setConfirm(null);
                  toast.error(`${confirm} activated`);
                }}
                className="rounded-xl bg-danger px-4 py-2 text-sm font-normal text-white"
              >
                Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
