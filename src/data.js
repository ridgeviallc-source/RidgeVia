// Synthetic demo messages. Not real patient data; the UI labels them as samples.
export const MESSAGES = [
  {
    id: 'chest',
    title: 'Chest tightness since this morning',
    time: '8:42 AM',
    body: "Chest tightness since this morning. I took ibuprofen and it hasn't helped.",
    intent: 'Symptom report',
    urgent: true,
    facts: 'Started this morning. Ibuprofen taken, no relief.',
    routedTo: 'Clinician on duty',
    draft:
      'Thanks for letting us know. Your care team is reviewing this now and will call you shortly. If it gets worse or you feel faint, call 911.',
    note: 'Reports chest tightness since this morning, no relief with ibuprofen. Red-flag rule matched.',
  },
  {
    id: 'refill',
    title: 'Can my refill go to a different pharmacy?',
    time: '8:31 AM',
    body: 'Can my refill go to a different pharmacy this month? I am traveling.',
    intent: 'Refill request',
    urgent: false,
    facts: 'Wants the refill sent to a different pharmacy. Pharmacy not named.',
    routedTo: 'Front desk',
    draft:
      'Happy to help. Which pharmacy would you like us to use? Send the name and location, and we will update it before the refill goes to your clinician for review.',
    note: 'Patient requests a pharmacy change for a refill. Pharmacy to be confirmed.',
  },
  {
    id: 'labs',
    title: 'Question about my lab results',
    time: '8:12 AM',
    body: 'I saw my lab results posted. Is the cholesterol number something I should worry about?',
    intent: 'Lab question',
    urgent: false,
    facts: 'Asks whether a cholesterol result needs action.',
    routedTo: 'Clinician',
    draft:
      'Thanks for asking. Your clinician will review your results and reply with what they mean for you. If you have new symptoms, please call the office.',
    note: 'Patient asks about a cholesterol result. Awaiting clinician review.',
  },
  {
    id: 'visit',
    title: "Need to move Thursday's visit",
    time: '7:58 AM',
    body: "Something came up. Can I move Thursday's visit to later in the week?",
    intent: 'Scheduling',
    urgent: false,
    facts: "Wants to reschedule Thursday's visit to later in the week.",
    routedTo: 'Front desk',
    draft: 'Of course. Send us two or three times that work for you, and we will move your visit.',
    note: "Reschedule request for Thursday's visit.",
  },
]
