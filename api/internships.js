const { getCachedData } = require('./_notion');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const allData = await getCachedData();
    const { region, industry, year, status, search, sort, page: p, pageSize } = req.query;

    let data = [...allData];
    if (region) data = data.filter(e => e.region === region);
    if (industry && industry !== 'All') data = data.filter(e => e.industry.includes(industry));
    if (year && year !== 'All') data = data.filter(e => e.year === year);
    if (status && status !== 'All') data = data.filter(e => e.jobStatus === status);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(e => e.company.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.city.toLowerCase().includes(q) || e.country.toLowerCase().includes(q));
    }

    if (sort === 'deadline') {
      data.sort((a, b) => { if (!a.deadline && !b.deadline) return 0; if (!a.deadline) return 1; if (!b.deadline) return -1; return a.deadline.localeCompare(b.deadline); });
    } else if (sort === 'newest') {
      data.sort((a, b) => b.createdTime.localeCompare(a.createdTime));
    } else if (sort === 'company') {
      data.sort((a, b) => a.company.localeCompare(b.company));
    }

    const ps = parseInt(pageSize) || 50;
    const pageNum = parseInt(p) || 1;
    const start = (pageNum - 1) * ps;
    const paged = data.slice(start, start + ps);

    res.json({ total: data.length, page: pageNum, pageSize: ps, results: paged });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
