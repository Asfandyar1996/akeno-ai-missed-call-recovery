"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Download, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { LeadDetailDrawer } from "@/components/leads/lead-detail-drawer";
import type { LeadView } from "@/components/leads/lead-types";
import { currency } from "@/lib/utils";

const statusFilters = ["All statuses", "New", "Contacted", "Qualified", "Booked", "Closed", "Lost"];
const urgencyFilters = ["All urgency", "Urgent", "Standard", "Low"];
const sortOptions = [
  ["newest", "Newest first"],
  ["urgency", "Urgency first"],
  ["value", "Highest value"],
  ["status", "Status"]
] as const;

function csvEscape(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function LeadTable({ leads }: { leads: LeadView[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [urgencyFilter, setUrgencyFilter] = useState("All urgency");
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number][0]>("newest");
  const [selected, setSelected] = useState<LeadView | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return leads
      .filter((lead) => {
        const matchesQuery = [
          lead.customerName,
          lead.phone,
          lead.serviceRequested,
          lead.city,
          lead.state,
          lead.zip,
          lead.assignedPerson,
          lead.leadSummary
        ]
        .join(" ")
        .toLowerCase()
        .includes(q);
        const matchesStatus = statusFilter === "All statuses" || lead.status === statusFilter;
        const matchesUrgency = urgencyFilter === "All urgency" || lead.urgency === urgencyFilter;
        return matchesQuery && matchesStatus && matchesUrgency;
      })
      .sort((a, b) => {
        if (sortBy === "value") return b.estimatedValue - a.estimatedValue;
        if (sortBy === "urgency") return Number(b.urgency === "Urgent") - Number(a.urgency === "Urgent");
        if (sortBy === "status") return a.status.localeCompare(b.status);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [leads, query, sortBy, statusFilter, urgencyFilter]);

  const summary = useMemo(() => ({
    total: filtered.length,
    urgent: filtered.filter((lead) => lead.urgency === "Urgent").length,
    qualified: filtered.filter((lead) => ["Qualified", "Booked", "Closed"].includes(lead.status)).length,
    value: filtered.reduce((sum, lead) => sum + lead.estimatedValue, 0)
  }), [filtered]);

  const exportCsv = () => {
    const rows = [
      ["Name", "Phone", "Service", "City", "State", "ZIP", "Urgency", "Status", "Assigned", "Estimated value", "Created", "Summary"],
      ...filtered.map((lead) => [
        lead.customerName,
        lead.phone,
        lead.serviceRequested,
        lead.city,
        lead.state,
        lead.zip,
        lead.urgency,
        lead.status,
        lead.assignedPerson,
        lead.estimatedValue,
        new Date(lead.createdAt).toISOString(),
        lead.leadSummary
      ])
    ];
    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `akeno-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle>Lead operations</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Triage recovered calls by urgency, status, value and owner handoff.
              </p>
            </div>
            <Button variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              ["Visible leads", summary.total],
              ["Urgent", summary.urgent],
              ["Qualified", summary.qualified],
              ["Pipeline value", currency(summary.value)]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border bg-muted/35 p-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
                <p className="mt-1 text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid gap-3 xl:grid-cols-[minmax(18rem,1fr)_12rem_12rem_12rem]">
            <div className="flex items-center gap-2 rounded-md border bg-white px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, phone, city, service, summary"
                className="border-0 px-0 focus-visible:ring-0"
                aria-label="Search leads"
              />
            </div>
            <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status">
              {statusFilters.map((item) => <option key={item}>{item}</option>)}
            </Select>
            <Select value={urgencyFilter} onChange={(event) => setUrgencyFilter(event.target.value)} aria-label="Filter by urgency">
              {urgencyFilters.map((item) => <option key={item}>{item}</option>)}
            </Select>
            <Select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)} aria-label="Sort leads">
              {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </Select>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{filtered.length} of {leads.length} leads visible</span>
            {query || statusFilter !== "All statuses" || urgencyFilter !== "All urgency" ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setQuery("");
                  setStatusFilter("All statuses");
                  setUrgencyFilter("All urgency");
                }}
              >
                Clear filters
              </Button>
            ) : null}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-6 grid min-h-56 place-items-center rounded-lg border border-dashed bg-muted/25 p-8 text-center">
              <div>
                <ArrowUpDown className="mx-auto h-8 w-8 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No leads match these filters</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Try clearing search, changing the status filter, or reviewing all recovered calls.
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setStatusFilter("All statuses");
                    setUrgencyFilter("All urgency");
                  }}
                >
                  Reset filters
                </Button>
              </div>
            </div>
          ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[840px] text-left text-sm">
              <thead className="border-b bg-muted/35 text-xs uppercase text-muted-foreground">
                <tr>
                  {["Name", "Phone", "Service", "Location", "Urgency", "Status", "Value", "Created date", "Assigned person"].map((heading) => (
                    <th key={heading} className="px-3 py-3 font-semibold">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id} className="cursor-pointer border-b hover:bg-muted/50" onClick={() => setSelected(lead)}>
                    <td className="px-3 py-3 font-semibold">{lead.customerName}</td>
                    <td className="px-3 py-3">{lead.phone}</td>
                    <td className="px-3 py-3">{lead.serviceRequested}</td>
                    <td className="px-3 py-3">{lead.city}, {lead.state} {lead.zip}</td>
                    <td className="px-3 py-3"><StatusBadge status={lead.urgency} /></td>
                    <td className="px-3 py-3"><StatusBadge status={lead.status} /></td>
                    <td className="px-3 py-3 font-semibold">{currency(lead.estimatedValue)}</td>
                    <td className="px-3 py-3">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 py-3">{lead.assignedPerson}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </CardContent>
      </Card>
      <LeadDetailDrawer lead={selected} onClose={() => setSelected(null)} />
    </>
  );
}
