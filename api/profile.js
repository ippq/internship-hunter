const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const profilePath = path.join(process.cwd(), 'my-materials', 'candidate_profile.json');

  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(profilePath, 'utf-8');
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(404).json({ error: 'Profile not found' });
    }
  } else if (req.method === 'POST') {
    try {
      fs.writeFileSync(profilePath, JSON.stringify(req.body, null, 2), 'utf-8');
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};
