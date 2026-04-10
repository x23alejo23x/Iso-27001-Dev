import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MOCK_CHECKLIST } from "../../data/mock";

export function useChecklist() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState(MOCK_CHECKLIST);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const s = searchParams.get("status");
    if (s) setStatusFilter(s);
  }, [searchParams]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.controlId.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchDomain =
        domainFilter === "all" || item.domain === domainFilter;
      const matchPriority =
        priorityFilter === "all" || item.priority === priorityFilter;
      return matchSearch && matchStatus && matchDomain && matchPriority;
    });
  }, [items, search, statusFilter, domainFilter, priorityFilter]);

  const stats = useMemo(
    () => ({
      total: items.length,
      completed: items.filter((i) => i.status === "completed").length,
      in_progress: items.filter((i) => i.status === "in_progress").length,
      not_started: items.filter((i) => i.status === "not_started").length,
      pending_update: items.filter((i) => i.status === "pending_update").length,
    }),
    [items],
  );

  const handleStatusChange = (id, newStatus) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
  };

  const toggleExpand = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setDomainFilter("all");
    setPriorityFilter("all");
  };

  const hasFilters =
    statusFilter !== "all" ||
    domainFilter !== "all" ||
    priorityFilter !== "all" ||
    search;

  return {
    filteredItems,
    stats,
    expandedId,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    domainFilter,
    setDomainFilter,
    priorityFilter,
    setPriorityFilter,
    hasFilters,
    clearFilters,
    handleStatusChange,
    toggleExpand,
  };
}
