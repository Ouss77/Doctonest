"use client"
import TabUsers from "./_components/TabUsers"
import TabMissions from "./_components/TabMissions"
import TabDocuments from "./_components/TabDocuments"
import TabAnalytics from "./_components/TabAnalytics"
import { useState, useEffect } from "react"
import { Users, FileText, CheckCircle, BarChart3 } from "lucide-react"
import Sidebar from "./_components/Sidebar"
import Header from "./_components/Header"
import StatsCards from "./_components/StatsCards"


export default function AdminDashboard() {
  type User = {
    id: number;
    name: string;
    email: string;
    type: string;
    specialty?: string;
    location: string;
    created_at?: string;
    status: string;
    documents: string[];
  };
  type Mission = {
    id: number;
    title: string;
    employer: string;
    location: string;
    dates: string;
    salary: string;
    status: string;
    applicants: number;
    publishedDate: string;
  };
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("users")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Mock data
  const stats = {
    totalUsers: 1247,
    pendingValidations: 23,
    activeMissions: 156,
    completedMissions: 892,
    totalRevenue: 125000,
  }

  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [allEmployers, setAllEmployers] = useState<any[]>([]);
  const [userTypeFilter, setUserTypeFilter] = useState<'doctor' | 'employer'>('doctor');
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  // --- NEW: missions state fetched from API (replace static data) ---
  const [missions, setMissions] = useState<Mission[]>([]);
  const [missionsLoading, setMissionsLoading] = useState<boolean>(true);
  const [missionsError, setMissionsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("Erreur lors du chargement des utilisateurs");
        const data = await res.json();
        console.log("Fetched users data:", data);
        // Doctors
        const doctors = (data.doctors || []).map((u: any) => ({
          id: u.id,
          name: (u.first_name ? u.first_name : "") + (u.last_name ? " " + u.last_name : ""),
          email: u.email,
          type: "Médecin remplaçant",
          specialty: u.specialty || undefined,
          location: u.location || "",
          created_at: u.created_at ? new Date(u.created_at).toLocaleDateString() : "",
          status: u.profile_status || u.rp_status || "pending",
          documents: [],
        }));
        setAllDoctors(doctors);
        // Employers
        const employers = (data.employers || []).map((u: any) => ({
          id: u.id,
          name: u.organization_name || (u.first_name ? u.first_name : "") + (u.last_name ? " " + u.last_name : ""),
          email: u.email,
          type: "Établissement",
          specialty: undefined,
          location: u.address || u.city || "",
          created_at: u.created_at ? new Date(u.created_at).toLocaleDateString() : "",
          status: u.profile_status || u.ep_status || "pending",
          documents: [],
        }));
        setAllEmployers(employers);
      } catch (err: any) {
        setUsersError(err.message || "Erreur inconnue");
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMissions = async () => {
      setMissionsLoading(true);
      setMissionsError(null);
      try {
        const res = await fetch("/api/missions");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        // Expecting data.missions array; map defensively to Mission type
        const mapped: Mission[] = (data.missions || []).map((m: any) => ({
          id: typeof m.id === "number" ? m.id : Number(m.id),
          title: m.title || m.name || "Sans titre",
          employer: m.employer || m.organization_name || m.posted_by || "",
          location: m.location || m.city || "",
          dates: m.dates || (m.start_date && m.end_date ? `${m.start_date} → ${m.end_date}` : ""),
          salary: m.salary || m.rate || (m.daily_rate ? `${m.daily_rate}€/j` : ""),
          status: m.status || "pending",
          applicants: m.applicants_count ?? m.applicants ?? 0,
          publishedDate: m.published_at || m.created_at || "",
        }));
        setMissions(mapped);
      } catch (err: any) {
        console.error("Error fetching missions:", err);
        setMissionsError(err.message || "Erreur lors du chargement des missions");
        setMissions([]);
      } finally {
        setMissionsLoading(false);
      }
    };
    fetchMissions();
  }, []);

  const handleValidateUser = (userId: number, action: string) => {
    console.log(`${action} user ${userId}`)
  }

  // Replace the mock handler with a real API call that TabMissions can await
  const handleValidateMission = async (missionId: number, action: string) => {
    // action expected: 'approve' | 'reject'
    try {
      const res = await fetch(`/api/missions/${missionId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || `Erreur lors de la mise à jour du statut (${action})`);
      }
      // Update local state to reflect change (map action -> display status)
      setMissions(prev =>
        prev.map(m => (m.id === missionId ? { ...m, status: action === 'approve' ? 'active' : 'cancelled' } : m))
      );
      return Promise.resolve();
    } catch (err: any) {
      console.error("handleValidateMission error:", err);
      return Promise.reject(err);
    }
  }

  const sidebarItems = [
    { id: "users", label: "Utilisateurs", icon: Users, badge: null },
    { id: "missions", label: "Missions", icon: FileText, badge: null },
    { id: "documents", label: "Documents", icon: CheckCircle, badge: null },
    { id: "analytics", label: "Analyses", icon: BarChart3, badge: null },
  ];

  const renderContent = () => {
    if (activeTab === "users") {
      if (usersLoading) return <div className="p-8 text-center text-blue-600">Chargement des utilisateurs...</div>;
      if (usersError) return <div className="p-8 text-center text-red-600">{usersError}</div>;
      // Filtered users
      const filteredUsers = userTypeFilter === 'doctor' ? allDoctors : allEmployers;
      return (
        <>
          <div className="mb-4 flex gap-2">
            <button
              className={`px-4 py-2 rounded-xl border ${userTypeFilter === 'doctor' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'}`}
              onClick={() => setUserTypeFilter('doctor')}
            >
              Médecins remplaçants
            </button>
            <button
              className={`px-4 py-2 rounded-xl border ${userTypeFilter === 'employer' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'}`}
              onClick={() => setUserTypeFilter('employer')}
            >
              Établissements
            </button>
          </div>
          <TabUsers
            pendingUsers={filteredUsers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            setSelectedUser={setSelectedUser}
            handleValidateUser={handleValidateUser}
          />
        </>
      );
    }
    if (activeTab === "missions") {
      if (missionsLoading) return <div className="p-8 text-center text-blue-600">Chargement des missions...</div>;
      if (missionsError) return <div className="p-8 text-center text-red-600">{missionsError}</div>;
      return (
        <TabMissions
          missions={missions}
          setSelectedMission={setSelectedMission}
          handleValidateMission={handleValidateMission}
        />
      )
    }
    if (activeTab === "documents") {
      return <TabDocuments />
    }
    if (activeTab === "analytics") {
      return <TabAnalytics />
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 font-['Nunito', 'Segoe UI', 'Arial', 'sans-serif'] text-[16px] md:text-[17px]">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarItems={sidebarItems}
        />
        {/* Main Content */}
        <div className={`flex-1 min-h-screen ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
          <Header activeTab={activeTab} sidebarItems={sidebarItems} />
          <StatsCards stats={stats} show={activeTab === 'users' || activeTab === 'missions'} />
          <div className="px-6 py-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
