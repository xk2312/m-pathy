// lib/types.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Single Source of Truth – MEFL conform

export type Role = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  chat_serial: number
  msg_number: number
  role: Role
  content: string
  timestamp: string // ISO-8601
  truth_hash?: string
  verified?: boolean
}

export interface ArchiveEntry {
  id: string
  origin_chat: number
  role: Role
  content: string
  timestamp: string
  truth_hash: string
  public_key: string
  verified: boolean
}

export interface ArchiveSelection {
  id: string
  type: 'message' | 'chat'
  selected: boolean
  source_chat?: number
  timestamp: string
}

export interface ContextUpload {
  id: string
  role: Role
  content: string
  timestamp: string
  verified: boolean
}

export interface VerificationItem {
  msg_number: number
  truth_hash: string
}

export interface VerificationReport {
  protocol_version: string
  generated_at: string
  chat_meta: {
    chat_id: string
    chat_serial: number
    message_total: number
  }
  verification_chain: VerificationItem[]
  chain_signature: string
  public_key: string
  verified_true: number
  verified_false: number
}

// central export block
export type {
  ChatMessage as TChatMessage,
  ArchiveEntry as TArchiveEntry,
  ArchiveSelection as TArchiveSelection,
  ContextUpload as TContextUpload,
  VerificationReport as TVerificationReport,
}
