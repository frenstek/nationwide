import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

// ─── CONFIG ──────────────────────────────────────────────
const API = '/api/npi';
const ADMIN_PASS = 'npi2026admin';
const VIEW_PASS = 'npi2026view';

const BUSINESS_UNITS = [
  { value: 'grocery', label: 'Grocery', color: '#10B981', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  { value: 'resort', label: 'Resort', color: '#3B82F6', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  { value: 'servo', label: 'Servo', color: '#F59E0B', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  { value: 'npi', label: 'NPI', color: '#A855F7', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
];

const CATEGORIES = [
  'inventory', 'logistics', 'food', 'utilities', 'maintenance', 'supplies', 'fuel', 'wages',
  'rent', 'insurance', 'cleaning', 'equipment', 'transport',
  'travel', 'legal', 'accounting', 'marketing', 'general', 'other'
];

const PAID_BY_OPTIONS = [
  'Harry', 'Harry - Amex', 'Harry - Visa', 'Harry - Altitude Black Mastercard', 'Harry - Cash', 'Harry - Bank Transfer',
  'Sunny', 'Sunny - Amex', 'Sunny - Visa', 'Sunny - Cash', 'Sunny - Bank Transfer',
  'Harry & Sunny', 'NPI Account', 'NPI Card', 'Cash', 'Other'
];
const STATUS_OPTIONS = ['unpaid', 'paid', 'overdue'];

// ─── HELPERS ─────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(n || 0);
const fmtDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const today = () => new Date().toISOString().split('T')[0];

function getUnitMeta(unit) {
  return BUSINESS_UNITS.find(b => b.value === unit) || BUSINESS_UNITS[0];
}

function getStatusStyle(status) {
  switch (status) {
    case 'paid': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'overdue': return 'bg-red-500/15 text-red-400 border-red-500/30';
    default: return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  }
}

async function api(action, opts = {}) {
  const { method = 'GET', body, params = {} } = opts;
  const url = new URL(API, window.location.origin);
  url.searchParams.set('action', action);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '' && v !== 'all') {
      url.searchParams.set(k, v);
    }
  }

  const fetchOpts = { method, headers: {} };
  if (body) {
    fetchOpts.headers['Content-Type'] = 'application/json';
    fetchOpts.body = JSON.stringify(body);
  }

  const res = await fetch(url.toString(), fetchOpts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── APP ─────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState(() => sessionStorage.getItem('npi_role') || null);
  const [tab, setTab] = useState('dashboard');

  const handleLogin = (r) => {
    sessionStorage.setItem('npi_role', r);
    setRole(r);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('npi_role');
    setRole(null);
  };

  if (!role) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-navy">
      <Header role={role} tab={tab} setTab={setTab} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {tab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
              <Dashboard role={role} />
            </motion.div>
          )}
          {tab === 'reports' && (
            <motion.div key="reports" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
              <Reports />
            </motion.div>
          )}
          {tab === 'partner-share' && (
            <motion.div key="partner-share" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
              <PartnerShare />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ─── LOGIN ───────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (pass === ADMIN_PASS) {
        onLogin('admin');
      } else if (pass === VIEW_PASS) {
        onLogin('partner');
      } else {
        setError('Invalid password');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-navy-light border border-slate-dim/50 rounded-xl p-8">
          <div className="text-center mb-8">
            <img src="/npi-logo.jpeg" alt="NPI" className="w-20 h-20 rounded-xl object-contain mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">NPI Expense Tracker</h1>
            <p className="text-slate-muted mt-1 text-sm">Nationwide Projects Investments</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-navy border border-slate-dim/60 rounded-lg text-white placeholder-slate-muted focus:outline-none focus:ring-2 focus:ring-blue-accent/50 focus:border-blue-accent/50 transition"
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || !pass}
              className="w-full py-3 bg-blue-accent hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-slate-muted text-xs mt-6">
            Grocery &middot; Resort &middot; Servo
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── HEADER ──────────────────────────────────────────────
function Header({ role, tab, setTab, onLogout }) {
  return (
    <header className="bg-navy-light/80 backdrop-blur-sm border-b border-slate-dim/40 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <img src="/npi-logo.jpeg" alt="NPI" className="w-9 h-9 rounded-lg object-contain" />
            <span className="text-white font-semibold text-sm hidden sm:block">Expense Tracker</span>
          </div>

          <nav className="flex items-center gap-1 bg-navy/60 rounded-lg p-1">
            <button
              onClick={() => setTab('dashboard')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === 'dashboard' ? 'bg-blue-accent text-white' : 'text-slate-muted hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setTab('reports')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === 'reports' ? 'bg-blue-accent text-white' : 'text-slate-muted hover:text-white'
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => setTab('partner-share')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === 'partner-share' ? 'bg-blue-accent text-white' : 'text-slate-muted hover:text-white'
              }`}
            >
              Partner Share
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
              role === 'admin' ? 'bg-blue-accent/15 text-blue-400' : 'bg-slate-dim/40 text-slate-muted'
            }`}>
              {role === 'admin' ? 'Admin' : 'Partner'}
            </span>
            <button
              onClick={onLogout}
              className="text-slate-muted hover:text-white text-sm transition-colors"
              title="Sign out"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────
function Dashboard({ role }) {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    business_unit: 'all',
    status: 'all',
    paid_by: 'all',
    search: '',
    from_date: '',
    to_date: '',
    sort_by: 'created_at',
    sort_dir: 'desc',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const isAdmin = role === 'admin';

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        api('list', { params: filters }),
        api('stats', { params: { from_date: filters.from_date, to_date: filters.to_date } }),
      ]);
      setInvoices(listRes.invoices || []);
      setStats(statsRes);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSort = (col) => {
    setFilters(f => ({
      ...f,
      sort_by: col,
      sort_dir: f.sort_by === col && f.sort_dir === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handleDelete = async (id) => {
    try {
      await api('delete', { method: 'DELETE', params: { id } });
      setDeleteConfirm(null);
      loadData();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleEdit = (inv) => {
    setEditingInvoice(inv);
    setModalOpen(true);
  };

  const handleMarkPaid = async (inv) => {
    try {
      await api('update', { method: 'PATCH', body: { id: inv.id, status: 'paid' } });
      loadData();
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  return (
    <>
      <StatsCards stats={stats} loading={loading} />

      <div className="mt-6 flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-between">
        <Filters filters={filters} setFilters={setFilters} />
        {isAdmin && (
          <button
            onClick={() => { setEditingInvoice(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-accent hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Upload Invoice
          </button>
        )}
      </div>

      <InvoiceTable
        invoices={invoices}
        loading={loading}
        isAdmin={isAdmin}
        filters={filters}
        onSort={handleSort}
        onEdit={handleEdit}
        onDelete={(inv) => setDeleteConfirm(inv)}
        onMarkPaid={handleMarkPaid}
      />

      <AnimatePresence>
        {modalOpen && (
          <InvoiceModal
            invoice={editingInvoice}
            onClose={() => { setModalOpen(false); setEditingInvoice(null); }}
            onSaved={loadData}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <DeleteConfirmModal
            invoice={deleteConfirm}
            onConfirm={() => handleDelete(deleteConfirm.id)}
            onCancel={() => setDeleteConfirm(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── STATS CARDS ─────────────────────────────────────────
function StatsCards({ stats, loading }) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-navy-light border border-slate-dim/30 rounded-xl p-5 animate-pulse">
            <div className="h-3 w-20 bg-slate-dim/40 rounded mb-3" />
            <div className="h-7 w-28 bg-slate-dim/40 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-navy-light border border-slate-dim/30 rounded-xl p-5">
        <p className="text-slate-muted text-xs font-medium uppercase tracking-wide mb-1">Total Invoices</p>
        <p className="text-2xl font-bold tabular-nums text-blue-400">{stats.totalCount}</p>
      </div>
      <div className="bg-navy-light border border-slate-dim/30 rounded-xl p-5">
        <p className="text-slate-muted text-xs font-medium uppercase tracking-wide mb-1">Total Amount</p>
        <p className="text-2xl font-bold tabular-nums text-white">{fmt(stats.totalAmount)}</p>
      </div>
      <div className="bg-navy-light border border-slate-dim/30 rounded-xl p-5">
        <p className="text-slate-muted text-xs font-medium uppercase tracking-wide mb-1">Unpaid</p>
        <p className="text-2xl font-bold tabular-nums text-amber-400">{fmt(stats.unpaidAmount)}</p>
      </div>
      <div className="bg-navy-light border border-slate-dim/30 rounded-xl p-5">
        <p className="text-slate-muted text-xs font-medium uppercase tracking-wide mb-1">Overdue</p>
        <p className="text-2xl font-bold tabular-nums text-red-400">{stats.overdueCount}</p>
      </div>

      {BUSINESS_UNITS.map(unit => {
        const data = stats.byUnit?.[unit.value];
        return (
          <div key={unit.value} className={`bg-navy-light border ${unit.border} rounded-xl p-5`}>
            <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${unit.text}`}>{unit.label}</p>
            <p className="text-xl font-bold tabular-nums text-white">{fmt(data?.total || 0)}</p>
            <p className="text-xs text-slate-muted mt-1">
              {data?.count || 0} invoices &middot; {fmt(data?.unpaid || 0)} unpaid
            </p>
          </div>
        );
      })}

      <div className="bg-navy-light border border-slate-dim/30 rounded-xl p-5">
        <p className="text-slate-muted text-xs font-medium uppercase tracking-wide mb-1">Total GST</p>
        <p className="text-xl font-bold tabular-nums text-white">{fmt(stats.totalGst)}</p>
        <p className="text-xs text-slate-muted mt-1">Paid: {fmt(stats.paidAmount)}</p>
      </div>
    </div>
  );
}

// ─── FILTERS ─────────────────────────────────────────────
function Filters({ filters, setFilters }) {
  const update = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  const hasFilters = filters.search || filters.business_unit !== 'all' || filters.status !== 'all' || filters.paid_by !== 'all' || filters.from_date || filters.to_date;

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div>
        <label className="block text-xs text-slate-muted mb-1">Search</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
          placeholder="Supplier, description..."
          className="px-3 py-2 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white placeholder-slate-muted focus:outline-none focus:ring-1 focus:ring-blue-accent/50 w-48"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-muted mb-1">Business</label>
        <select
          value={filters.business_unit}
          onChange={(e) => update('business_unit', e.target.value)}
          className="px-3 py-2 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
        >
          <option value="all">All Units</option>
          {BUSINESS_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-slate-muted mb-1">Status</label>
        <select
          value={filters.status}
          onChange={(e) => update('status', e.target.value)}
          className="px-3 py-2 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
        >
          <option value="all">All</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{capitalize(s)}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-slate-muted mb-1">Paid By</label>
        <select
          value={filters.paid_by}
          onChange={(e) => update('paid_by', e.target.value)}
          className="px-3 py-2 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
        >
          <option value="all">All</option>
          {PAID_BY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-slate-muted mb-1">From</label>
        <input
          type="date"
          value={filters.from_date}
          onChange={(e) => update('from_date', e.target.value)}
          className="px-3 py-2 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-muted mb-1">To</label>
        <input
          type="date"
          value={filters.to_date}
          onChange={(e) => update('to_date', e.target.value)}
          className="px-3 py-2 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
        />
      </div>
      {hasFilters && (
        <button
          onClick={() => setFilters({
            business_unit: 'all', status: 'all', paid_by: 'all',
            search: '', from_date: '', to_date: '',
            sort_by: 'created_at', sort_dir: 'desc',
          })}
          className="px-3 py-2 text-sm text-slate-muted hover:text-white transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}

// ─── INVOICE TABLE ───────────────────────────────────────
function InvoiceTable({ invoices, loading, isAdmin, filters, onSort, onEdit, onDelete, onMarkPaid }) {
  if (loading) {
    return (
      <div className="mt-6 bg-navy-light border border-slate-dim/30 rounded-xl overflow-hidden">
        <div className="p-8 text-center text-slate-muted">Loading invoices...</div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="mt-6 bg-navy-light border border-slate-dim/30 rounded-xl overflow-hidden">
        <div className="p-12 text-center">
          <svg className="w-12 h-12 text-slate-dim mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-slate-muted text-sm">No invoices found</p>
          <p className="text-slate-dim text-xs mt-1">Try adjusting your filters or upload an invoice</p>
        </div>
      </div>
    );
  }

  const SortIcon = ({ col }) => {
    if (filters.sort_by !== col) return null;
    return <span className="ml-1 text-blue-accent">{filters.sort_dir === 'asc' ? '\u2191' : '\u2193'}</span>;
  };

  const ThBtn = ({ col, children, className = '' }) => (
    <th
      className={`px-4 py-3 text-left text-xs font-medium text-slate-muted uppercase tracking-wide cursor-pointer hover:text-white transition-colors select-none ${className}`}
      onClick={() => onSort(col)}
    >
      {children}<SortIcon col={col} />
    </th>
  );

  return (
    <div className="mt-6 bg-navy-light border border-slate-dim/30 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-dim/30">
            <tr>
              <ThBtn col="invoice_date">Date</ThBtn>
              <ThBtn col="supplier">Supplier</ThBtn>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-muted uppercase tracking-wide">Unit</th>
              <ThBtn col="amount">Amount</ThBtn>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-muted uppercase tracking-wide">GST</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-muted uppercase tracking-wide">Paid By</th>
              <ThBtn col="status">Status</ThBtn>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-muted uppercase tracking-wide">File</th>
              {isAdmin && (
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-muted uppercase tracking-wide">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-dim/20">
            {invoices.map((inv) => {
              const unitMeta = getUnitMeta(inv.business_unit);
              return (
                <tr key={inv.id} className="hover:bg-navy/40 transition-colors">
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap tabular-nums">{fmtDate(inv.invoice_date)}</td>
                  <td className="px-4 py-3">
                    <div className="text-white font-medium">{inv.supplier}</div>
                    {inv.description && <div className="text-slate-muted text-xs mt-0.5 max-w-[200px] truncate">{inv.description}</div>}
                    {inv.invoice_number && <div className="text-slate-dim text-xs">#{inv.invoice_number}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${unitMeta.bg} ${unitMeta.text} ${unitMeta.border}`}>
                      {unitMeta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white font-medium tabular-nums whitespace-nowrap">{fmt(inv.amount)}</td>
                  <td className="px-4 py-3 text-slate-muted tabular-nums whitespace-nowrap">{inv.gst_amount ? fmt(inv.gst_amount) : '—'}</td>
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{inv.paid_by || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${getStatusStyle(inv.status)}`}>
                      {capitalize(inv.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {inv.file_url ? (
                      <a
                        href={inv.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-accent hover:text-blue-300 text-xs flex items-center gap-1 transition-colors"
                        title={inv.file_name}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                        </svg>
                        View
                      </a>
                    ) : (
                      <span className="text-slate-dim text-xs">—</span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {inv.status !== 'paid' && (
                          <button
                            onClick={() => onMarkPaid(inv)}
                            className="p-1.5 text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-colors"
                            title="Mark as paid"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => onEdit(inv)}
                          className="p-1.5 text-slate-muted hover:text-white hover:bg-slate-dim/30 rounded-md transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(inv)}
                          className="p-1.5 text-slate-muted hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-slate-dim/20 flex items-center justify-between text-xs text-slate-muted">
        <span>{invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</span>
        <span className="tabular-nums">
          Total: <span className="text-white font-medium">{fmt(invoices.reduce((s, i) => s + parseFloat(i.amount || 0), 0))}</span>
        </span>
      </div>
    </div>
  );
}

// ─── INVOICE MODAL ───────────────────────────────────────
function InvoiceModal({ invoice, onClose, onSaved }) {
  const isEdit = !!invoice;
  const [form, setForm] = useState({
    invoice_number: invoice?.invoice_number || '',
    supplier: invoice?.supplier || '',
    description: invoice?.description || '',
    amount: invoice?.amount || '',
    gst_amount: invoice?.gst_amount || '',
    business_unit: invoice?.business_unit || 'grocery',
    category: invoice?.category || 'general',
    invoice_date: invoice?.invoice_date || today(),
    due_date: invoice?.due_date || '',
    paid_by: invoice?.paid_by || '',
    status: invoice?.status || 'unpaid',
    notes: invoice?.notes || '',
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const maxSize = 10 * 1024 * 1024;
    if (f.size > maxSize) {
      setError('File too large (max 10MB)');
      return;
    }
    setFile(f);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.supplier || !form.amount || !form.invoice_date) {
      setError('Supplier, amount, and invoice date are required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const body = { ...form };

      if (file) {
        const reader = new FileReader();
        const base64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        body.file_base64 = base64;
        body.file_name = file.name;
        body.file_type = file.type;
      }

      if (isEdit) {
        body.id = invoice.id;
        await api('update', { method: 'PATCH', body });
      } else {
        await api('create', { method: 'POST', body });
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const autoGst = () => {
    if (form.amount) {
      const gst = (parseFloat(form.amount) / 11).toFixed(2);
      update('gst_amount', gst);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8 px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        className="w-full max-w-2xl bg-navy-light border border-slate-dim/40 rounded-xl shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-dim/30">
          <h2 className="text-lg font-semibold text-white">
            {isEdit ? 'Edit Invoice' : 'Upload Invoice'}
          </h2>
          <button onClick={onClose} className="text-slate-muted hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Row 1: Supplier + Invoice # */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Supplier *</label>
              <input
                type="text"
                value={form.supplier}
                onChange={(e) => update('supplier', e.target.value)}
                placeholder="e.g. Woolworths"
                className="w-full px-3 py-2.5 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white placeholder-slate-muted focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Invoice #</label>
              <input
                type="text"
                value={form.invoice_number}
                onChange={(e) => update('invoice_number', e.target.value)}
                placeholder="INV-001"
                className="w-full px-3 py-2.5 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white placeholder-slate-muted focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Brief description of the expense"
              className="w-full px-3 py-2.5 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white placeholder-slate-muted focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
            />
          </div>

          {/* Row 2: Amount + GST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Amount (inc. GST) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={(e) => update('amount', e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2.5 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white placeholder-slate-muted focus:outline-none focus:ring-1 focus:ring-blue-accent/50 tabular-nums"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                GST Amount
                <button type="button" onClick={autoGst} className="ml-2 text-blue-accent text-xs hover:underline">Auto (1/11)</button>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.gst_amount}
                onChange={(e) => update('gst_amount', e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2.5 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white placeholder-slate-muted focus:outline-none focus:ring-1 focus:ring-blue-accent/50 tabular-nums"
              />
            </div>
          </div>

          {/* Row 3: Business Unit + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Business Unit *</label>
              <div className="flex gap-2">
                {BUSINESS_UNITS.map(u => (
                  <button
                    key={u.value}
                    type="button"
                    onClick={() => update('business_unit', u.value)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                      form.business_unit === u.value
                        ? `${u.bg} ${u.text} ${u.border}`
                        : 'border-slate-dim/40 text-slate-muted hover:border-slate-dim'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className="w-full px-3 py-2.5 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{capitalize(c)}</option>)}
              </select>
            </div>
          </div>

          {/* Row 4: Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Invoice Date *</label>
              <input
                type="date"
                value={form.invoice_date}
                onChange={(e) => update('invoice_date', e.target.value)}
                className="w-full px-3 py-2.5 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => update('due_date', e.target.value)}
                className="w-full px-3 py-2.5 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
              />
            </div>
          </div>

          {/* Row 5: Paid By + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Paid By</label>
              <select
                value={form.paid_by}
                onChange={(e) => update('paid_by', e.target.value)}
                className="w-full px-3 py-2.5 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
              >
                <option value="">Not assigned</option>
                {PAID_BY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                className="w-full px-3 py-2.5 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{capitalize(s)}</option>)}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={2}
              placeholder="Optional notes..."
              className="w-full px-3 py-2.5 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white placeholder-slate-muted focus:outline-none focus:ring-1 focus:ring-blue-accent/50 resize-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Attachment
              {invoice?.file_name && !file && (
                <span className="ml-2 text-blue-accent">
                  Current: <a href={invoice.file_url} target="_blank" rel="noopener noreferrer" className="hover:underline">{invoice.file_name}</a>
                </span>
              )}
            </label>
            <div className="space-y-2">
              {file ? (
                <div className="flex items-center gap-3 border border-slate-dim/40 rounded-lg p-3">
                  <svg className="w-5 h-5 text-blue-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                  </svg>
                  <span className="text-white text-sm truncate flex-1">{file.name}</span>
                  <span className="text-slate-muted text-xs">({(file.size / 1024).toFixed(0)} KB)</span>
                  <button
                    type="button"
                    onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                    className="text-slate-muted hover:text-red-400"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-3 border border-dashed border-slate-dim/40 hover:border-blue-accent rounded-lg p-4 cursor-pointer transition-colors">
                  <svg className="w-6 h-6 text-slate-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="text-slate-muted text-sm">Click to choose file (PDF, images, max 10MB)</span>
                  <input
                    ref={fileRef}
                    type="file"
                    onChange={handleFile}
                    accept=".pdf,.png,.jpg,.jpeg,.gif,.webp"
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">{error}</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm text-slate-muted hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-accent hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : (isEdit ? 'Update Invoice' : 'Save Invoice')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── DELETE CONFIRM ──────────────────────────────────────
function DeleteConfirmModal({ invoice, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-navy-light border border-slate-dim/40 rounded-xl p-6"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-red-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-1">Delete Invoice?</h3>
          <p className="text-slate-muted text-sm">
            This will permanently delete the invoice from <span className="text-white">{invoice.supplier}</span> for {fmt(invoice.amount)}.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm text-slate-muted hover:text-white border border-slate-dim/40 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── REPORTS ─────────────────────────────────────────────
function Reports() {
  const [filters, setFilters] = useState({
    business_unit: 'all',
    paid_by: 'all',
    from_date: '',
    to_date: '',
  });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateReport = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api('report', { params: filters });
      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportPdf = () => {
    if (!report) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    const addText = (text, x, size = 10, style = 'normal', color = [0, 0, 0]) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', style);
      doc.setTextColor(...color);
      doc.text(text, x, y);
    };

    const checkPage = (needed = 20) => {
      if (y + needed > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        y = 20;
      }
    };

    // Title
    addText('NPI Expense Report', 14, 18, 'bold');
    y += 8;

    const fromStr = filters.from_date ? fmtDate(filters.from_date) : 'All time';
    const toStr = filters.to_date ? fmtDate(filters.to_date) : 'Present';
    addText(`Period: ${fromStr} - ${toStr}`, 14, 10, 'normal', [100, 100, 100]);
    y += 5;

    const unitFilter = filters.business_unit !== 'all' ? capitalize(filters.business_unit) : 'All Units';
    const paidFilter = filters.paid_by !== 'all' ? filters.paid_by : 'All';
    addText(`Business: ${unitFilter}  |  Paid By: ${paidFilter}`, 14, 10, 'normal', [100, 100, 100]);
    y += 5;

    addText(`Generated: ${new Date().toLocaleString('en-AU')}`, 14, 8, 'normal', [150, 150, 150]);
    y += 10;

    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(14, y, pageWidth - 14, y);
    y += 8;

    addText('Summary', 14, 14, 'bold');
    y += 8;
    addText(`Total Invoices: ${report.totalCount}`, 14, 10);
    y += 6;
    addText(`Total Amount: ${fmt(report.totalAmount)}`, 14, 10);
    y += 6;
    addText(`Total GST: ${fmt(report.totalGst)}`, 14, 10);
    y += 10;

    // By Business Unit
    if (report.unitSummary && Object.keys(report.unitSummary).length > 0) {
      checkPage(40);
      addText('By Business Unit', 14, 12, 'bold');
      y += 7;

      for (const [unit, data] of Object.entries(report.unitSummary)) {
        checkPage(20);
        addText(`${capitalize(unit)}:`, 18, 10, 'bold');
        y += 5;
        addText(`${data.count} invoices  |  Total: ${fmt(data.total)}  |  GST: ${fmt(data.gst)}  |  Paid: ${fmt(data.paid)}  |  Unpaid: ${fmt(data.unpaid)}`, 22, 9, 'normal', [80, 80, 80]);
        y += 7;
      }
      y += 3;
    }

    // By Paid By
    if (report.paidByBreakdown && Object.keys(report.paidByBreakdown).length > 0) {
      checkPage(40);
      addText('By Who Paid', 14, 12, 'bold');
      y += 7;

      for (const [payer, data] of Object.entries(report.paidByBreakdown)) {
        checkPage(12);
        addText(`${payer}: ${data.count} invoices, ${fmt(data.total)}`, 18, 10, 'normal');
        y += 6;
      }
      y += 5;
    }

    // Detailed invoice list
    if (report.invoices && report.invoices.length > 0) {
      checkPage(30);
      doc.setDrawColor(59, 130, 246);
      doc.line(14, y, pageWidth - 14, y);
      y += 8;
      addText('Invoice Details', 14, 14, 'bold');
      y += 8;

      // Table header
      doc.setFillColor(240, 240, 240);
      doc.rect(14, y - 4, pageWidth - 28, 7, 'F');
      addText('Date', 16, 8, 'bold', [60, 60, 60]);
      addText('Supplier', 42, 8, 'bold', [60, 60, 60]);
      addText('Unit', 100, 8, 'bold', [60, 60, 60]);
      addText('Amount', 125, 8, 'bold', [60, 60, 60]);
      addText('GST', 150, 8, 'bold', [60, 60, 60]);
      addText('Paid By', 170, 8, 'bold', [60, 60, 60]);
      y += 6;

      for (const inv of report.invoices) {
        checkPage(8);
        addText(fmtDate(inv.invoice_date), 16, 8, 'normal', [40, 40, 40]);
        const supplierText = inv.supplier.length > 28 ? inv.supplier.substring(0, 25) + '...' : inv.supplier;
        addText(supplierText, 42, 8, 'normal', [40, 40, 40]);
        addText(capitalize(inv.business_unit), 100, 8, 'normal', [40, 40, 40]);
        addText(fmt(inv.amount), 125, 8, 'normal', [40, 40, 40]);
        addText(inv.gst_amount ? fmt(inv.gst_amount) : '\u2014', 150, 8, 'normal', [40, 40, 40]);
        addText(inv.paid_by || '\u2014', 170, 8, 'normal', [40, 40, 40]);
        y += 5;
      }
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(`NPI Expense Report - Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.getHeight() - 10);
    }

    const dateStr = new Date().toISOString().split('T')[0];
    doc.save(`NPI-Expense-Report-${dateStr}.pdf`);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Reports</h2>

      <div className="bg-navy-light border border-slate-dim/30 rounded-xl p-5">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-slate-muted mb-1">From Date</label>
            <input
              type="date"
              value={filters.from_date}
              onChange={(e) => setFilters(f => ({ ...f, from_date: e.target.value }))}
              className="px-3 py-2 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-muted mb-1">To Date</label>
            <input
              type="date"
              value={filters.to_date}
              onChange={(e) => setFilters(f => ({ ...f, to_date: e.target.value }))}
              className="px-3 py-2 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-muted mb-1">Business Unit</label>
            <select
              value={filters.business_unit}
              onChange={(e) => setFilters(f => ({ ...f, business_unit: e.target.value }))}
              className="px-3 py-2 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
            >
              <option value="all">All Units</option>
              {BUSINESS_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-muted mb-1">Paid By</label>
            <select
              value={filters.paid_by}
              onChange={(e) => setFilters(f => ({ ...f, paid_by: e.target.value }))}
              className="px-3 py-2 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
            >
              <option value="all">All</option>
              {PAID_BY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <button
            onClick={generateReport}
            disabled={loading}
            className="px-5 py-2 bg-blue-accent hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">{error}</p>
      )}

      {report && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Report Results</h3>
              <p className="text-xs text-slate-muted mt-0.5">
                {report.totalCount} invoices &middot; {fmt(report.totalAmount)} total
              </p>
            </div>
            <button
              onClick={exportPdf}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export PDF
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-navy-light border border-slate-dim/30 rounded-xl p-5">
              <p className="text-xs text-slate-muted uppercase tracking-wide mb-1">Total Amount</p>
              <p className="text-2xl font-bold tabular-nums text-white">{fmt(report.totalAmount)}</p>
            </div>
            <div className="bg-navy-light border border-slate-dim/30 rounded-xl p-5">
              <p className="text-xs text-slate-muted uppercase tracking-wide mb-1">Total GST</p>
              <p className="text-2xl font-bold tabular-nums text-white">{fmt(report.totalGst)}</p>
            </div>
            <div className="bg-navy-light border border-slate-dim/30 rounded-xl p-5">
              <p className="text-xs text-slate-muted uppercase tracking-wide mb-1">Invoice Count</p>
              <p className="text-2xl font-bold tabular-nums text-white">{report.totalCount}</p>
            </div>
          </div>

          {/* Business Unit Breakdown */}
          {report.unitSummary && Object.keys(report.unitSummary).length > 0 && (
            <div className="bg-navy-light border border-slate-dim/30 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-white mb-4">By Business Unit</h4>
              <div className="space-y-3">
                {Object.entries(report.unitSummary).map(([unit, data]) => {
                  const meta = getUnitMeta(unit);
                  const pct = report.totalAmount > 0 ? ((data.total / report.totalAmount) * 100).toFixed(1) : 0;
                  return (
                    <div key={unit}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${meta.bg} ${meta.text} ${meta.border}`}>
                            {meta.label}
                          </span>
                          <span className="text-slate-muted text-xs">{data.count} invoices</span>
                        </div>
                        <span className="text-white font-medium text-sm tabular-nums">{fmt(data.total)} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-navy rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: meta.color }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-slate-muted">
                        <span>Paid: {fmt(data.paid)}</span>
                        <span>Unpaid: {fmt(data.unpaid)}</span>
                        <span>GST: {fmt(data.gst)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Paid By Breakdown */}
          {report.paidByBreakdown && Object.keys(report.paidByBreakdown).length > 0 && (
            <div className="bg-navy-light border border-slate-dim/30 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-white mb-4">By Who Paid</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(report.paidByBreakdown).sort((a, b) => b[1].total - a[1].total).map(([payer, data]) => (
                  <div key={payer} className="bg-navy/60 border border-slate-dim/20 rounded-lg p-4">
                    <p className="text-white font-medium text-sm">{payer}</p>
                    <p className="text-xl font-bold tabular-nums text-white mt-1">{fmt(data.total)}</p>
                    <p className="text-xs text-slate-muted mt-1">{data.count} invoice{data.count !== 1 ? 's' : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoice List */}
          {report.invoices && report.invoices.length > 0 && (
            <div className="bg-navy-light border border-slate-dim/30 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-dim/20">
                <h4 className="text-sm font-semibold text-white">Invoice Details</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-dim/20">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-muted uppercase">Date</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-muted uppercase">Supplier</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-muted uppercase">Unit</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-muted uppercase">Category</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-muted uppercase">Amount</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-muted uppercase">GST</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-muted uppercase">Paid By</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-muted uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-dim/15">
                    {report.invoices.map((inv) => {
                      const unitMeta = getUnitMeta(inv.business_unit);
                      return (
                        <tr key={inv.id} className="hover:bg-navy/40">
                          <td className="px-4 py-2.5 text-slate-300 whitespace-nowrap tabular-nums">{fmtDate(inv.invoice_date)}</td>
                          <td className="px-4 py-2.5 text-white">{inv.supplier}</td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${unitMeta.bg} ${unitMeta.text} ${unitMeta.border}`}>
                              {unitMeta.label}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-slate-300">{capitalize(inv.category || 'general')}</td>
                          <td className="px-4 py-2.5 text-white font-medium tabular-nums">{fmt(inv.amount)}</td>
                          <td className="px-4 py-2.5 text-slate-muted tabular-nums">{inv.gst_amount ? fmt(inv.gst_amount) : '\u2014'}</td>
                          <td className="px-4 py-2.5 text-slate-300">{inv.paid_by || '\u2014'}</td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${getStatusStyle(inv.status)}`}>
                              {capitalize(inv.status)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {!report && !loading && !error && (
        <div className="mt-12 text-center">
          <svg className="w-16 h-16 text-slate-dim mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
          </svg>
          <p className="text-slate-muted text-sm">Select filters and click Generate Report</p>
          <p className="text-slate-dim text-xs mt-1">Reports can be exported to PDF</p>
        </div>
      )}
    </div>
  );
}

// ─── PARTNER SHARE ──────────────────────────────────────
function PartnerShare() {
  const [filters, setFilters] = useState({
    business_unit: 'all',
    from_date: '',
    to_date: '',
    category: 'all',
  });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sharePercent, setSharePercent] = useState(33);
  const [showGst, setShowGst] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api('report', { params: { business_unit: filters.business_unit, from_date: filters.from_date, to_date: filters.to_date } });
      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const share = sharePercent / 100;

  const filteredInvoices = report?.invoices?.filter(inv => {
    if (filters.category !== 'all' && inv.category !== filters.category) return false;
    return true;
  }) || [];

  const totalAmount = filteredInvoices.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const totalGst = filteredInvoices.reduce((s, i) => s + (parseFloat(i.gst_amount) || 0), 0);
  const partnerAmount = totalAmount * share;
  const partnerGst = totalGst * share;

  // Group by category
  const byCat = {};
  filteredInvoices.forEach(inv => {
    const cat = inv.category || 'general';
    if (!byCat[cat]) byCat[cat] = { total: 0, gst: 0, count: 0 };
    byCat[cat].total += parseFloat(inv.amount) || 0;
    byCat[cat].gst += parseFloat(inv.gst_amount) || 0;
    byCat[cat].count++;
  });

  const exportPartnerPdf = () => {
    if (!filteredInvoices.length) return;

    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    const margin = 18;
    const contentW = pw - margin * 2;
    let y = 0;
    let rowAlt = false;

    const txt = (text, x, size = 10, style = 'normal', color = [0, 0, 0]) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', style);
      doc.setTextColor(...color);
      doc.text(String(text), x, y);
    };

    const txtR = (text, x, size = 10, style = 'normal', color = [0, 0, 0]) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', style);
      doc.setTextColor(...color);
      doc.text(String(text), x, y, { align: 'right' });
    };

    const txtC = (text, x, size = 10, style = 'normal', color = [0, 0, 0]) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', style);
      doc.setTextColor(...color);
      doc.text(String(text), x, y, { align: 'center' });
    };

    const check = (n = 20) => {
      if (y + n > ph - 25) {
        doc.addPage();
        y = 25;
        rowAlt = false;
      }
    };

    const drawLine = (x1, x2, color = [220, 220, 220], width = 0.3) => {
      doc.setDrawColor(...color);
      doc.setLineWidth(width);
      doc.line(x1, y, x2, y);
    };

    // ═══════════════════════════════════════════════
    // PAGE HEADER - Dark banner
    // ═══════════════════════════════════════════════
    doc.setFillColor(20, 30, 48);
    doc.rect(0, 0, pw, 42, 'F');

    // Accent bar
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 42, pw, 1.5, 'F');

    y = 16;
    txt('NATIONWIDE PROJECTS INVESTMENTS', margin, 14, 'bold', [255, 255, 255]);
    y += 7;
    const asOfDate = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
    txt(`Partner Expense Share Breakdown  \u2014  as of ${asOfDate}`, margin, 11, 'normal', [160, 185, 220]);

    // Right side - date
    y = 16;
    txtR('ABN 89 625 369 881', pw - margin, 8, 'normal', [120, 150, 190]);
    y = 23;
    txtR(new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }), pw - margin, 8, 'normal', [120, 150, 190]);

    y = 55;

    // ═══════════════════════════════════════════════
    // REPORT DETAILS BAR
    // ═══════════════════════════════════════════════
    doc.setFillColor(248, 249, 252);
    doc.rect(margin, y - 5, contentW, 18, 'F');
    doc.setDrawColor(230, 232, 240);
    doc.setLineWidth(0.3);
    doc.rect(margin, y - 5, contentW, 18, 'S');

    const fromStr = filters.from_date ? fmtDate(filters.from_date) : 'All time';
    const toStr = filters.to_date ? fmtDate(filters.to_date) : 'Present';
    const unitLabel = filters.business_unit !== 'all' ? capitalize(filters.business_unit) : 'All Business Units';

    txt('Period:', margin + 5, 8, 'bold', [100, 100, 110]);
    txt(`${fromStr}  \u2013  ${toStr}`, margin + 22, 8, 'normal', [50, 50, 60]);
    y += 6;
    txt('Scope:', margin + 5, 8, 'bold', [100, 100, 110]);
    txt(`${unitLabel}  |  ${filteredInvoices.length} expenses  |  Partner share: ${sharePercent}%`, margin + 22, 8, 'normal', [50, 50, 60]);
    y += 12;

    // ═══════════════════════════════════════════════
    // SUMMARY - Two column boxes
    // ═══════════════════════════════════════════════
    const boxW = (contentW - 6) / 2;
    const boxH = showGst ? 36 : 28;

    // Left box - Total
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, boxW, boxH, 2, 2, 'F');
    doc.setDrawColor(225, 228, 235);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, boxW, boxH, 2, 2, 'S');

    const leftBoxY = y;
    y = leftBoxY + 8;
    txt('TOTAL EXPENSES', margin + 6, 7, 'bold', [140, 140, 150]);
    y += 8;
    txt(fmt(totalAmount), margin + 6, 16, 'bold', [30, 35, 45]);
    if (showGst) {
      y += 8;
      txt(`Includes ${fmt(totalGst)} GST`, margin + 6, 8, 'normal', [130, 130, 140]);
    }

    // Right box - Partner Share (highlighted)
    doc.setFillColor(236, 253, 243);
    doc.roundedRect(margin + boxW + 6, leftBoxY, boxW, boxH, 2, 2, 'F');
    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin + boxW + 6, leftBoxY, boxW, boxH, 2, 2, 'S');

    y = leftBoxY + 8;
    txt(`PARTNER SHARE (${sharePercent}%)`, margin + boxW + 12, 7, 'bold', [22, 120, 65]);
    y += 8;
    txt(fmt(partnerAmount), margin + boxW + 12, 16, 'bold', [22, 120, 65]);
    if (showGst) {
      y += 8;
      txt(`Includes ${fmt(partnerGst)} GST`, margin + boxW + 12, 8, 'normal', [22, 120, 65]);
    }

    y = leftBoxY + boxH + 12;

    // ═══════════════════════════════════════════════
    // CATEGORY BREAKDOWN TABLE
    // ═══════════════════════════════════════════════
    txt('Category Breakdown', margin, 12, 'bold', [30, 35, 45]);
    y += 8;

    // Table header
    doc.setFillColor(240, 242, 248);
    doc.rect(margin, y - 4, contentW, 8, 'F');
    doc.setDrawColor(210, 215, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 4, margin + contentW, y + 4);

    txt('CATEGORY', margin + 4, 7.5, 'bold', [80, 85, 95]);
    txtC('ITEMS', margin + contentW * 0.45, 7.5, 'bold', [80, 85, 95]);
    txtR('TOTAL AMOUNT', margin + contentW * 0.72, 7.5, 'bold', [80, 85, 95]);
    if (showGst) txtR('GST', margin + contentW * 0.84, 7.5, 'bold', [80, 85, 95]);
    txtR(`${sharePercent}% SHARE`, margin + contentW - 4, 7.5, 'bold', [22, 120, 65]);
    y += 7;

    const sortedCats = Object.entries(byCat).sort((a, b) => b[1].total - a[1].total);
    rowAlt = false;
    for (const [cat, data] of sortedCats) {
      check(8);
      if (rowAlt) {
        doc.setFillColor(250, 251, 253);
        doc.rect(margin, y - 4, contentW, 7, 'F');
      }
      rowAlt = !rowAlt;
      txt(capitalize(cat), margin + 4, 9, 'normal', [40, 45, 55]);
      txtC(String(data.count), margin + contentW * 0.45, 9, 'normal', [100, 105, 115]);
      txtR(fmt(data.total), margin + contentW * 0.72, 9, 'normal', [40, 45, 55]);
      if (showGst) txtR(fmt(data.gst), margin + contentW * 0.84, 9, 'normal', [100, 105, 115]);
      txtR(fmt(data.total * share), margin + contentW - 4, 9, 'bold', [22, 120, 65]);
      y += 7;
    }

    // Total row
    doc.setFillColor(240, 242, 248);
    doc.rect(margin, y - 4, contentW, 9, 'F');
    doc.setDrawColor(180, 185, 195);
    doc.setLineWidth(0.5);
    doc.line(margin, y - 4, margin + contentW, y - 4);

    txt('TOTAL', margin + 4, 9.5, 'bold', [30, 35, 45]);
    txtC(String(filteredInvoices.length), margin + contentW * 0.45, 9.5, 'bold', [30, 35, 45]);
    txtR(fmt(totalAmount), margin + contentW * 0.72, 9.5, 'bold', [30, 35, 45]);
    if (showGst) txtR(fmt(totalGst), margin + contentW * 0.84, 9.5, 'bold', [30, 35, 45]);
    txtR(fmt(partnerAmount), margin + contentW - 4, 10, 'bold', [22, 120, 65]);
    y += 14;

    // ═══════════════════════════════════════════════
    // DETAILED LINE ITEMS
    // ═══════════════════════════════════════════════
    check(30);
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.6);
    doc.line(margin, y, margin + 30, y);
    y += 7;
    txt('Detailed Expenses', margin, 12, 'bold', [30, 35, 45]);
    y += 8;

    // Table header
    doc.setFillColor(240, 242, 248);
    doc.rect(margin, y - 4, contentW, 8, 'F');
    doc.setDrawColor(210, 215, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 4, margin + contentW, y + 4);

    txt('DATE', margin + 3, 7, 'bold', [80, 85, 95]);
    txt('SUPPLIER', margin + 28, 7, 'bold', [80, 85, 95]);
    txt('CATEGORY', margin + contentW * 0.55, 7, 'bold', [80, 85, 95]);
    txtR('AMOUNT', margin + contentW * 0.8, 7, 'bold', [80, 85, 95]);
    txtR(`${sharePercent}%`, margin + contentW - 3, 7, 'bold', [22, 120, 65]);
    y += 7;

    rowAlt = false;
    const sorted = [...filteredInvoices].sort((a, b) => a.invoice_date?.localeCompare(b.invoice_date));
    for (const inv of sorted) {
      check(7);
      if (rowAlt) {
        doc.setFillColor(250, 251, 253);
        doc.rect(margin, y - 3.5, contentW, 6, 'F');
      }
      rowAlt = !rowAlt;

      txt(fmtDate(inv.invoice_date), margin + 3, 7.5, 'normal', [80, 85, 95]);
      const sup = inv.supplier.length > 35 ? inv.supplier.substring(0, 32) + '...' : inv.supplier;
      txt(sup, margin + 28, 7.5, 'normal', [40, 45, 55]);
      txt(capitalize(inv.category || 'general'), margin + contentW * 0.55, 7.5, 'normal', [110, 115, 125]);
      txtR(fmt(inv.amount), margin + contentW * 0.8, 7.5, 'normal', [40, 45, 55]);
      txtR(fmt(inv.amount * share), margin + contentW - 3, 7.5, 'bold', [22, 120, 65]);
      y += 6;
    }

    // Detail total
    doc.setDrawColor(180, 185, 195);
    doc.setLineWidth(0.5);
    doc.line(margin, y - 2, margin + contentW, y - 2);
    y += 3;
    doc.setFillColor(240, 242, 248);
    doc.rect(margin, y - 4, contentW, 9, 'F');
    txt('TOTAL', margin + 3, 9, 'bold', [30, 35, 45]);
    txtR(fmt(totalAmount), margin + contentW * 0.8, 9, 'bold', [30, 35, 45]);
    txtR(fmt(partnerAmount), margin + contentW - 3, 9.5, 'bold', [22, 120, 65]);
    y += 14;

    // ═══════════════════════════════════════════════
    // DISCLAIMER / NOTES
    // ═══════════════════════════════════════════════
    check(20);
    drawLine(margin, margin + contentW, [230, 232, 240], 0.3);
    y += 6;
    txt('This document is a summary of shared expenses. All amounts are in AUD.', margin, 7, 'normal', [150, 150, 160]);
    y += 4;
    txt('Please review all line items and contact NPI for any discrepancies.', margin, 7, 'normal', [150, 150, 160]);

    // ═══════════════════════════════════════════════
    // FOOTER ON EVERY PAGE
    // ═══════════════════════════════════════════════
    const pc = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pc; i++) {
      doc.setPage(i);
      // Footer line
      doc.setDrawColor(220, 222, 230);
      doc.setLineWidth(0.3);
      doc.line(margin, ph - 16, pw - margin, ph - 16);

      // Footer text
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 150, 160);
      doc.text('Nationwide Projects Investments Pty Ltd', margin, ph - 11);
      doc.text(`Partner Share Breakdown  \u2022  ${sharePercent}% of total expenses`, margin, ph - 7);
      doc.text(`Page ${i} of ${pc}`, pw - margin, ph - 11, { align: 'right' });
      doc.text(`Generated ${new Date().toLocaleDateString('en-AU')}`, pw - margin, ph - 7, { align: 'right' });
    }

    const dateStr = new Date().toISOString().split('T')[0];
    doc.save(`NPI-Partner-Share-${sharePercent}pct-${dateStr}.pdf`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Partner Share Breakdown</h2>
          <p className="text-sm text-slate-muted mt-0.5">Calculate partner&apos;s share of total expenses</p>
        </div>
      </div>

      <div className="bg-navy-light border border-slate-dim/30 rounded-xl p-5">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-slate-muted mb-1">From Date</label>
            <input
              type="date"
              value={filters.from_date}
              onChange={(e) => setFilters(f => ({ ...f, from_date: e.target.value }))}
              className="px-3 py-2 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-muted mb-1">To Date</label>
            <input
              type="date"
              value={filters.to_date}
              onChange={(e) => setFilters(f => ({ ...f, to_date: e.target.value }))}
              className="px-3 py-2 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-muted mb-1">Business Unit</label>
            <select
              value={filters.business_unit}
              onChange={(e) => setFilters(f => ({ ...f, business_unit: e.target.value }))}
              className="px-3 py-2 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
            >
              <option value="all">All Units</option>
              {BUSINESS_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-muted mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
              className="px-3 py-2 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{capitalize(c)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-muted mb-1">Partner %</label>
            <input
              type="number"
              min="1"
              max="100"
              value={sharePercent}
              onChange={(e) => setSharePercent(Math.min(100, Math.max(1, parseInt(e.target.value) || 33)))}
              className="w-20 px-3 py-2 bg-navy border border-slate-dim/50 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-accent/50 tabular-nums"
            />
          </div>
          <div className="flex items-center gap-2 pb-0.5">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showGst}
                onChange={(e) => setShowGst(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-dim/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-accent"></div>
            </label>
            <span className="text-xs text-slate-muted">Show GST</span>
          </div>
          <button
            onClick={generate}
            disabled={loading}
            className="px-5 py-2 bg-blue-accent hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">{error}</p>
      )}

      {report && filteredInvoices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-6"
        >
          {/* Top summary cards */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${showGst ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-4`}>
            <div className="bg-navy-light border border-slate-dim/30 rounded-xl p-5">
              <p className="text-xs text-slate-muted uppercase tracking-wide mb-1">Total Expenses</p>
              <p className="text-2xl font-bold tabular-nums text-white">{fmt(totalAmount)}</p>
              <p className="text-xs text-slate-muted mt-1">{filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-xl p-5">
              <p className="text-xs text-emerald-400 uppercase tracking-wide mb-1">Partner Share ({sharePercent}%)</p>
              <p className="text-2xl font-bold tabular-nums text-emerald-400">{fmt(partnerAmount)}</p>
              <p className="text-xs text-emerald-400/60 mt-1">Amount owed by partner</p>
            </div>
            {showGst && (
              <>
                <div className="bg-navy-light border border-slate-dim/30 rounded-xl p-5">
                  <p className="text-xs text-slate-muted uppercase tracking-wide mb-1">Total GST</p>
                  <p className="text-2xl font-bold tabular-nums text-white">{fmt(totalGst)}</p>
                </div>
                <div className="bg-navy-light border border-slate-dim/30 rounded-xl p-5">
                  <p className="text-xs text-slate-muted uppercase tracking-wide mb-1">Partner GST ({sharePercent}%)</p>
                  <p className="text-2xl font-bold tabular-nums text-white">{fmt(partnerGst)}</p>
                </div>
              </>
            )}
          </div>

          {/* Category breakdown */}
          <div className="bg-navy-light border border-slate-dim/30 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white">Breakdown by Category</h4>
              <button
                onClick={exportPartnerPdf}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Export PDF
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-dim/30">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-muted uppercase">Category</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-muted uppercase">Items</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-muted uppercase">Total</th>
                    {showGst && <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-muted uppercase">GST</th>}
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-emerald-400/80 uppercase">{sharePercent}% Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-dim/15">
                  {Object.entries(byCat).sort((a, b) => b[1].total - a[1].total).map(([cat, data]) => (
                    <tr key={cat} className="hover:bg-navy/40">
                      <td className="px-4 py-3 text-white font-medium">{capitalize(cat)}</td>
                      <td className="px-4 py-3 text-slate-muted tabular-nums">{data.count}</td>
                      <td className="px-4 py-3 text-white tabular-nums text-right">{fmt(data.total)}</td>
                      {showGst && <td className="px-4 py-3 text-slate-muted tabular-nums text-right">{fmt(data.gst)}</td>}
                      <td className="px-4 py-3 text-emerald-400 font-bold tabular-nums text-right">{fmt(data.total * share)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-slate-dim/40">
                  <tr className="bg-navy/40">
                    <td className="px-4 py-3 text-white font-bold">Total</td>
                    <td className="px-4 py-3 text-white tabular-nums font-medium">{filteredInvoices.length}</td>
                    <td className="px-4 py-3 text-white font-bold tabular-nums text-right">{fmt(totalAmount)}</td>
                    {showGst && <td className="px-4 py-3 text-white tabular-nums text-right">{fmt(totalGst)}</td>}
                    <td className="px-4 py-3 text-emerald-400 font-bold tabular-nums text-right text-lg">{fmt(partnerAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Detailed invoice list */}
          <div className="bg-navy-light border border-slate-dim/30 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-dim/20">
              <h4 className="text-sm font-semibold text-white">Line Items</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-dim/20">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-muted uppercase">Date</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-muted uppercase">Supplier</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-muted uppercase">Category</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-muted uppercase">Amount</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-emerald-400/80 uppercase">{sharePercent}%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-dim/15">
                  {filteredInvoices.sort((a, b) => a.invoice_date?.localeCompare(b.invoice_date)).map(inv => (
                    <tr key={inv.id} className="hover:bg-navy/40">
                      <td className="px-4 py-2.5 text-slate-300 whitespace-nowrap tabular-nums">{fmtDate(inv.invoice_date)}</td>
                      <td className="px-4 py-2.5 text-white">{inv.supplier}</td>
                      <td className="px-4 py-2.5 text-slate-300">{capitalize(inv.category || 'general')}</td>
                      <td className="px-4 py-2.5 text-white tabular-nums text-right">{fmt(inv.amount)}</td>
                      <td className="px-4 py-2.5 text-emerald-400 font-medium tabular-nums text-right">{fmt(inv.amount * share)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-slate-dim/40">
                  <tr className="bg-navy/40">
                    <td colSpan={3} className="px-4 py-3 text-white font-bold">Total</td>
                    <td className="px-4 py-3 text-white font-bold tabular-nums text-right">{fmt(totalAmount)}</td>
                    <td className="px-4 py-3 text-emerald-400 font-bold tabular-nums text-right">{fmt(partnerAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {report && filteredInvoices.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-slate-muted text-sm">No expenses found for the selected filters</p>
        </div>
      )}

      {!report && !loading && !error && (
        <div className="mt-12 text-center">
          <svg className="w-16 h-16 text-slate-dim mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
          <p className="text-slate-muted text-sm">Select a date range and click Generate</p>
          <p className="text-slate-dim text-xs mt-1">Creates a {sharePercent}% share breakdown for your partner</p>
        </div>
      )}
    </div>
  );
}
