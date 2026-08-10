import { useMemo, useState } from 'react';
import { exportToCSV } from '../../services/utils';
import { useToast } from '../../context/ToastContext';

/**
 * Generic sortable / searchable / paginated data table.
 * Ported from assets/js/table.js (MediTable) as a reusable React component.
 *
 * columns: [{ key, label, render?: (value, row) => ReactNode, sortable?: boolean }]
 */
export default function DataTable({ data, columns, title, searchPlaceholder = 'Search table...', pageSize = 10, exportFilename = 'medisphere_export.csv' }) {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    let result = Array.isArray(data) ? [...data] : [];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(row => columns.some(col => {
        const val = row[col.key];
        return val !== undefined && val !== null && val.toString().toLowerCase().includes(q);
      }));
    }
    if (sortKey) {
      result.sort((a, b) => {
        let valA = a[sortKey] ?? '';
        let valB = b[sortKey] ?? '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data, columns, query, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const pageData = filtered.slice(startIdx, startIdx + pageSize);

  function handleSort(key) {
    if (sortKey === key) {
      setSortAsc(prev => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function handleExport() {
    const exportRows = filtered.map(row => {
      const obj = {};
      columns.forEach(col => {
        const raw = row[col.key];
        obj[col.label] = Array.isArray(raw) ? raw.join('; ') : (typeof raw === 'object' && raw !== null ? JSON.stringify(raw) : raw);
      });
      return obj;
    });
    exportToCSV(exportFilename, exportRows);
    toast.success(`Exported ${filtered.length} records to ${exportFilename}`);
  }

  return (
    <>
      <div className="table-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {title && <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF' }}>{title}</h3>}
          <span className="badge badge-info">{filtered.length} Total</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="table-search">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input
              type="text"
              value={query}
              placeholder={searchPlaceholder}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            />
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleExport}>Export CSV</button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.label + col.key} onClick={() => handleSort(col.key)}>
                  {col.label} {sortKey === col.key ? (sortAsc ? '▲' : '▼') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr><td colSpan={columns.length} style={{ textAlign: 'center', color: '#9CA3AF', padding: 24 }}>No records found.</td></tr>
            ) : pageData.map((row, ridx) => (
              <tr key={row.id ? `${row.id}-${ridx}` : ridx}>
                {columns.map(col => (
                  <td key={col.label + col.key}>{col.render ? col.render(row[col.key], row) : (row[col.key] ?? 'N/A')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="table-pagination">
          <div>Showing {pageData.length ? startIdx + 1 : 0} to {Math.min(startIdx + pageSize, filtered.length)} of {filtered.length} records</div>
          <div className="pagination-controls">
            <button className="page-btn" disabled={currentPage === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 8px', fontWeight: 600, color: '#FFFFFF' }}>{currentPage} / {totalPages}</span>
            <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
          </div>
        </div>
      </div>
    </>
  );
}
