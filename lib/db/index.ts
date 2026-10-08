import { sql } from "./client"
import { createUser, getUserByEmail, getUserById } from "./users"
import {
  getReplacementDoctors,
  getApprovedReplacementDoctors,
  createReplacementProfile,
  getReplacementProfile,
} from "./replacements"
import { getEmployers, createEmployerProfile, getEmployerProfile } from "./employers"
import { createApplication, getApplications } from "./applications"
import {
  createExperience,
  updateExperience,
  deleteExperience,
  getExperiences,
} from "./experiences"
import {
  getDiplomasByUser,
  createDiploma,
  deleteDiploma,
  updateDiploma,
} from "./diplomas"
import { getDocumentsByUser } from "./documents"
import {
  listMissions,
  createMission,
  getPublicMissionById,
  getMissionByEditToken,
  updateMissionByEditToken,
  deleteMissionByEditToken,
} from "./missions"
import { savePasswordResetToken } from "./password-resets"
import { updateProfilePhoto } from "./profiles"

export { sql }

export const db = {
  sql,
  savePasswordResetToken,
  getEmployers,
  getReplacementDoctors,
  getApprovedReplacementDoctors,
  createUser,
  getUserByEmail,
  getUserById,
  createReplacementProfile,
  getReplacementProfile,
  createEmployerProfile,
  getEmployerProfile,
  createApplication,
  getApplications,
  createExperience,
  updateExperience,
  deleteExperience,
  getExperiences,
  getDiplomasByUser,
  createDiploma,
  deleteDiploma,
  updateDiploma,
  updateProfilePhoto,
  getDocumentsByUser,
  listMissions,
  createMission,
  getPublicMissionById,
  getMissionByEditToken,
  updateMissionByEditToken,
  deleteMissionByEditToken,
}
