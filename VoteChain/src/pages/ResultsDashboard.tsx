import { useVoteStore } from '../store/useVoteStore';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie, Legend 
} from 'recharts';
import { 
  BarChart3, PieChart as PieIcon, Activity, 
  Users, CheckSquare, Layers, AlertCircle 
} from 'lucide-react';

const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6'];

export const ResultsDashboard = () => {
  const { candidates, citizens, blockchain } = useVoteStore();

  const totalVoters = citizens.length;
  const votedCount = citizens.filter(v => v.hasVoted).length;
  const turnoutPercent = totalVoters > 0 ? Math.round((votedCount / totalVoters) * 100) : 0;
  
  // Format data for Recharts
  const chartData = candidates.map((c, idx) => ({
    name: c.name.split(' ').slice(-1)[0], // Just last name for spacing
    fullName: c.name,
    party: c.party,
    votes: c.voteCount,
    color: COLORS[idx % COLORS.length]
  }));

  const pieData = candidates.map((c, idx) => ({
    name: c.name.split(' ').slice(-1)[0],
    value: c.voteCount,
    color: COLORS[idx % COLORS.length]
  })).filter(d => d.value > 0);

  // Custom tooltips
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0A1F44] text-white p-4 rounded-xl shadow-lg border border-white/10 text-xs">
          <p className="font-bold text-sm">{data.fullName}</p>
          <p className="text-gray-300 mt-1">{data.party}</p>
          <p className="text-accent font-bold mt-2 text-sm">{data.votes} Verified Votes</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-accent" />
            <h1 className="text-3xl font-bold text-primary">Live Election Stands</h1>
          </div>
          <p className="text-sm text-neutralDark mt-1">
            Real-time analytics of encrypted votes verified and aggregated by consensus nodes.
          </p>
        </div>
      </div>
      {/* Stats Counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-3xl shadow-card border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Total Electorate</span>
            <span className="text-2xl font-bold text-primary">{totalVoters} Registered</span>
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl shadow-card border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Cast Ballots</span>
            <span className="text-2xl font-bold text-primary">{votedCount} Confirmed</span>
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl shadow-card border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/5 text-accent flex items-center justify-center flex-shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Voter Turnout</span>
            <span className="text-2xl font-bold text-primary">{turnoutPercent}%</span>
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl shadow-card border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Blockchain height</span>
            <span className="text-2xl font-bold text-primary">#{blockchain.length - 1} Mined</span>
          </div>
        </div>
      </div>

      {votedCount === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-gray-100 text-center space-y-4 shadow-card">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-primary">No Ballots Counted Yet</h3>
          <p className="text-sm text-neutralDark max-w-md mx-auto">
            The database currently lists zero cast ballots. Cast your vote in the voting booth or visit the Admin Panel to generate simulated voting campaigns.
          </p>
        </div>
      ) : (
        /* Charts Grid Split */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Bar Chart comparing standings */}
          <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-8 space-y-6">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" /> Verified Vote Standings
            </h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="votes" radius={[10, 10, 0, 0]} maxBarSize={55}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart showing percentage split */}
          <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-8 space-y-6">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-secondary" /> Electoral Share Division
            </h2>
            <div className="h-80 w-full flex items-center justify-center">
              {pieData.length === 0 ? (
                <p className="text-xs text-gray-400">Awaiting shares calculation...</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      iconSize={8}
                      formatter={(value, entry: any) => (
                        <span className="text-xs text-secondary font-medium font-sans">
                          {value}: {entry.payload.value} votes
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Text-based breakdown table */}
          <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-8 col-span-1 lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-primary">Candidate Audit Tally</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-semibold pb-3">
                    <th className="pb-3">Candidate</th>
                    <th className="pb-3">Affiliation</th>
                    <th className="pb-3 text-right">Raw Vote Count</th>
                    <th className="pb-3 text-right">Percentage Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {candidates.map((candidate, idx) => {
                    const pct = votedCount > 0 ? Math.round((candidate.voteCount / votedCount) * 100) : 0;
                    return (
                      <tr key={candidate.id} className="text-primary hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 font-bold flex items-center gap-3">
                          <span 
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          />
                          {candidate.name}
                        </td>
                        <td className="py-4 text-neutralDark">{candidate.party}</td>
                        <td className="py-4 text-right font-mono font-bold">{candidate.voteCount}</td>
                        <td className="py-4 text-right font-mono font-bold">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </section>
  );
};
