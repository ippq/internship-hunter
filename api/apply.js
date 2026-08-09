const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { company, role, applyUrl } = req.body;
    const profilePath = path.join(process.cwd(), 'my-materials', 'candidate_profile.json');
    let profileLoaded = true;
    try { fs.readFileSync(profilePath); } catch (e) { profileLoaded = false; }

    res.json({
      prompt: `Apply to ${company} - ${role} at ${applyUrl}. Use my candidate profile to fill the application form via Playwright. PREVIEW everything before clicking submit.`,
      ready: profileLoaded,
      warnings: profileLoaded ? [] : ['Candidate profile is empty. Fill it in Settings first.'],
      steps: [
        `Open ${applyUrl} with Playwright browser_navigate`,
        'Read my-materials/candidate_profile.json for personal info',
        'Upload my-materials/resume.pdf if file input exists',
        'Read my-materials/experience_bank.md for project details',
        'Read my-materials/answer_bank.md for standard answers',
        'Fill the form — never guess, ask me if unclear',
        'Take a screenshot and show me ALL fields before submitting',
        'Wait for my YES before clicking Submit'
      ]
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
