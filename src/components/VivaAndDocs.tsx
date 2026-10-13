import React, { useState } from 'react';
import { vivaQuestionsBank, VivaItem } from '../db/vivaQuestions';
import { academicDocumentation } from '../db/documentation';
import { pythonFlaskCode } from '../db/pythonFlaskCode';
import { 
  BookOpen, 
  HelpCircle, 
  Code2, 
  FileText, 
  Search, 
  Copy, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Layers,
  Database
} from 'lucide-react';

export const VivaAndDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'viva' | 'docs' | 'sql_script' | 'python_code'>('viva');
  const [vivaCategory, setVivaCategory] = useState<string>('All');
  const [vivaSearch, setVivaSearch] = useState<string>('');
  const [expandedVivaId, setExpandedVivaId] = useState<number | null>(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Filter Viva questions
  const filteredViva = vivaQuestionsBank.filter(item => {
    const matchesCat = vivaCategory === 'All' || item.category === vivaCategory;
    const matchesSearch =
      !vivaSearch.trim() ||
      item.question.toLowerCase().includes(vivaSearch.toLowerCase()) ||
      item.answer.toLowerCase().includes(vivaSearch.toLowerCase()) ||
      item.keyConcepts.some(k => k.toLowerCase().includes(vivaSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('viva')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'viva'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>150 Viva &amp; Interview Q&amp;A</span>
          <span className="text-[10px] bg-blue-500/30 px-1.5 py-0.2 rounded font-normal text-blue-100">
            High Scoring
          </span>
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'docs'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Academic Project Report &amp; Normalization</span>
        </button>

        <button
          onClick={() => setActiveTab('sql_script')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'sql_script'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Complete MySQL Schema Script (.sql)</span>
        </button>

        <button
          onClick={() => setActiveTab('python_code')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'python_code'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Python Flask &amp; MySQL Backend Files</span>
        </button>
      </div>

      {/* TAB 1: 150 VIVA QUESTIONS */}
      {activeTab === 'viva' && (
        <div className="space-y-6">
          {/* Header & Search */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Comprehensive Viva Voce &amp; Technical Interview Question Bank</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Includes 50 DBMS Core Concepts, 50 Advanced SQL Interview Questions, and 50 Project-Specific Viva Questions with full answers.
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                {['All', 'DBMS Core', 'SQL Interview', 'Project Viva'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setVivaCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      vivaCategory === cat
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search any question, answer, or keyword (e.g., Normalization, B+ Tree, ACID, Deadlock, Trigger)..."
                value={vivaSearch}
                onChange={e => setVivaSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Questions Accordion List */}
          <div className="space-y-3">
            {filteredViva.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
                No viva questions match your search filter.
              </div>
            ) : (
              filteredViva.map(item => {
                const isExpanded = expandedVivaId === item.id;
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition"
                  >
                    <button
                      onClick={() => setExpandedVivaId(isExpanded ? null : item.id)}
                      className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 hover:bg-slate-50/70 transition"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {item.id}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {item.category}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {item.question}
                          </h4>
                        </div>
                      </div>
                      <div className="text-slate-400 mt-1 shrink-0">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/40">
                        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-10">
                          {item.answer}
                        </div>
                        {item.keyConcepts.length > 0 && (
                          <div className="mt-3 pl-10 flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Keywords:
                            </span>
                            {item.keyConcepts.map(k => (
                              <span
                                key={k}
                                className="text-[10px] font-semibold bg-white border border-slate-200 text-blue-700 px-2 py-0.5 rounded-md"
                              >
                                {k}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ACADEMIC PROJECT REPORT & NORMALIZATION */}
      {activeTab === 'docs' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
              <span>MAJOR PROJECT REPORT • CBP 2026-2027</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              {academicDocumentation.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Technology Stack: {academicDocumentation.techStack}
            </p>
          </div>

          {/* Abstract */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">
              1. Project Abstract
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              {academicDocumentation.abstract}
            </p>
          </div>

          {/* Problem Statement */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">
              2. Problem Statement
            </h3>
            <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {academicDocumentation.problemStatement}
            </div>
          </div>

          {/* Objectives */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-3">
              3. Project Objectives
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
              {academicDocumentation.objectives.map((obj, i) => (
                <li key={i} className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Normalization Proofs (1NF, 2NF, 3NF) */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">
              4. Relational Database Normalization Analysis (1NF to 3NF)
            </h3>
            <div className="space-y-4">
              {Object.entries(academicDocumentation.normalization).map(([key, form]: any) => (
                <div key={key} className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-900 text-sm text-blue-700">
                      {form.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{form.description}</p>
                  <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto">
                    {form.schema}
                  </pre>
                  {form.issues && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg mt-2 font-medium">
                      ⚠️ Limitation: {form.issues}
                    </p>
                  )}
                  {form.benefits && (
                    <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg mt-2 font-medium">
                      ✓ Resolved State: {form.benefits}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Entity Relationship Model */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-3">
              5. Relational Schema &amp; Cardinality Ratios
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {academicDocumentation.erDiagram.relationships.map((rel, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-bold text-slate-900 flex items-center justify-between mb-1">
                    <span>{rel.from} &rarr; {rel.to}</span>
                    <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {rel.type}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{rel.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Algorithm */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">
              6. Deterministic Row-Major Seating Algorithm
            </h3>
            <pre className="p-4 bg-slate-900 text-blue-300 font-mono text-xs rounded-2xl overflow-x-auto leading-relaxed">
              {academicDocumentation.algorithms.allocationAlgorithm}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: COMPLETE MYSQL SCRIPT */}
      {activeTab === 'sql_script' && (
        <div className="bg-slate-900 rounded-3xl shadow-xl border border-slate-800 overflow-hidden">
          <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span>database_schema.sql (Production Ready DDL &amp; DML)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Full MySQL 8.0 schema containing 8 normalized tables, views, triggers, and stored procedures.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(academicDocumentation.rawMySQLScript, 'sql_script')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedKey === 'sql_script' ? 'Copied!' : 'Copy Script'}</span>
              </button>
              <button
                onClick={() => handleDownloadFile('database_schema.sql', academicDocumentation.rawMySQLScript)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .SQL</span>
              </button>
            </div>
          </div>

          <div className="p-4 max-h-[600px] overflow-y-auto">
            <pre className="text-emerald-400 font-mono text-xs leading-relaxed whitespace-pre overflow-x-auto">
              {academicDocumentation.rawMySQLScript}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: STANDALONE PYTHON FLASK BACKEND CODE */}
      {activeTab === 'python_code' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Standalone Python Flask &amp; MySQL 8.0 Source Code
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Download these standalone Python files to run the project locally on your university lab workstation using Python 3.9+ and MySQL.
              </p>
            </div>
            <button
              onClick={() => {
                handleDownloadFile('app.py', pythonFlaskCode.appPy);
                handleDownloadFile('config.py', pythonFlaskCode.configPy);
                handleDownloadFile('database.py', pythonFlaskCode.databasePy);
                handleDownloadFile('requirements.txt', pythonFlaskCode.requirementsTxt);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <Download className="w-4 h-4" />
              <span>Download All Python Files</span>
            </button>
          </div>

          {/* app.py code */}
          <div className="bg-slate-900 rounded-2xl shadow-md border border-slate-800 overflow-hidden">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="font-mono text-blue-400 font-bold">app.py (Flask REST APIs &amp; Allocation Algorithm)</span>
              <button
                onClick={() => handleCopy(pythonFlaskCode.appPy, 'app_py')}
                className="flex items-center gap-1 text-[11px] hover:text-white"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedKey === 'app_py' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-4 max-h-[400px] overflow-y-auto">
              <pre className="text-slate-200 font-mono text-xs leading-relaxed">
                {pythonFlaskCode.appPy}
              </pre>
            </div>
          </div>

          {/* database.py code */}
          <div className="bg-slate-900 rounded-2xl shadow-md border border-slate-800 overflow-hidden">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="font-mono text-purple-400 font-bold">database.py (PyMySQL Connection Factory)</span>
              <button
                onClick={() => handleCopy(pythonFlaskCode.databasePy, 'db_py')}
                className="flex items-center gap-1 text-[11px] hover:text-white"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedKey === 'db_py' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-4 max-h-[200px] overflow-y-auto">
              <pre className="text-slate-200 font-mono text-xs leading-relaxed">
                {pythonFlaskCode.databasePy}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
