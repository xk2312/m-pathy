import type { ChatMessage as ChatMessageV1 } from '@/lib/chatStorage'
import type { ChatMessage as ChatMessageV2 } from '@/lib/types'

export function mapChatV1ToV2(
  messages: ChatMessageV1[],
  chatSerial = 1
): ChatMessageV2[] {
  let msgNumber = 0

  return messages.map((m) => ({
    id: m.id,
    chat_serial: chatSerial,
    msg_number: ++msgNumber,
    role: m.role,
    content: m.content,
    timestamp: new Date(m.ts ?? Date.now()).toISOString(),
    truth_hash: m.triketon?.truth_hash,
    verified: Boolean(m.triketon?.truth_hash),
  }))
}
