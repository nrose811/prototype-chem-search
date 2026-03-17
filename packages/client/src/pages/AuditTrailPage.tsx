import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuditEvents } from '../services/auditService';
import { AuditEvent } from '../mocks/demoData';
import './AuditTrailPage.css';

const PAGE_SIZE = 10;

function formatDate(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const sec = String(d.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${h}:${min}:${sec} EST`;
}

function entityTypeIcon(type?: string) {
  switch (type) {
    case 'File':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 1h5.586L13 4.414V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm5 1H4v12h8V5H9V2z" />
        </svg>
      );
    case 'Batch':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 3h12v2H2V3zm1 3h10v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6zm3 2v4h4V8H6z" />
        </svg>
      );
    case 'Signature':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M1 13h14v1H1v-1zm1.5-3.5L9 3l2 2-6.5 6.5H2.5v-2zM10 2l2-2 2 2-2 2-2-2z" />
        </svg>
      );
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="8" r="6" />
        </svg>
      );
  }
}

function AuditTrailPage() {
  const navigate = useNavigate();
  const allEvents = getAuditEvents();
  const [page, setPage] = useState(1);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(allEvents.length / PAGE_SIZE));
  const events = allEvents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleViewObject = (event: AuditEvent) => {
    if (event.entityType === 'File' && event.entityId) {
      navigate(`/details/${event.entityId}`);
    } else if (event.entityType === 'Batch') {
      navigate('/apps/cro-data-review');
    } else if (event.entityType === 'Signature') {
      navigate('/apps/cro-data-review/report/latest');
    } else {
      // Fallback: navigate to audit trail detail (stay on page)
      navigate('/audit-trail');
    }
  };

  return (
    <div className="audit-trail-page">
      <div className="audit-header">
        <div className="audit-header-top">
          <h1>Audit Trail</h1>
          <span className="audit-delay-note">
            Actions can take up to 5 minutes to display in the Audit Trail
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="audit-filters">
        <div className="audit-filter-group">
          <select className="audit-filter-select" defaultValue="username">
            <option value="username">User Name</option>
          </select>
          <input
            className="audit-filter-input"
            type="text"
            placeholder="Search User Name (e.g. John Smith)"
            readOnly
          />
        </div>
        <select className="audit-filter-select" defaultValue="last-month">
          <option value="last-month">Last Month</option>
          <option value="last-week">Last Week</option>
          <option value="all">All Time</option>
        </select>
        <select className="audit-filter-select" defaultValue="">
          <option value="">Entity</option>
          <option value="File">File</option>
          <option value="Batch">Batch</option>
          <option value="Signature">Signature</option>
        </select>
        <select className="audit-filter-select" defaultValue="">
          <option value="">Action</option>
          <option value="Upload">Upload</option>
          <option value="Download">Download</option>
          <option value="E-Signature Applied">E-Signature Applied</option>
        </select>
      </div>

      <button className="audit-export-btn">Export All Data to CSV</button>

      {/* Table */}
      <div className="audit-table-wrapper">
        <table className="audit-table">
          <thead>
            <tr>
              <th className="at-col-entity">ENTITY</th>
              <th className="at-col-type">ENTITY TYPE</th>
              <th className="at-col-action">ACTION</th>
              <th className="at-col-user">USER</th>
              <th className="at-col-date">DATE</th>
              <th className="at-col-reason">CHANGE REASON</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.eventId} className={event.result === 'FAILURE' ? 'audit-row-failure' : ''}>
                <td className="at-col-entity">
                  <div className="at-entity-name">
                    {event.entityType === 'File' ? 'File ' : ''}&quot;{event.entityName || event.eventType}&quot;
                  </div>
                  <div className="at-entity-id">{event.entityId || event.eventId}</div>
                  <button
                    className="at-link-btn"
                    onClick={() => handleViewObject(event)}
                  >
                    View Object
                  </button>
                </td>
                <td className="at-col-type">
                  <span className="at-type-cell">
                    {entityTypeIcon(event.entityType)}
                    <span>{event.entityType || 'Event'}</span>
                  </span>
                </td>
                <td className="at-col-action">
                  <div className={`at-action-name ${event.result === 'FAILURE' ? 'at-action-fail' : ''}`}>
                    {event.eventType}
                  </div>
                  <button
                    className="at-link-btn"
                    onClick={() =>
                      setExpandedEvent(expandedEvent === event.eventId ? null : event.eventId)
                    }
                  >
                    View Change
                  </button>
                  {expandedEvent === event.eventId && (
                    <div className="at-change-detail">
                      <div className="at-detail-row">
                        <span className="at-detail-label">Event ID</span>
                        <span className="at-detail-value">{event.eventId}</span>
                      </div>
                      <div className="at-detail-row">
                        <span className="at-detail-label">Result</span>
                        <span className={`at-detail-value at-result-${event.result.toLowerCase()}`}>
                          {event.result}
                        </span>
                      </div>
                      <div className="at-detail-row">
                        <span className="at-detail-label">Dataset Version</span>
                        <span className="at-detail-value">{event.datasetVersion}</span>
                      </div>
                      <div className="at-detail-row">
                        <span className="at-detail-label">Origin</span>
                        <span className="at-detail-value">{event.origin}</span>
                      </div>
                      {event.details &&
                        Object.entries(event.details).map(([key, value]) => (
                          <div className="at-detail-row" key={key}>
                            <span className="at-detail-label">{key}</span>
                            <span className="at-detail-value">{value}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </td>
                <td className="at-col-user">
                  <div className="at-user-cell">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="at-user-icon">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 1c-3.315 0-6 1.79-6 4v1h12v-1c0-2.21-2.685-4-6-4z" />
                    </svg>
                    <div>
                      <div className="at-user-name">{event.userName}</div>
                      <div className="at-user-role">{event.userRole || 'Platform User'}</div>
                      <div className="at-user-ip">{event.userIp || ''}</div>
                    </div>
                  </div>
                </td>
                <td className="at-col-date">{formatDate(event.timestamp)}</td>
                <td className="at-col-reason">{event.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="audit-pagination">
          <button
            className="audit-page-btn"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`audit-page-btn ${p === page ? 'active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="audit-page-btn"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}

export default AuditTrailPage;

