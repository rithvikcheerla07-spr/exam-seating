import React, { useState } from 'react';
import { DatabaseState, executeSQLQuery, QueryResult } from '../db/sqlEngine';
import { sampleSQLQueries, SQLQueryItem } from '../db/sampleQueries';
import { 
  Play, 
  RotateCcw, 
  Terminal, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Copy, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  Table as TableIcon
} from 'lucide-react';

interface SQLLabProps {
  dbState: DatabaseState;
  onUpdateDbState: (newState: DatabaseState) => void;
  onResetDB: () => void;
}

export const SQLLab: React.FC<SQLLabProps> = ({
  dbState,
  onUpdateDbState,
  onResetDB,
}) => {
  const [queryInput, setQueryInput] = useState<string>(
    `SELECT roll_no, student_name, branch, email FROM student WHERE branch = 'CSE' LIMIT 15;`
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [executing, setExecuting] = useState<boolean>(false);

  const categories = [
    'All',
    'Basic SELECT',
    'WHERE & Filtering',
    'Sorting & Pagination',
    'Aggregates & GROUP BY',
    'JOINS',
    'Subqueries & Nested',
    'Relational Views',
    'DDL & Schema',
    'DML Operations',
    'Triggers & Procedures',
    'Transactions & ACID',
    'Query Optimization',
    'Business Reports',
  ];

  const filteredQueries = selectedCategory === 'All'
    ? sampleSQLQueries
    : sampleSQLQueries.filter(q => q.category === selectedCategory);

  const handleRunQuery = () => {
    if (!queryInput.trim()) return;
    setExecuting(true);
    setTimeout(() => {
      const res = executeSQLQuery(queryInput, dbState, onUpdateDbState);
      setQueryResult(res);
      setExecuting(false);
    }, 60);
  };

  const handleSelectSample = (sample: SQLQueryItem) => {
    setQueryInput(sample.query);
    const res = executeSQLQuery(sample.query, dbState, onUpdateDbState);
    setQueryResult(res);
  };

  const handleExportCSV = () => {
    if (!queryResult || !queryResult.rows || queryResult.rows.length === 0) return;
    const headers = queryResult.columns || Object.keys(queryResult.rows[0]);
    const csvContent = [
      headers.join(','),
      ...queryResult.rows.map(row =>
        headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sql_query_result.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner specifically for evaluators / Mam */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 text-white shadow-xl border border-blue-900/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  DBMS Testing Workbench &amp; Live SQL Engine
                </h2>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                  MySQL 8.0 Evaluator Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Specially built for professors, evaluators, and viva testing. Execute any relational SQL query, test JOINs, test triggers, inspect transaction rollbacks/commits, test views, and run 80+ pre-built queries directly inside Google AI Studio.
              </p>
            </div>
          </div>

          {/* Transaction status */}
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 ${
              dbState.inTransaction 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${dbState.inTransaction ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span>{dbState.inTransaction ? 'TRANSACTION ACTIVE (UNCOMMITTED)' : 'AUTOCOMMIT: ON'}</span>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Reset database to clean initial state?')) {
                  onResetDB();
                  setQueryResult(null);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
              title="Reset database records"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 80+ SQL Query Bank */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col h-[650px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">DBMS Query Bank (80+)</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {filteredQueries.length} Queries
            </span>
          </div>

          {/* Category Filter */}
          <div className="py-3">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Select Syllabus Category:
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Query list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
            {filteredQueries.map(sample => (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className="pt-2 text-left p-2.5 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-200 cursor-pointer transition group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-blue-700">
                  <span>{sample.title}</span>
                  <span className="text-[10px] font-mono bg-slate-100 group-hover:bg-blue-100 px-1.5 py-0.2 rounded text-slate-500">
                    Q#{sample.id}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-mono">
                  {sample.query}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {sample.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: SQL Editor & Output Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* SQL Editor Box */}
          <div className="bg-slate-900 rounded-2xl shadow-md border border-slate-800 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span className="text-slate-400 ml-2">MySQL Query Console (Database: exam_alloc_db)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(queryInput);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-2 py-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px]"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => setQueryInput('')}
                  className="px-2 py-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition text-[11px]"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="p-4">
              <textarea
                value={queryInput}
                onChange={e => setQueryInput(e.target.value)}
                rows={5}
                className="w-full bg-transparent text-emerald-400 font-mono text-xs sm:text-sm resize-none focus:outline-none"
                placeholder="Write your SQL statement here... (e.g. SELECT * FROM student; or DESCRIBE hall; or BEGIN;)"
              />
            </div>

            <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
              <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                <span>Tip: Supports SELECT, WHERE, JOINs, GROUP BY, HAVING, DESC, SHOW, TRANSACTIONS</span>
              </div>
              <button
                onClick={handleRunQuery}
                disabled={executing}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{executing ? 'Executing...' : 'Run Query (Execute)'}</span>
              </button>
            </div>
          </div>

          {/* Results Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-slate-600" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Query Execution Results
                </h4>
                {queryResult && (
                  <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {queryResult.rowCount ?? queryResult.rows?.length ?? 0} rows in set ({((queryResult.executionTimeMs || 1) / 1000).toFixed(3)} sec)
                  </span>
                )}
              </div>

              {queryResult && queryResult.rows && queryResult.rows.length > 0 && (
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export CSV</span>
                </button>
              )}
            </div>

            <div className="p-4">
              {!queryResult ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  Click <span className="font-bold text-blue-600">&ldquo;Run Query&rdquo;</span> above or pick any question from the DBMS Query Bank on the left to see live tabular results.
                </div>
              ) : !queryResult.success ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">MySQL Execution Error:</span>
                    <p className="font-mono mt-1">{queryResult.message}</p>
                  </div>
                </div>
              ) : (
                <div>
                  {queryResult.message && (
                    <div className="p-3 mb-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-mono">{queryResult.message}</span>
                    </div>
                  )}

                  {queryResult.rows && queryResult.rows.length > 0 ? (
                    <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
                      <table className="w-full text-left text-xs border border-slate-200">
                        <thead className="bg-slate-100 sticky top-0 text-slate-800 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                          <tr>
                            {(queryResult.columns || Object.keys(queryResult.rows[0])).map(col => (
                              <th key={col} className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {queryResult.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-blue-50/50 transition">
                              {(queryResult.columns || Object.keys(row)).map(col => (
                                <td key={col} className="py-2 px-3 border-r border-slate-100 whitespace-nowrap text-slate-700">
                                  {row[col] !== null && row[col] !== undefined ? String(row[col]) : <span className="text-slate-300 italic">NULL</span>}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
