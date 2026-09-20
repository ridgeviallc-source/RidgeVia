// Synthetic demonstration data for the console. The UI labels all of it as sample data.
// Copy is deliberately terse: the charts carry the meaning.

export const INTRO = {
  triage: 'Pick a message.',
  patients: 'One patient. The full picture.',
  analytics: 'Your practice, as signals.',
  onboarding: 'Everyone moving. Nobody chasing.',
}

export const TILES = [
  { label: 'Blood pressure', value: '138/86', note: 'Up 6 weeks', series: [126, 128, 131, 130, 134, 138], alert: true },
  { label: 'A1C', value: '7.1', note: 'Was 6.8', series: [6.6, 6.8, 6.8, 7.1], alert: true },
  { label: 'Refills due', value: '2', note: 'This week', series: [0, 0, 1, 1, 2, 2] },
]

export const BP = { values: [126, 128, 131, 130, 134, 138], labels: ['Aug 8', '', '', '', '', 'Today'], band: [110, 130] }

export const ASK = [
  { q: 'What changed?', answer: 'Blood pressure is up for six weeks. Two refills are due.', sources: 'readings, refills' },
  { q: 'Anything overdue?', answer: 'Eye exam, four months.', sources: 'care plan' },
  { q: 'Prep Thursday', answer: 'Summary drafted. Ready for your review.', sources: 'chart, labs, messages' },
]

export const NEW_PATIENTS = { values: [6, 8, 7, 9, 11, 14], labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] }
export const REPLY = { values: [125, 118, 110, 104, 96, 88, 80, 72], labels: ['Jul 25', '', '', '', '', '', '', 'Today'] }
export const SOURCES = [
  ['Employer group', 46],
  ['Patient referrals', 31],
  ['Search', 15],
  ['Other', 8],
]

export const ONBOARDING = {
  'New patient': [
    { name: 'Intake form', status: 'done' },
    { name: 'Prior records', status: 'done' },
    { name: 'Membership agreement', status: 'waiting', label: 'Waiting on patient' },
    { name: 'Welcome message', status: 'approve' },
    { name: 'First visit', status: 'done', label: 'Monday' },
  ],
  'New staff member': [
    { name: 'Accounts and access', status: 'done' },
    { name: 'Protocol walkthrough', status: 'progress', label: 'In progress' },
    { name: 'Shadow schedule', status: 'done' },
    { name: 'Clinician sign-off', status: 'waiting', label: 'Waiting on lead' },
  ],
}
