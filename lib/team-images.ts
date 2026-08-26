export const RECOVERED_TEAM_IMAGES = [
  'Amelia Hart',
  'Charlotte Bennett',
  'Daniel Wong',
  'Emily Foster',
  'James Bennett',
  'Jessica Morgan',
  'Jim Okafor',
  'Justin Cork',
  'Mei Lin Chen',
  'Paul Mercer',
  'Sofia Lim',
] as const;

export type RecoveredTeamImage = (typeof RECOVERED_TEAM_IMAGES)[number];

export function buildInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.trim().charAt(0))
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2);
}