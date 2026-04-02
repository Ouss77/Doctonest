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
    return <div className="p-8 text-center text-blue-600">Chargement des utilisateurs...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }

  return (
    <>
      <div className="mb-4 flex gap-2">
        <button
          className={`px-4 py-2 rounded-xl border ${
            userTypeFilter === "doctor"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border-blue-600"
          }`}
          onClick={() => setUserTypeFilter("doctor")}
        >
          Médecins remplaçants
        </button>
        <button
          className={`px-4 py-2 rounded-xl border ${
            userTypeFilter === "employer"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border-blue-600"
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
