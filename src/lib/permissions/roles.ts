import type { EngineRole } from '../../types/database'

export type EngineAction =
  | 'website.read'
  | 'website.create'
  | 'website.update'
  | 'website.publish'
  | 'website.archive'
  | 'domain.manage'
  | 'qa.review'
  | 'client.message'

const rolePermissions: Record<EngineRole, EngineAction[]> = {
  super_admin: ['website.read', 'website.create', 'website.update', 'website.publish', 'website.archive', 'domain.manage', 'qa.review', 'client.message'],
  admin: ['website.read', 'website.create', 'website.update', 'website.publish', 'website.archive', 'domain.manage', 'qa.review', 'client.message'],
  project_manager: ['website.read', 'website.create', 'website.update', 'website.publish', 'qa.review', 'client.message'],
  content_editor: ['website.read', 'website.update', 'client.message'],
  designer: ['website.read', 'website.update'],
  qa_reviewer: ['website.read', 'qa.review'],
  domain_specialist: ['website.read', 'domain.manage'],
  support_agent: ['website.read', 'client.message'],
  client: ['website.read', 'client.message'],
}

export function canPerformEngineAction(role: EngineRole, action: EngineAction) {
  return rolePermissions[role].includes(action)
}
