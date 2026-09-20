// Synthetic demonstration data for the console. The UI labels all of it as sample data.
// Copy is deliberately terse: the charts and conversations carry the meaning.

export const INTRO = {
  triage: 'Pick a message.',
  clinos: 'Ask anything. Watch it work. Scroll the chat for more.',
  onboarding: 'Everyone moving. Nobody chasing.',
}

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
