import React, { useState, useEffect, useRef } from 'react';
import { useVoteStore } from '../store/useVoteStore';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Cell 
} from 'recharts';
import { 
  ShieldAlert, Settings, 
  Trash2, ShieldAlert as AlertIcon, 
  Terminal, ShieldCheck, AlertCircle, 
  Users, Activity, Database, Layers, Plus, 
  Briefcase, Landmark, CheckSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { 
    isAdmin, electionState, toggleElectionState, resetSystemState, 
    citizens, candidates, constituencies, 
    logs, clearLogs, threats, simulateIntrusionAttack,
    addNewCandidate, addNewConstituency, createElectionConfig,
    electionTitle, startDate, endDate, gasCounter, activeNodesCount
  } = useVoteStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'election' | 'candidates' | 'constituency' | 'fraud' | 'logs'>('overview');
  const [fraudMsg, setFraudMsg] = useState('');

  // Form states
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateParty, setNewCandidateParty] = useState('');
  const [newCandidateSymbol, setNewCandidateSymbol] = useState('Sun');
  const [newCandidateDistrict, setNewCandidateDistrict] = useState('');
  const [newDistrictName, setNewDistrictName] = useState('');
  const [electionTitleInput, setElectionTitleInput] = useState(electionTitle);
  const [electionStartInput, setElectionStartInput] = useState(startDate);
  const [electionEndInput, setElectionEndInput] = useState(endDate);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-gray-200 rounded-2xl shadow-sm text-center space-y-6">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-primary">Coordinator Access Denied</h2>
        <p className="text-xs text-gray-500">
          This dashboard contains restricted election commission parameters. Please authenticate as a coordinator first.
        </p>
        <Link
          to="/login"
          className="inline-block w-full py-2.5 px-4 bg-primary hover:bg-[#1C3A63] text-white text-xs font-bold rounded-xl shadow-sm transition"
        >
          Coordinator Login
        </Link>
      </div>
    );
  }

  // Turnout stats
  const totalCitizens = citizens.length;
  const castVotes = citizens.filter(c => c.hasVoted).length;

  // Chart data
  const chartData = candidates.map(c => ({
    name: c.name.split(' ').slice(-1)[0],
    votes: c.voteCount,
    party: c.party
  }));

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName || !newCandidateParty || !newCandidateDistrict) return;
    addNewCandidate(newCandidateName, newCandidateParty, newCandidateSymbol, newCandidateDistrict);
    setNewCandidateName('');
    setNewCandidateParty('');
  };

  const handleCreateDistrict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistrictName) return;
    addNewConstituency(newDistrictName);
    setNewDistrictName('');
  };

  const handleUpdateElection = (e: React.FormEvent) => {
    e.preventDefault();
    createElectionConfig(electionTitleInput, electionStartInput, electionEndInput);
  };

  const triggerAttack = (type: 'double_vote' | 'merkle_alter') => {
    setFraudMsg('');
    const res = simulateIntrusionAttack(type);
    setFraudMsg(res.message);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Dashboard Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A1F44]">Coordinator Control Center</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure candidates, constituencies, monitor node consensus sync, and audit intrusion block threats.
          </p>
        </div>
        
        {/* Reset button */}
        <button
          onClick={() => {
            resetSystemState();
            setFraudMsg('');
          }}
          className="py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" /> Reset System State
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap border-b border-gray-200 gap-1 bg-gray-50 p-1 rounded-xl">
        {[
          { id: 'overview', label: 'Tally Overview', icon: Landmark },
          { id: 'election', label: 'Election settings', icon: Settings },
          { id: 'candidates', label: 'Candidate Registry', icon: Briefcase },
          { id: 'constituency', label: 'Constituency Setup', icon: CheckSquare },
          { id: 'fraud', label: 'Fraud Detection Center', icon: AlertIcon },
          { id: 'logs', label: 'Peer Node Logs', icon: Terminal }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-2 px-4 text-xs font-bold rounded-lg transition-all ${
                isActive 
                  ? 'bg-white text-primary shadow-sm border border-gray-200/50' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[400px]">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Registered electorate</span>
                  <span className="text-xl font-bold text-primary">{totalCitizens} Citizens</span>
                </div>
              </div>

              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Ballots Cast Tally</span>
                  <span className="text-xl font-bold text-primary">{castVotes} Confirmed</span>
                </div>
              </div>

              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
                  <Database className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Cumulative Gas Used</span>
                  <span className="text-xl font-bold text-primary">{gasCounter.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
                  <Layers className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Active Peer Nodes</span>
                  <span className="text-xl font-bold text-primary">{activeNodesCount} Nodes Online</span>
                </div>
              </div>
            </div>

            {/* Split layout: Tally chart & recent alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Votes Standings Chart */}
              <div className="col-span-1 lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
                <h3 className="font-bold text-sm text-[#0A1F44]"> Electorate Standings Tally</h3>
                {castVotes === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-12">No votes cast yet in this election cycle.</p>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ left: -20 }}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="votes" fill="#0A1F44" radius={[4, 4, 0, 0]} maxBarSize={40}>
                          {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0A1F44' : '#1C3A63'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Threat Level status */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-[#0A1F44]">Network Security Tally</h3>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-semibold">Active Intrusion Threats</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      threats.length > 0 ? 'bg-red-50 text-red-700 border border-red-100 animate-pulse' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      {threats.length > 0 ? `${threats.length} Caught` : '0 Threats'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs text-gray-500 font-sans leading-relaxed">
                  <p>Consensus Node security layers check double-votes dynamically. If an attack occurs, node verification fails fast.</p>
                  <Link to="/results" className="text-[#00B4D8] font-bold block mt-2 hover:underline">
                    View Live Tally Dashboard &rarr;
                  </Link>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ELECTION SETTINGS */}
        {activeTab === 'election' && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 max-w-xl mx-auto space-y-6">
            <h3 className="font-bold text-sm text-[#0A1F44] border-b border-gray-100 pb-2">Election Parameters Setup</h3>
            
            <form onSubmit={handleUpdateElection} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">Election Cycle Title</label>
                <input
                  type="text"
                  value={electionTitleInput}
                  onChange={(e) => setElectionTitleInput(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={electionStartInput}
                    onChange={(e) => setElectionStartInput(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={electionEndInput}
                    onChange={(e) => setElectionEndInput(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-primary hover:bg-[#1C3A63] text-white font-bold rounded-lg"
              >
                Apply Parameters Setup
              </button>
            </form>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <span className="text-xs text-gray-500 font-bold block">Current Election Status Lifecycle:</span>
              <div className="flex gap-2">
                {(['not_started', 'active', 'completed'] as const).map((state) => {
                  const isActive = electionState === state;
                  return (
                    <button
                      key={state}
                      onClick={() => toggleElectionState(state)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition border ${
                        isActive 
                          ? 'bg-primary text-white border-primary' 
                          : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {state}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CANDIDATES REGISTRY */}
        {activeTab === 'candidates' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create Candidate Form */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-sm text-[#0A1F44] border-b border-gray-100 pb-2">Register New Candidate</h3>
              
              <form onSubmit={handleCreateCandidate} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">Candidate Name</label>
                  <input
                    type="text"
                    value={newCandidateName}
                    onChange={(e) => setNewCandidateName(e.target.value)}
                    placeholder="e.g. Dr. Aarav Patel"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">Party Affiliation</label>
                  <input
                    type="text"
                    value={newCandidateParty}
                    onChange={(e) => setNewCandidateParty(e.target.value)}
                    placeholder="e.g. Democratic Citizens Party"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">Symbol Design Name</label>
                  <select
                    value={newCandidateSymbol}
                    onChange={(e) => setNewCandidateSymbol(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-xs"
                  >
                    <option value="Sun">Sun Symbol</option>
                    <option value="Sparkles">Sparkles Symbol</option>
                    <option value="Leaf">Leaf Symbol</option>
                    <option value="Cpu">CPU Symbol</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">Constituency District</label>
                  <select
                    value={newCandidateDistrict}
                    onChange={(e) => setNewCandidateDistrict(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-xs"
                  >
                    <option value="">Select District</option>
                    {constituencies.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-primary hover:bg-[#1C3A63] text-white font-bold rounded-lg flex justify-center items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Candidate Choice
                </button>
              </form>
            </div>

            {/* Candidates Registry Table */}
            <div className="col-span-1 lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-sm text-[#0A1F44]">Registered Candidates Tally</h3>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold pb-2">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Party</th>
                      <th className="pb-2">District</th>
                      <th className="pb-2 text-right">Votes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {candidates.map((candidate) => (
                      <tr key={candidate.id} className="text-primary hover:bg-gray-50/50">
                        <td className="py-3 font-bold">{candidate.name}</td>
                        <td className="py-3 text-gray-500">{candidate.party}</td>
                        <td className="py-3 font-bold">{candidate.constituency}</td>
                        <td className="py-3 text-right font-mono font-bold">{candidate.voteCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: CONSTITUENCY SETUP */}
        {activeTab === 'constituency' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            
            {/* Create district Form */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-sm text-[#0A1F44] border-b border-gray-100 pb-2">Setup Constituency District</h3>
              
              <form onSubmit={handleCreateDistrict} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">District Name</label>
                  <input
                    type="text"
                    value={newDistrictName}
                    onChange={(e) => setNewDistrictName(e.target.value)}
                    placeholder="e.g. District D"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-primary hover:bg-[#1C3A63] text-white font-bold rounded-lg flex justify-center items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Setup District
                </button>
              </form>
            </div>

            {/* List districts */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-sm text-[#0A1F44]">Registered Districts Tally</h3>
              <ul className="divide-y divide-gray-50 text-xs">
                {constituencies.map((c) => (
                  <li key={c} className="py-3 text-primary font-bold flex justify-between">
                    <span>{c}</span>
                    <span className="text-[10px] text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded border border-emerald-100">Active</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}

        {/* TAB 5: FRAUD DETECTION CENTER */}
        {activeTab === 'fraud' && (
          <div className="space-y-6">
            
            {/* Attacks Simulator controls */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-sm text-[#0A1F44]">Intrusion Attack Simulators</h3>
              <p className="text-xs text-gray-500">
                Initiate simulated security threats to test the EVM validation node defenses.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => triggerAttack('double_vote')}
                  className="py-3 px-5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-left transition flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <span className="font-bold text-[#0A1F44] block">Simulate Double-Voting</span>
                    <span className="text-[10px] text-gray-500 block">Try casting another vote for a voter who already cast.</span>
                  </div>
                </button>

                <button
                  onClick={() => triggerAttack('merkle_alter')}
                  className="py-3 px-5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-left transition flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <span className="font-bold text-[#0A1F44] block">Simulate Ledger Alteration</span>
                    <span className="text-[10px] text-gray-500 block">Inject invalid historical blocks to check node hashes verification.</span>
                  </div>
                </button>
              </div>

              {fraudMsg && (
                <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs rounded-xl flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold block mb-0.5">Consensus Node Action Report:</span>
                    <span>{fraudMsg}</span>
                  </div>
                </div>
              )}
            </div>

            {/* List of threats caught */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-sm text-[#0A1F44]">Intrusion Threats History</h3>
              {threats.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">Zero security threat alerts logged in this session.</p>
              ) : (
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold pb-2">
                        <th className="pb-2">Timestamp</th>
                        <th className="pb-2">Alert Type</th>
                        <th className="pb-2">Target Node/ID</th>
                        <th className="pb-2">Constituency</th>
                        <th className="pb-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {threats.map((threat) => (
                        <tr key={threat.id} className="text-primary hover:bg-gray-50/50 font-mono">
                          <td className="py-3 text-[10px] font-sans">{new Date(threat.timestamp).toLocaleTimeString()}</td>
                          <td className="py-3 font-sans text-red-700 font-bold">{threat.alertType}</td>
                          <td className="py-3">{threat.voterId}</td>
                          <td className="py-3 font-sans">{threat.constituency}</td>
                          <td className="py-3 text-right">
                            <span className="px-2 py-0.5 rounded text-[9px] font-sans font-bold bg-emerald-50 border border-emerald-100 text-emerald-700">
                              {threat.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 6: PEER NODE LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-900 shadow-lg flex flex-col h-[400px]">
            {/* Log Header */}
            <div className="bg-slate-900 px-6 py-3 flex justify-between items-center border-b border-slate-950">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00B4D8]" />
                <span className="text-[10px] text-gray-300 font-mono font-bold">Consensus Node Logs</span>
              </div>
              <button
                onClick={clearLogs}
                className="text-[9px] text-gray-500 hover:text-gray-300 font-mono transition"
              >
                Clear Console
              </button>
            </div>

            {/* Log display */}
            <div className="flex-grow p-6 overflow-y-auto font-mono text-[10px] space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {logs.map((log) => {
                let colorClass = 'text-sky-400';
                if (log.type === 'success') colorClass = 'text-emerald-400';
                if (log.type === 'warning') colorClass = 'text-amber-400';
                if (log.type === 'error') colorClass = 'text-rose-500';

                return (
                  <div key={log.id} className="flex items-start gap-2.5">
                    <span className="text-slate-600 flex-shrink-0">
                      [{new Date(log.timestamp).toLocaleTimeString()}]
                    </span>
                    <span className={`${colorClass} leading-relaxed break-all`}>
                      {log.message}
                    </span>
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>
          </div>
        )}

      </div>

    </section>
  );
};
