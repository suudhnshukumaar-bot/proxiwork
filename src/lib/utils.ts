// ─── Currency ─────────────────────────────────────────────────────────────────

/**
 * Formats a number as Indian Rupees, e.g. 1234 → "₹1,234"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Date / Time ──────────────────────────────────────────────────────────────

/**
 * Formats an ISO date string as "15 Jan 2026"
 */
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Formats a time string (HH:MM or HH:MM:SS) as "6:00 PM"
 */
export function formatTime(time: string): string {
  // Accept "HH:MM" or "HH:MM:SS" — prefix a dummy date so Date can parse it
  const [hours, minutes] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

/**
 * Returns how long ago a date was, e.g. "2 hours ago"
 */
export function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
    [1, 'second'],
  ];

  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) {
      return `${count} ${label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

// ─── Distance ─────────────────────────────────────────────────────────────────

/**
 * Haversine formula — returns distance in km between two lat/lon pairs.
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// ─── Status Helpers ───────────────────────────────────────────────────────────

type MuiChipColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning';

const STATUS_COLORS: Record<string, MuiChipColor> = {
  // Job statuses
  draft: 'default',
  published: 'info',
  applications_open: 'primary',
  worker_selected: 'secondary',
  upcoming: 'warning',
  in_progress: 'primary',
  completed: 'success',
  closed: 'default',

  // Application statuses
  pending: 'warning',
  accepted: 'success',
  rejected: 'error',
  withdrawn: 'default',

  // Payment statuses
  processing: 'info',
  released: 'success',
  disputed: 'error',

  // Verification
  verified: 'success',
  unverified: 'default',
  under_review: 'warning',
};

/**
 * Returns the MUI Chip color for a given status string.
 */
export function getStatusColor(status: string): MuiChipColor {
  return STATUS_COLORS[status] ?? 'default';
}

const STATUS_LABELS: Record<string, string> = {
  // Job
  draft: 'Draft',
  published: 'Published',
  applications_open: 'Accepting Applications',
  worker_selected: 'Worker Selected',
  upcoming: 'Upcoming',
  in_progress: 'In Progress',
  completed: 'Completed',
  closed: 'Closed',

  // Application
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',

  // Payment
  processing: 'Processing',
  released: 'Released',
  disputed: 'Disputed',

  // Verification
  verified: 'Verified',
  unverified: 'Not Verified',
  under_review: 'Under Review',
};

/**
 * Returns a human-readable label for a given status string.
 */
export function getStatusLabel(status: string): string {
  return (
    STATUS_LABELS[status] ??
    status
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}
