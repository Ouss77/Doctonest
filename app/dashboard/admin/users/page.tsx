"use client"

import { useState } from "react"
import TabUsers from "../_components/TabUsers"
import { useAdminUsersData } from "../hooks/useAdminUsersData"

export default function AdminUsersPage() {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const { users, userTypeFilter, setUserTypeFilter, loading, error } =
    useAdminUsersData()

  const handleValidateUser = (userId: number, action: string) => {
    console.log(`${action} user ${userId}`)
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Chargement des utilisateurs...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }

  return (
    <>
      <div className="mb-6 inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
        <button
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            userTypeFilter === "doctor"
              ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
          onClick={() => setUserTypeFilter("doctor")}
        >
          Médecins remplaçants
        </button>
        <button
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            userTypeFilter === "employer"
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
          onClick={() => setUserTypeFilter("employer")}
        >
          Établissements
        </button>
      </div>

      <TabUsers
        pendingUsers={users}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        setSelectedUser={setSelectedUser}
        handleValidateUser={handleValidateUser}
      />
    </>
  )
}
