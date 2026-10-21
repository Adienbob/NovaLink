"use client";

import React from "react";
import { useState } from "react";

export interface ActivityLogItem {
   id: string;
   user_id: string | null;
   action: string;
   entity_type: string;
   entity_id: string | null;
   metadata: Record<string, any> | null;
   created_at: string;
   user: {
      id: string;
      full_name: string | null;
      email: string;
      role: string;
   } | null;
}

interface ActivityLogsTableProps {
   logs: ActivityLogItem[];
   totalCount: number;
   onFilterChange: (filters: { entityType?: string; action?: string }) => void;
}

const ENTITY_TYPES = [
   { value: "all", label: "All Entity Types" },
   { value: "user", label: "Users" },
   { value: "product", label: "Products" },
   { value: "product_variant", label: "Product Variants" },
   { value: "category", label: "Categories" },
   { value: "brand", label: "Brands" },
   { value: "order", label: "Orders" },
   { value: "delivery", label: "Deliveries" },
];

export function ActivityLogsTable({
   logs,
   totalCount,
   onFilterChange,
}: ActivityLogsTableProps) {
   const [selectedEntityType, setSelectedEntityType] = useState("all");
   const [actionSearch, setActionSearch] = useState("");
   const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

   const handleEntityChange = (type: string) => {
      setSelectedEntityType(type);
      onFilterChange({ entityType: type, action: actionSearch });
   };

   const handleActionSearch = (e: React.FormEvent) => {
      e.preventDefault();
      onFilterChange({ entityType: selectedEntityType, action: actionSearch });
   };

   return (
      <div className="space-y-4">
         {/* Filter Bar */}
         <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
               <select
                  value={selectedEntityType}
                  onChange={(e) => handleEntityChange(e.target.value)}
                  className="rounded-md border bg-background px-3 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-ring"
               >
                  {ENTITY_TYPES.map((type) => (
                     <option key={type.value} value={type.value}>
                        {type.label}
                     </option>
                  ))}
               </select>

               <form onSubmit={handleActionSearch} className="flex gap-2">
                  <input
                     type="text"
                     value={actionSearch}
                     onChange={(e) => setActionSearch(e.target.value)}
                     placeholder="Search action (e.g. UPDATE_USER)..."
                     className="rounded-md border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                     type="submit"
                     className="rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
                  >
                     Search
                  </button>
               </form>
            </div>

            <div className="text-xs text-muted-foreground font-mono">
               Total Events: <strong>{totalCount}</strong>
            </div>
         </div>

         {/* Log Directory */}
         <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
               <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                     <th className="px-4 py-3">User / Staff</th>
                     <th className="px-4 py-3">Action</th>
                     <th className="px-4 py-3">Entity</th>
                     <th className="px-4 py-3">Entity ID</th>
                     <th className="px-4 py-3">Timestamp</th>
                     <th className="px-4 py-3 text-right">Metadata</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {logs.length === 0 ? (
                     <tr>
                        <td
                           colSpan={6}
                           className="px-4 py-8 text-center text-muted-foreground"
                        >
                           No activity logs found.
                        </td>
                     </tr>
                  ) : (
                     logs.map((log) => {
                        const isExpanded = expandedLogId === log.id;

                        return (
                           <React.Fragment key={log.id}>
                              <tr className="hover:bg-muted/30">
                                 <td className="px-4 py-3">
                                    <div className="font-medium text-xs">
                                       {log.user?.full_name || log.user?.email || "System"}
                                    </div>
                                    {log.user?.role && (
                                       <span className="text-[10px] uppercase font-mono text-muted-foreground">
                                          {log.user.role}
                                       </span>
                                    )}
                                 </td>

                                 <td className="px-4 py-3 font-mono text-xs">
                                    <span className="rounded bg-accent px-2 py-0.5 font-semibold text-accent-foreground">
                                       {log.action}
                                    </span>
                                 </td>

                                 <td className="px-4 py-3">
                                    <span className="rounded border px-2 py-0.5 text-[11px] font-medium uppercase text-muted-foreground">
                                       {log.entity_type}
                                    </span>
                                 </td>

                                 <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                    {log.entity_id ? `${log.entity_id.slice(0, 8)}...` : "-"}
                                 </td>

                                 <td className="px-4 py-3 text-xs text-muted-foreground">
                                    {new Date(log.created_at).toLocaleString()}
                                 </td>

                                 <td className="px-4 py-3 text-right">
                                    {log.metadata ? (
                                       <button
                                          onClick={() =>
                                             setExpandedLogId(isExpanded ? null : log.id)
                                          }
                                          className="text-xs font-medium text-primary hover:underline"
                                       >
                                          {isExpanded ? "Hide JSON" : "View JSON"}
                                       </button>
                                    ) : (
                                       <span className="text-xs text-muted-foreground italic">
                                          None
                                       </span>
                                    )}
                                 </td>
                              </tr>

                              {/* Expanded JSON Inspector Row */}
                              {isExpanded && log.metadata && (
                                 <tr className="bg-muted/20">
                                    <td colSpan={6} className="px-4 py-3">
                                       <pre className="max-h-48 overflow-auto rounded-md bg-black/80 p-3 font-mono text-[11px] text-green-400">
                                          {JSON.stringify(log.metadata, null, 2)}
                                       </pre>
                                    </td>
                                 </tr>
                              )}
                           </React.Fragment>
                        );
                     })
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
}