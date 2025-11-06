// Schedule conflict detection utilities

module.exports = {
  // events: [{ start: Date|string, end: Date|string, venue, participants }]
  detectConflicts(events) {
    // Placeholder: naive O(n^2) check
    const conflicts = [];
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const aStart = new Date(events[i].start);
        const aEnd = new Date(events[i].end);
        const bStart = new Date(events[j].start);
        const bEnd = new Date(events[j].end);
        if (aStart < bEnd && bStart < aEnd) {
          conflicts.push([events[i], events[j]]);
        }
      }
    }
    return conflicts;
  }
};
