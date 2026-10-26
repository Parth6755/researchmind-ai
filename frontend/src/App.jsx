
import { useState } from 'react'
import {
  Activity, ArrowDownToLine, ArrowRight, BookOpen, BrainCircuit,
  Check, ChevronDown, CircleHelp, Clock3, FileText, FlaskConical,
  Globe2, LayoutDashboard, LoaderCircle, Menu, MessageSquareText,
  Plus, Search, Settings2, ShieldCheck, Sparkles, X
} from 'lucide-react'

const initialHistory = [
  { title: 'Environmental Benefits of Solar Energy', date: 'Today · 7:42 PM', status: 'Completed' },
  { title: 'AI in Renewable Energy Forecasting', date: 'Yesterday', status: 'Completed' },
  { title: 'Large Language Models for Research', date: 'Oct 24, 2026', status: 'Completed' },
]

const agents = [
  { name: 'Search Agent', detail: 'Discovering relevant sources', icon: Globe2 },
  { name: 'Reader Agent', detail: 'Extracting key findings', icon: BookOpen },
  { name: 'Writer Chain', detail: 'Synthesizing your report', icon: FileText },
  { name: 'Critic Chain', detail: 'Reviewing quality and evidence', icon: ShieldCheck },
]

export default function App() {
  const [topic, setTopic] = useState('')
  const [activePage, setActivePage] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [running, setRunning] = useState(false)
  const [stage, setStage] = useState(-1)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState(initialHistory)
  const [apiUrl, setApiUrl] = useState('http://localhost:8000')
  const [showSettings, setShowSettings] = useState(false)

  async function startResearch() {
    if (!topic.trim() || running) return
    setRunning(true)
    setStage(0)
    setResult(null)
    setError('')
    setActivePage('New Research')

    try {
      const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Research request failed.')
      setResult(data)
      setStage(4)
      setHistory(prev => [
        { title: topic.trim(), date: 'Just now', status: 'Completed' },
        ...prev.filter(item => item.title !== topic.trim()),
      ])
    } catch (err) {
      setError(`${err.message}. Make sure the ResearchMind API is running.`)
      setStage(-1)
    } finally {
      setRunning(false)
    }
  }

  function downloadReport() {
    if (!result?.report) return
    const blob = new Blob([result.report], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'researchmind-report.md'
    link.click()
    URL.revokeObjectURL(url)
  }
  
  function downloadReportPDF() {
    if (!result?.report) return

    const pdf = new jsPDF()
    const margin = 15
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const maxWidth = pageWidth - margin * 2
    const lines = pdf.splitTextToSize(result.report, maxWidth)

    let y = margin

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)

    lines.forEach((line) => {
      if (y > pageHeight - margin) {
        pdf.addPage()
        y = margin
      }

      pdf.text(line, margin, y)
      y += 6
    })

    pdf.save('researchmind-report.pdf')
  }


  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'New Research', icon: Plus },
    { label: 'Research History', icon: Clock3 },
  ]

  return (
    <div className="min-h-screen bg-[#080b16] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-64 left-1/3 h-[500px] w-[700px] rounded-full bg-violet-700/10 blur-[140px]" />
        <div className="absolute top-1/2 right-0 h-[450px] w-[450px] rounded-full bg-blue-700/10 blur-[140px]" />
      </div>

      <div className="relative flex min-h-screen">
        {sidebarOpen && (
          <button aria-label="Close menu" className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-white/[0.07] bg-[#0b0e1b] px-5 py-6 transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center gap-3 px-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-900/30">
              <BrainCircuit size={23} />
            </div>
            <div>
              <h1 className="text-[17px] font-bold tracking-tight">ResearchMind<span className="text-violet-400"> AI</span></h1>
              <p className="mt-0.5 text-[10px] tracking-[0.19em] text-slate-500">INTELLIGENCE WORKSPACE</p>
            </div>
            <button className="ml-auto text-slate-500 lg:hidden" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
          </div>

          <button onClick={() => { setActivePage('New Research'); setResult(null); setError(''); setSidebarOpen(false) }} className="mt-10 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3 text-sm font-semibold shadow-lg shadow-violet-950/30 transition hover:brightness-110">
            <Plus size={17} /> New research
          </button>

          <p className="mb-3 mt-9 px-2 text-[10px] font-semibold tracking-[0.18em] text-slate-600">WORKSPACE</p>
          <nav className="space-y-1">
            {navItems.map(({ label, icon: Icon }) => (
              <button key={label} onClick={() => { setActivePage(label); setSidebarOpen(false); if (label === 'New Research') { setResult(null); setError('') } }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition ${activePage === label ? 'border border-violet-400/15 bg-violet-500/10 text-violet-200' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'}`}>
                <Icon size={17} /> {label}
                {label === 'Research History' && <span className="ml-auto rounded-md bg-white/[0.06] px-2 py-0.5 text-[10px]">{history.length}</span>}
              </button>
            ))}
          </nav>

          <div className="mt-9 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold"><Sparkles size={15} className="text-violet-400" /> Research pipeline</div>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">Four specialized stages work together to turn a question into a structured report.</p>
            <div className="mt-4 space-y-3">
              {agents.map(({ name, icon: Icon }, i) => (
                <div key={name} className="flex items-center gap-2.5 text-[11px] text-slate-400">
                  <Icon size={14} className={stage > i ? 'text-emerald-400' : stage === i ? 'text-violet-300' : 'text-slate-600'} />
                  <span>{name}</span>
                  <span className="ml-auto">{stage > i ? <Check size={13} className="text-emerald-400" /> : stage === i && running ? <LoaderCircle size={13} className="animate-spin text-violet-300" /> : null}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto border-t border-white/[0.07] pt-5">
            <button onClick={() => setShowSettings(true)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-slate-400 hover:bg-white/[0.04] hover:text-white"><Settings2 size={17} /> Settings</button>
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/30 to-blue-500/30"><FlaskConical size={17} className="text-violet-200" /></div>
              <div><p className="text-xs font-semibold">ResearchMind</p><p className="mt-1 text-[10px] text-slate-500">AI Research Studio</p></div>
              <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[70px] items-center justify-between border-b border-white/[0.07] bg-[#080b16]/85 px-5 backdrop-blur-xl sm:px-8">
            <div className="flex items-center gap-3">
              <button className="text-slate-400 lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button>
              <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex"><span>Workspace</span><span>/</span><span className="text-slate-200">{activePage}</span></div>
              <h2 className="text-sm font-semibold sm:hidden">{activePage}</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/[0.06] px-3 py-1.5 text-[11px] text-emerald-300 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Research workspace</span>
              <button title="Help" className="rounded-lg border border-white/[0.08] p-2 text-slate-400 hover:text-white"><CircleHelp size={17} /></button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-400/20 bg-gradient-to-br from-violet-500/30 to-blue-500/30 text-xs font-bold text-violet-100">R</div>
            </div>
          </header>

          <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8 lg:px-10">
            {activePage === 'Research History' ? (
              <section className="animate-in">
                <div className="mb-8">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Your workspace</p>
                  <h2 className="text-3xl font-bold tracking-tight">Research history</h2>
                  <p className="mt-2 text-sm text-slate-400">Your recent research sessions in one place.</p>
                </div>
                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101322]/80">
                  {history.map((item, i) => <div key={`${item.title}-${i}`} className="flex flex-col gap-3 border-b border-white/[0.06] p-5 last:border-0 sm:flex-row sm:items-center"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300"><FileText size={18} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.date}</p></div><span className="w-fit rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-2.5 py-1 text-[10px] text-emerald-300">{item.status}</span></div>)}
                </div>
              </section>
            ) : (
              <>
                <section className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-br from-[#17132d] via-[#11162b] to-[#0d1b30] p-6 sm:p-9">
                  <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full bg-violet-500/15 blur-[80px]" />
                  <div className="pointer-events-none absolute -bottom-36 right-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-[70px]" />
                  <div className="relative">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-200"><Sparkles size={13} /> Multi-agent intelligence</div>
                    <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-[40px]">Research smarter.<br /><span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">Discover what matters.</span></h2>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">Turn complex questions into structured research reports with your AI-powered team of search, reading, writing, and review agents.</p>
                    <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-2"><Globe2 size={14} className="text-blue-300" /> Web research</span>
                      <span className="flex items-center gap-2"><BrainCircuit size={14} className="text-violet-300" /> AI synthesis</span>
                      <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-300" /> Critical review</span>
                    </div>
                  </div>
                </section>

                <section className="mt-7 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Research agents', value: '04', note: 'Connected stages', icon: BrainCircuit, color: 'text-violet-300', bg: 'bg-violet-400/10' },
                    { label: 'Research sessions', value: String(history.length).padStart(2, '0'), note: 'Visible in this session', icon: Activity, color: 'text-blue-300', bg: 'bg-blue-400/10' },
                    { label: 'Review system', value: 'Active', note: 'Quality feedback enabled', icon: ShieldCheck, color: 'text-emerald-300', bg: 'bg-emerald-400/10' },
                  ].map(({ label, value, note, icon: Icon, color, bg }) => <div key={label} className="rounded-xl border border-white/[0.07] bg-[#101322]/75 p-5 transition hover:border-violet-400/20"><div className="flex items-center justify-between"><p className="text-xs text-slate-400">{label}</p><div className={`rounded-lg p-2 ${bg} ${color}`}><Icon size={17} /></div></div><p className="mt-4 text-2xl font-bold tracking-tight">{value}</p><p className="mt-1 text-[11px] text-slate-500">{note}</p></div>)}
                </section>

                <section className="mt-9 grid gap-7 xl:grid-cols-[minmax(0,1fr)_310px]">
                  <div className="min-w-0">
                    <div className="mb-4 flex items-center justify-between"><div><h3 className="text-base font-semibold">Start a research session</h3><p className="mt-1 text-xs text-slate-500">What would you like to investigate today?</p></div><span className="rounded-lg border border-white/[0.08] px-2.5 py-1 text-[10px] text-slate-400">AI workspace</span></div>
                    <div className="rounded-2xl border border-white/[0.09] bg-[#101322]/80 p-5 sm:p-6">
                      <label htmlFor="research-topic" className="mb-3 block text-xs font-medium text-slate-300">Research topic or question</label>
                      <textarea id="research-topic" value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) startResearch() }} placeholder="e.g. How can machine learning improve short-term solar PV power forecasting?" rows={4} className="w-full resize-y rounded-xl border border-white/[0.09] bg-[#090c18] px-4 py-4 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/[0.08]" />
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><p className="text-[10px] text-slate-500">Tip: Be specific for more focused research. Ctrl + Enter to run.</p><span className="text-[10px] tabular-nums text-slate-500">{topic.length} characters</span></div>
                      <button onClick={startResearch} disabled={running || !topic.trim()} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3.5 text-sm font-semibold shadow-lg shadow-violet-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
                        {running ? <><LoaderCircle size={17} className="animate-spin" /> Research in progress...</> : <><Sparkles size={16} /> Start research <ArrowRight size={16} /></>}
                      </button>
                      {error && <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-xs leading-5 text-red-200">{error}</div>}
                    </div>

                    {(running || result) && <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#101322]/80 p-5 sm:p-6">
                      <div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold">Research pipeline</h3><p className="mt-1 text-xs text-slate-500">{running ? 'Processing your research request' : 'Pipeline execution finished'}</p></div>{running && <LoaderCircle size={18} className="animate-spin text-violet-300" />}</div>
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {agents.map(({ name, detail, icon: Icon }, i) => {
                          const done = result ? true : stage > i
                          const current = running && stage === i
                          return <div key={name} className={`rounded-xl border p-4 ${done ? 'border-emerald-400/20 bg-emerald-400/[0.04]' : current ? 'border-violet-400/30 bg-violet-400/[0.05]' : 'border-white/[0.06] bg-white/[0.015]'}`}>
                            <div className="flex items-center gap-3"><div className={`rounded-lg p-2 ${done ? 'bg-emerald-400/10 text-emerald-300' : 'bg-violet-400/10 text-violet-300'}`}><Icon size={17} /></div><div className="min-w-0 flex-1"><p className="text-xs font-semibold">{name}</p><p className="mt-1 text-[10px] text-slate-500">{done ? 'Completed' : current ? 'In progress' : detail}</p></div>{done ? <Check size={16} className="text-emerald-300" /> : current ? <LoaderCircle size={16} className="animate-spin text-violet-300" /> : <span className="h-2 w-2 rounded-full bg-slate-700" />}</div>
                          </div>
                        })}
                      </div>
                      {running && <p className="mt-4 text-[11px] text-slate-500">The API processes the workflow as one request; individual stage timing is approximate until backend progress streaming is implemented.</p>}
                    </div>}

                    {result && <div className="mt-6 space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs text-violet-300">Research output</p><h3 className="mt-1 text-xl font-bold">Your research report</h3></div><button onClick={downloadReport} className="flex items-center gap-2 rounded-lg border border-white/[0.1] px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05]"><ArrowDownToLine size={15} /> Download Markdown</button></div>
                      <article className="rounded-2xl border border-white/[0.08] bg-[#101322]/80 p-5 sm:p-7">
                        <div className="mb-5 flex items-center gap-2 border-b border-white/[0.07] pb-4 text-xs text-slate-400"><FileText size={15} className="text-violet-300" /> Research report <span className="ml-auto rounded-md bg-emerald-400/10 px-2 py-1 text-[10px] text-emerald-300">Generated</span></div>
                        <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-300">{result.report}</pre>
                      </article>
                      


                      <article className="rounded-2xl border border-violet-400/15 bg-violet-400/[0.035] p-5 sm:p-7">
                        <div className="mb-4 flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={18} className="text-violet-300" /> Critic review</div>
                        <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-300">{result.review}</pre>
                      </article>
                      {result.findings && <details className="rounded-xl border border-white/[0.08] bg-[#101322]/70 p-4"><summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-medium text-slate-300"><ChevronDown size={15} /> View research findings</summary><pre className="mt-4 whitespace-pre-wrap break-words font-sans text-xs leading-6 text-slate-400">{result.findings}</pre></details>}
                    </div>}
                  </div>

                  <aside className="space-y-6">
                    <div className="rounded-2xl border border-white/[0.08] bg-[#101322]/80 p-5">
                      <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">How it works</h3><Activity size={16} className="text-violet-300" /></div>
                      <p className="mt-2 text-xs leading-5 text-slate-500">A coordinated workflow from web discovery to critical review.</p>
                      <div className="mt-5 space-y-4">
                        {agents.map(({ name, detail, icon: Icon }, i) => <div key={name} className="flex gap-3"><div className="flex flex-col items-center"><div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.07] text-violet-300"><Icon size={16} /></div>{i < 3 && <div className="mt-1 h-5 w-px bg-gradient-to-b from-violet-400/30 to-blue-400/10" />}</div><div className="pt-1"><p className="text-xs font-medium">{name}</p><p className="mt-1 text-[10px] leading-4 text-slate-500">{detail}</p></div></div>)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-[#101322]/80 p-5">
                      <div className="flex items-center gap-2"><Clock3 size={16} className="text-blue-300" /><h3 className="text-sm font-semibold">Recent research</h3></div>
                      <div className="mt-4 space-y-4">
                        {history.slice(0, 3).map((item, i) => <button key={`${item.title}-${i}`} onClick={() => { setTopic(item.title); setActivePage('New Research') }} className="group flex w-full gap-3 text-left"><div className="mt-0.5 rounded-lg bg-white/[0.04] p-2 text-slate-400 group-hover:text-violet-300"><FileText size={14} /></div><div className="min-w-0"><p className="line-clamp-2 text-xs leading-5 text-slate-300 group-hover:text-white">{item.title}</p><p className="mt-1 text-[10px] text-slate-600">{item.date}</p></div></button>)}
                      </div>
                      <button onClick={() => setActivePage('Research History')} className="mt-5 flex w-full items-center justify-between border-t border-white/[0.07] pt-4 text-xs text-violet-300 hover:text-violet-200">View all history <ArrowRight size={14} /></button>
                    </div>

                    <div className="rounded-2xl border border-blue-400/10 bg-gradient-to-br from-blue-500/[0.07] to-violet-500/[0.06] p-5">
                      <div className="flex items-center gap-2 text-xs font-semibold"><MessageSquareText size={15} className="text-blue-300" /> Research tip</div>
                      <p className="mt-3 text-xs leading-5 text-slate-400">Ask a focused question, define a time period, and request evidence-backed findings to make your research more useful.</p>
                    </div>
                  </aside>
                </section>
              </>
            )}
          </div>
          <footer className="border-t border-white/[0.06] px-6 py-5 text-center text-[10px] text-slate-600">RESEARCHMIND AI · MULTI-AGENT RESEARCH WORKSPACE</footer>
        </main>
      </div>

      {showSettings && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setShowSettings(false)}><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101322] p-6 shadow-2xl" onClick={e => e.stopPropagation()}><div className="flex items-center justify-between"><h3 className="text-lg font-semibold">API settings</h3><button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white"><X size={18} /></button></div><p className="mt-2 text-xs leading-5 text-slate-400">Set the address of your local ResearchMind backend.</p><label className="mb-2 mt-5 block text-xs text-slate-300">Backend API URL</label><input value={apiUrl} onChange={e => setApiUrl(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#080b16] px-3 py-3 text-sm outline-none focus:border-violet-400/50" placeholder="http://localhost:8000" /><button onClick={() => setShowSettings(false)} className="mt-5 w-full rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-semibold">Save settings</button></div></div>}
    </div>
  )
}
