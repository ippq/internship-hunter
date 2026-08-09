const { getCachedData } = require('./_notion');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const data = await getCachedData();
    const stats = { total: data.length, byRegion: {}, byIndustry: {}, byYear: {}, byStatus: {} };
    for (const e of data) {
      stats.byRegion[e.region] = (stats.byRegion[e.region] || 0) + 1;
      for (const ind of e.industry) stats.byIndustry[ind] = (stats.byIndustry[ind] || 0) + 1;
      stats.byYear[e.year] = (stats.byYear[e.year] || 0) + 1;
      stats.byStatus[e.jobStatus] = (stats.byStatus[e.jobStatus] || 0) + 1;
    }
    res.json(stats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
