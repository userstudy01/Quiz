import { useCallback, useEffect, useMemo, useState } from 'react';
import API, { apiError } from '../utils/api';
import { PageHeader } from '../components/ui';

const RANGES = [
  ['today', 'Today'],
  ['7d', 'Last 7 days'],
  ['30d', 'Last 30 days'],
  ['all', 'All time'],
];

function StatCard({ label, value, loading }) {
  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-card">
      <p className="text-sm text-ink-muted">{label}</p>
      {loading ? (
        <span className="mt-3 block h-8 w-14 animate-pulse rounded bg-line" aria-hidden="true" />
      ) : (
        <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      )}
    </div>
  );
}

// Build a continuous daily series so the chart has no gaps for fixed ranges.
function buildDailySeries(series, range) {
  const map = new Map(series.map((s) => [s.date, s.count]));
  if (range === 'all' || range === 'today') {
    return series.map((s) => ({ label: s.date.slice(5), count: s.count }));
  }
  const days = range === '7d' ? 7 : 30;
  const out = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(Date.now() - i * 864e5);
    const key = d.toISOString().slice(0, 10);
    out.push({ label: key.slice(5), count: map.get(key) || 0 });
  }
  return out;
}

function BarChart({ data }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex h-40 items-end gap-1 overflow-x-auto" role="img" aria-label="Views over time">
      {data.map((d, i) => (
        <div key={i} className="flex min-w-[8px] flex-1 flex-col items-center gap-1" title={`${d.label}: ${d.count}`}>
          <div
            className="w-full rounded-t bg-ink/80 transition-all"
            style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count ? '2px' : '0' }}
          />
          {data.length <= 14 ? (
            <span className="text-[9px] text-ink-muted">{d.label}</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const [range, setRange] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/analytics/summary', { params: { range } });
      setData(res.data);
    } catch (err) {
      setError(apiError(err, 'Could not load analytics.'));
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  const totals = data?.totals || {};
  const daily = useMemo(() => (data ? buildDailySeries(data.series || [], data.range) : []), [data]);
  const totalDevice = (data?.devices || []).reduce((s, d) => s + d.count, 0) || 1;
  const maxTopViews = Math.max(1, ...(data?.topProjects || []).map((p) => p.views));
  const totalReferrers = (data?.referrers || []).reduce((s, r) => s + r.count, 0) || 1;
  const isEmpty = !loading && !error && (totals.views || 0) === 0;

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Anonymous, privacy-conscious visitor analytics for your public portfolio."
        action={
          <div className="flex items-center gap-2">
            <label htmlFor="range" className="sr-only">
              Date range
            </label>
            <select
              id="range"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:border-ink/30 focus:outline-none"
            >
              {RANGES.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={load}
              className="rounded-lg border border-line bg-surface px-3 py-2 text-sm hover:border-ink/30"
            >
              Refresh
            </button>
          </div>
        }
      />

      {error ? (
        <p className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total views" value={totals.views ?? 0} loading={loading} />
            <StatCard label="Unique visitors" value={totals.uniqueVisitors ?? 0} loading={loading} />
            <StatCard label="Project views" value={totals.projectViews ?? 0} loading={loading} />
            <StatCard label="Messages" value={totals.messages ?? 0} loading={loading} />
          </div>

          {isEmpty ? (
            <div className="mt-8 rounded-xl border border-dashed border-line bg-surface p-10 text-center">
              <p className="font-medium">No visits recorded in this range yet</p>
              <p className="mt-1 text-sm text-ink-muted">
                Tracking is active — analytics will appear here as visitors browse your public portfolio.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              <section className="lg:col-span-2 min-w-0">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent">Views over time</h2>
                <div className="rounded-card border border-line bg-surface shadow-card p-5">
                  {loading ? (
                    <div className="h-40 animate-pulse rounded bg-line" aria-hidden="true" />
                  ) : daily.length ? (
                    <BarChart data={daily} />
                  ) : (
                    <p className="py-14 text-center text-sm text-ink-muted">No data for this range.</p>
                  )}
                </div>
              </section>

              <section className="min-w-0">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent">Devices</h2>
                <div className="space-y-3 rounded-card border border-line bg-surface shadow-card p-5">
                  {(data?.devices || []).length ? (
                    data.devices.map((d) => (
                      <div key={d.device}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="capitalize">{d.device}</span>
                          <span className="text-ink-muted">{Math.round((d.count / totalDevice) * 100)}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-line">
                          <div className="h-full rounded-full bg-ink/80" style={{ width: `${(d.count / totalDevice) * 100}%` }} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-ink-muted">No device data yet.</p>
                  )}
                </div>
              </section>

              <section className="min-w-0 lg:col-span-2">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent">Most viewed projects</h2>
                {(data?.topProjects || []).length ? (
                  <ul className="space-y-3 rounded-card border border-line bg-surface shadow-card p-5">
                    {data.topProjects.map((p, i) => (
                      <li key={p.slug}>
                        <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                          <span className="min-w-0 truncate">
                            <span className="mr-2 text-ink-muted">{i + 1}.</span>
                            <span className="font-medium">{p.title}</span>
                            <span className="ml-2 hidden text-xs text-ink-muted sm:inline">/{p.slug}</span>
                          </span>
                          <span className="shrink-0 tabular-nums text-ink-muted">{p.views}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-line">
                          <div className="h-full rounded-full bg-accent/80" style={{ width: `${(p.views / maxTopViews) * 100}%` }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="rounded-xl border border-dashed border-line bg-surface p-8 text-center text-sm text-ink-muted">
                    No project views in this range yet.
                  </p>
                )}
              </section>

              <section className="min-w-0">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent">Referrers</h2>
                <div className="space-y-3 rounded-card border border-line bg-surface shadow-card p-5">
                  {(data?.referrers || []).length ? (
                    data.referrers.map((r) => (
                      <div key={r.host}>
                        <div className="mb-1 flex justify-between gap-2 text-sm">
                          <span className="min-w-0 break-all">{r.host}</span>
                          <span className="shrink-0 tabular-nums text-ink-muted">{r.count}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-line">
                          <div className="h-full rounded-full bg-ink/80" style={{ width: `${(r.count / totalReferrers) * 100}%` }} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-ink-muted">No referrer data for this range (direct visits).</p>
                  )}
                </div>
              </section>
            </div>
          )}
        </>
      )}
    </>
  );
}
