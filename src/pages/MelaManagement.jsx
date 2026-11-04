import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Filter,
  ListTodo,
  Shield,
  Users,
  Compass,
  X,
  ChevronRight,
  TrendingUp,
  MapPin,
  Building,
  Check
} from 'lucide-react';
import { useTempleOperations } from '../context/TempleOperationsContext';
import OperationsPageHeader from '../components/temple-operations/shared/OperationsPageHeader';
import OperationsMetricCard from '../components/temple-operations/shared/OperationsMetricCard';
import OperationsTabs from '../components/temple-operations/shared/OperationsTabs';

export default function MelaManagement({ isEmbedded = false, initialTab = 'overview' }) {
  const {
    melaEvents,
    melaTasks,
    addMelaTask,
    updateMelaTaskStatus,
    readinessChecklist,
    toggleChecklistItem,
  } = useTempleOperations();

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [planSubView, setPlanSubView] = useState('tasks');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  // New task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    category: 'Crowd Management',
    priority: 'High',
    assignedTeam: 'PWD Infrastructure',
    assignedPerson: '',
    dueDate: '08 Nov 2026',
    notes: '',
  });

  const featuredMela = melaEvents[0]; // Diwali Mela 2026

  // Metrics
  const completedTasksCount = useMemo(
    () => melaTasks.filter((t) => t.status === 'Completed').length,
    [melaTasks]
  );
  const taskCompletionRate = Math.round((completedTasksCount / melaTasks.length) * 100);

  const completedChecklistCount = useMemo(
    () => readinessChecklist.filter((c) => c.status === 'Completed').length,
    [readinessChecklist]
  );
  const checklistScore = Math.round((completedChecklistCount / readinessChecklist.length) * 100);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return melaTasks.filter((t) => {
      const matchCat = selectedCategory === 'ALL' || t.category === selectedCategory;
      const matchStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
      return matchCat && matchStatus;
    });
  }, [melaTasks, selectedCategory, selectedStatus]);

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskForm.title) return;
    addMelaTask({
      ...taskForm,
      melaId: featuredMela.id,
      status: 'In Progress',
    });
    setTaskForm({
      title: '',
      category: 'Crowd Management',
      priority: 'High',
      assignedTeam: 'PWD Infrastructure',
      assignedPerson: '',
      dueDate: '08 Nov 2026',
      notes: '',
    });
    setIsAddTaskModalOpen(false);
  };

  const tabs = [
    { id: 'overview', label: 'Diwali Mela 2026 Command', count: `${checklistScore}% Ready` },
    { id: 'planning', label: 'Planning & Annual Festivals', count: melaTasks.length },
    { id: 'safety', label: 'Disaster & Multi-Agency Plan' },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Header (Hidden when embedded) */}
      {!isEmbedded && (
        <OperationsPageHeader
          title="Mela & Festival Management"
          primaryActionLabel="Add Planning Task"
          onPrimaryAction={() => setIsAddTaskModalOpen(true)}
          primaryActionIcon={Plus}
        />
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <OperationsMetricCard
          label="Next Major Festival"
          value="Diwali Mela"
          subtext="10 – 12 Nov 2026 (Tentative)"
          icon={Sparkles}
        />
        <OperationsMetricCard
          label="Readiness Audit Score"
          value={`${checklistScore}%`}
          subtext={`${completedChecklistCount} of ${readinessChecklist.length} protocols verified`}
          icon={TrendingUp}
        />
        <OperationsMetricCard
          label="Operational Action Items"
          value={`${completedTasksCount} / ${melaTasks.length}`}
          subtext={`${taskCompletionRate}% tasks delivered`}
          icon={ListTodo}
        />
        <OperationsMetricCard
          label="Projected Peak Footfall"
          value="1,50,000"
          subtext="Estimated over 3-day festivity"
          icon={Users}
        />
      </div>

      {/* Navigation Tabs */}
      <OperationsTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      {/* TAB 1: OVERVIEW & READINESS */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-[#55132D] via-[#3D0A1E] to-[#1A0610] border border-[#B68A36]/40 rounded-xl text-white p-5 shadow-sm relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-[#E2BC6B] font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#E2BC6B]" />
                Special Festival Readiness Portal
              </div>
              <h3 className="text-xl font-bold font-serif mb-2">{featuredMela.name}</h3>
              <p className="text-xs text-stone-200 leading-relaxed mb-4">
                {featuredMela.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-black/30 backdrop-blur-xs p-2.5 rounded-lg border border-white/10">
                  <span className="text-stone-300 block text-[10px]">Festival Span:</span>
                  <span className="font-semibold">{featuredMela.startDate} - {featuredMela.endDate}</span>
                </div>
                <div className="bg-black/30 backdrop-blur-xs p-2.5 rounded-lg border border-white/10">
                  <span className="text-stone-300 block text-[10px]">Command Officer:</span>
                  <span className="font-semibold truncate block">{featuredMela.assignedCoordinator}</span>
                </div>
                <div className="bg-black/30 backdrop-blur-xs p-2.5 rounded-lg border border-white/10">
                  <span className="text-stone-300 block text-[10px]">Expected Peak:</span>
                  <span className="font-semibold">50,000 / day</span>
                </div>
              </div>
            </div>
          </div>

          {/* Readiness Checklist Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold text-stone-800">Festival Readiness Protocols</h4>
                  <p className="text-xs text-stone-500">
                    Click any item checkbox to toggle completion status.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#55132D] bg-[#55132D]/10 px-2.5 py-1 rounded-full">
                  {completedChecklistCount} / {readinessChecklist.length} Complete
                </span>
              </div>

              <div className="space-y-2">
                {readinessChecklist.map((item, index) => {
                  const isDone = item.status === 'Completed';
                  return (
                    <div
                      key={index}
                      onClick={() => toggleChecklistItem(index)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                        isDone
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                            isDone ? 'bg-emerald-600 text-white' : 'border border-stone-400 bg-white'
                          }`}
                        >
                          {isDone && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <p className={`text-xs font-medium ${isDone ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                            {item.item}
                          </p>
                          <p className="text-[10px] text-stone-500">
                            Responsible Agency: {item.owner} • Target: {item.targetDate}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Contacts */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-stone-800 mb-1">Inter-Agency Coordination Desk</h4>
                <p className="text-xs text-stone-500 mb-3">
                  Designated nodal officers for the upcoming celebration.
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-150">
                    <p className="font-semibold text-stone-800">Tripura Police (Udaipur Sub-Division)</p>
                    <p className="text-[11px] text-stone-500">Traffic & Law Enforcement Liaison</p>
                    <p className="font-mono text-[10px] text-[#55132D] mt-0.5">Control: 03821-222222</p>
                  </div>

                  <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-150">
                    <p className="font-semibold text-stone-800">State Disaster Management / NDRF</p>
                    <p className="text-[11px] text-stone-500">Kalyan Sagar Water Safety & Medical Aid</p>
                    <p className="font-mono text-[10px] text-[#55132D] mt-0.5">Hotline: 1077 (Toll-Free)</p>
                  </div>

                  <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-150">
                    <p className="font-semibold text-stone-800">Matabari Priest & Seva Samiti</p>
                    <p className="text-[11px] text-stone-500">Continuous 24h Aarti & Bhog Timings</p>
                    <p className="font-mono text-[10px] text-[#55132D] mt-0.5">Desk Ext: 104</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setActiveTab('planning'); setPlanSubView('tasks'); }}
                className="w-full mt-4 py-2 bg-stone-100 hover:bg-[#55132D] hover:text-white text-stone-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                View All {melaTasks.length} Action Tasks
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PLANNING & ANNUAL FESTIVALS (Segmented Sub-switch) */}
      {activeTab === 'planning' && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg w-fit border border-stone-200">
            <button
              onClick={() => setPlanSubView('tasks')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                planSubView === 'tasks'
                  ? 'bg-white text-[#55132D] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Planning Action Tasks ({melaTasks.length})
            </button>
            <button
              onClick={() => setPlanSubView('festivals')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                planSubView === 'festivals'
                  ? 'bg-white text-[#55132D] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Annual Utsav Calendar ({melaEvents.length})
            </button>
          </div>

          {planSubView === 'tasks' && (
            <div className="space-y-4">
          {/* Controls */}
          <div className="bg-white rounded-xl border border-stone-200 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 focus:outline-none focus:border-[#55132D]"
              >
                <option value="ALL">All Categories</option>
                <option value="Crowd Management">Crowd Management</option>
                <option value="Security & Safety">Security & Safety</option>
                <option value="Volunteer Allocation">Volunteer Allocation</option>
                <option value="Vendor Coordination">Vendor Coordination</option>
                <option value="Parking Arrangements">Parking Arrangements</option>
                <option value="Public Announcements">Public Announcements</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-stone-50 focus:outline-none focus:border-[#55132D]"
              >
                <option value="ALL">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Under Review">Under Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="px-3 py-1.5 bg-[#55132D] hover:bg-[#681B37] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Task
            </button>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredTasks.map((task) => {
              const isCompleted = task.status === 'Completed';
              return (
                <div
                  key={task.id}
                  className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between hover:border-[#55132D]/40 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                          {task.id}
                        </span>
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                            task.priority === 'Urgent'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : task.priority === 'High'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : task.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-stone-800 mb-1">{task.title}</h4>
                    <p className="text-xs text-stone-600 mb-3">{task.notes}</p>

                    <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-150 space-y-1 text-[11px] text-stone-600 mb-3">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Department / Team:</span>
                        <span className="font-medium text-stone-800">{task.assignedTeam}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Officer in-charge:</span>
                        <span className="font-semibold text-stone-900">{task.assignedPerson}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Target Due Date:</span>
                        <span className="font-mono text-stone-800">{task.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-150 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-stone-400 font-medium">Domain: {task.category}</span>
                    <div className="flex items-center gap-1.5">
                      {!isCompleted ? (
                        <>
                          <button
                            onClick={() => updateMelaTaskStatus(task.id, 'In Progress')}
                            className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-semibold rounded"
                          >
                            Set In Progress
                          </button>
                          <button
                            onClick={() => updateMelaTaskStatus(task.id, 'Completed')}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold rounded"
                          >
                            Mark Completed
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => updateMelaTaskStatus(task.id, 'In Progress')}
                          className="text-[10px] text-stone-500 hover:underline"
                        >
                          Reopen Task
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

          {planSubView === 'festivals' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {melaEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                    {evt.id}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      evt.status === 'In Preparation'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-stone-800 mb-1">{evt.name}</h4>
                <p className="text-xs text-stone-500 mb-3 leading-relaxed">{evt.description}</p>

                <div className="bg-stone-50 p-3 rounded-lg border border-stone-150 space-y-1.5 text-xs text-stone-600 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#55132D]" />
                    <span className="font-medium">{evt.startDate} - {evt.endDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <span>Peak: {evt.expectedCrowdPeak}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-150">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-stone-500">Readiness:</span>
                  <span className="font-bold text-stone-900 font-mono">{evt.readinessScore}%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#55132D] rounded-full"
                    style={{ width: `${evt.readinessScore}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
        </div>
      )}

      {/* TAB 4: DISASTER & MULTI-AGENCY SAFETY */}
      {activeTab === 'safety' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-stone-800">Comprehensive Disaster & Mass Gathering Safety Annexure</h3>
            <p className="text-xs text-stone-500">
              Approved standard operating procedures in conjunction with National Disaster Response Force and Gomati District Administration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <h4 className="font-bold text-stone-800 flex items-center gap-1.5 text-xs">
                <Shield className="w-4 h-4 text-[#55132D]" /> Water Body & Lake Precaution
              </h4>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Kalyan Sagar lake edge is demarcated with 1.2m wire rope safety mesh. Two motor dinghies staffed with certified rescue swimmers stationed round-the-clock during Diwali lighting.
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <h4 className="font-bold text-stone-800 flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Stampede Mitigation & Anti-Crush Queuing
              </h4>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Z-shaped zigzag queue corridors deployed at East Gate Plaza. Flow regulated at max 80 devotees per minute through Torana arches to prevent sanctum corridor overcrowding.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD TASK */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Add Mela Preparation Task</h3>
                <p className="text-xs text-stone-500">Assign responsibility to coordinating department.</p>
              </div>
              <button
                onClick={() => setIsAddTaskModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Task Description / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Erect temporary medical first aid tent near West Gate"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={taskForm.category}
                    onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  >
                    <option value="Crowd Management">Crowd Management</option>
                    <option value="Security & Safety">Security & Safety</option>
                    <option value="Volunteer Allocation">Volunteer Allocation</option>
                    <option value="Vendor Coordination">Vendor Coordination</option>
                    <option value="Parking Arrangements">Parking Arrangements</option>
                    <option value="Public Announcements">Public Announcements</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Assigned Department / Team</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PHED Water Works"
                    value={taskForm.assignedTeam}
                    onChange={(e) => setTaskForm({ ...taskForm, assignedTeam: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Responsible Officer</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Officer P. Roy"
                    value={taskForm.assignedPerson}
                    onChange={(e) => setTaskForm({ ...taskForm, assignedPerson: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Operational Directives & Notes</label>
                <textarea
                  rows={2}
                  placeholder="Material specs, inspection checkpoints..."
                  value={taskForm.notes}
                  onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 focus:outline-none focus:border-[#55132D]"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-3 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#55132D] hover:bg-[#681B37] text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

