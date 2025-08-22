// Helper utilities for todo items
export interface Todo {
  item_id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  completed_at?: string;
}

// Helper to format ISO/date strings into a readable local date/time
export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  // If dateString is a YYYY-MM-DD date-only value, show only the date
  const dateOnlyMatch = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  let d: Date;
  if (dateOnlyMatch) {
    // Parse as local midnight for display purposes
    d = new Date(dateString + 'T00:00:00');
  } else {
    d = new Date(dateString);
  }
  if (Number.isNaN(d.getTime())) return dateString;
  try {
    // For date-only show no time; otherwise show date+time
    if (dateOnlyMatch) {
      return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(d);
    }
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d);
  } catch (e) {
    return d.toLocaleString();
  }
}

// Determine row class based on todo status and due date
export function getRowClass(todo: Todo): string {
  // Completed rows keep the 'completed' class
  if (todo.status === 'completed') return 'completed';

  if (!todo.due_date) return '';
  const now = Date.now();
  // If due_date is a date-only string, treat it as end of that day (local)
  const dateOnlyMatch = /^\d{4}-\d{2}-\d{2}$/.test(todo.due_date);
  const due = dateOnlyMatch
    ? new Date(todo.due_date + 'T23:59:59').getTime()
    : new Date(todo.due_date).getTime();
  if (Number.isNaN(due)) return '';

  const msInDay = 24 * 60 * 60 * 1000;
  if (due < now) return 'overdue';
  if (due - now <= msInDay) return 'due-soon';
  return '';
}

// Format priority (e.g. "low" -> "Low")
export function formatPriority(priority?: string): string {
  if (!priority) return '';
  return priority
    .split('_')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

// Format status (e.g. "in_progress" -> "In Progress")
export function formatStatus(status?: string): string {
  if (!status) return '';
  return status
    .split('_')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}
