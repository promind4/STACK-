import type { AtelierProfile, AtelierRequirement, AtelierRole } from './types.ts'

export function buildRequirements(profile: AtelierProfile): AtelierRequirement[] {
  const requirements: AtelierRequirement[] = []
  const sourceCount = (profile.sourceCount ?? 1) === 2 ? 2 : 1
  const mobile = profile.mobility === 'mobile'
  const owned = (role: AtelierRole) => profile.ownedEquipment.filter(item => item.role === role).length
  const add = (role: AtelierRole, quantity: number, constraints: string[]) => {
    const remaining = quantity - owned(role)
    if (remaining > 0) requirements.push({ role, quantity: remaining, required: true, constraints })
  }
  const microphoneConstraints = [profile.project, profile.room === 'travel' ? 'travel' : `${profile.room} room`]

  if (mobile) microphoneConstraints.push('mobile')
  if (profile.project === 'streaming' && profile.room === 'untreated') microphoneConstraints.push('noise rejection')

  add('microphone', sourceCount, microphoneConstraints)

  // ponytail: Duo capture keeps a shared interface until multi-USB synchronization is modeled.
  const needsInterface = (profile.sourceCount ?? 1) !== 1
    || profile.ownedEquipment.some(item => item.role === 'microphone' && item.connection === 'xlr')
  if (needsInterface) {
    const interfaceConstraints = [`at least ${sourceCount} input${sourceCount === 1 ? '' : 's'}`]
    if (profile.ownedEquipment.some(item => item.role === 'microphone' && item.connection === 'xlr')) interfaceConstraints.push('XLR microphone')
    if (mobile) interfaceConstraints.push('mobile')
    add('interface', 1, interfaceConstraints)
  }

  add('headphones', sourceCount, mobile ? ['monitoring', 'mobile'] : ['monitoring'])

  if (profile.project === 'streaming' || profile.project === 'video') {
    add('camera', 1, mobile ? [profile.project, 'mobile'] : [profile.project])
    add('lighting', 1, mobile ? [profile.project, 'mobile'] : [profile.project])
  }

  if (!mobile && profile.project === 'streaming' && profile.room === 'untreated') add('treatment', 1, ['room noise control'])
  if (!mobile && profile.project === 'music_vocals' && profile.room === 'untreated') add('treatment', 1, ['vocal detail in untreated room'])
  if (!mobile && profile.project === 'music_vocals' && profile.room === 'treated') add('monitors', 2, ['treated room'])

  return requirements
}
