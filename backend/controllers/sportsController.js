const asyncHandler = require('express-async-handler');
const SportsEvent = require('../models/SportsEvent');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const AuditLog = require('../models/AuditLog');

/**
 * @desc    Get all sports events
 * @route   GET /api/sports
 * @access  Public
 */
const getSportsEvents = asyncHandler(async (req, res) => {
  const {
    sport,
    tournamentType,
    participationType,
    status,
    page = 1,
    limit = 20,
    sortBy = '-createdAt',
  } = req.query;

  // Build query
  const query = {};

  if (sport) query['sport.name'] = new RegExp(sport, 'i');
  if (tournamentType) query.tournamentType = tournamentType;
  if (participationType) query.participationType = participationType;

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const sportsEvents = await SportsEvent.find(query)
    .populate('eventId', 'title startDate endDate venue eventType status')
    .populate('teams.department', 'name code')
    .populate('teams.captain', 'name email rollNumber')
    .populate('individuals.participantId', 'name email rollNumber')
    .sort(sortBy)
    .limit(parseInt(limit))
    .skip(skip);

  // Get total count
  const total = await SportsEvent.countDocuments(query);

  res.status(200).json({
    success: true,
    count: sportsEvents.length,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    data: sportsEvents,
  });
});

/**
 * @desc    Get single sports event
 * @route   GET /api/sports/:id
 * @access  Public
 */
const getSportsEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const sportsEvent = await SportsEvent.findById(id)
    .populate('eventId')
    .populate('teams.department', 'name code')
    .populate('teams.captain', 'name email rollNumber')
    .populate('teams.players.playerId', 'name email rollNumber')
    .populate('individuals.participantId', 'name email rollNumber')
    .populate('fixtures.venue', 'name location capacity')
    .populate('results.manOfTheMatch', 'name email');

  if (!sportsEvent) {
    res.status(404);
    throw new Error('Sports event not found');
  }

  res.status(200).json({
    success: true,
    data: sportsEvent,
  });
});

/**
 * @desc    Create sports event
 * @route   POST /api/sports
 * @access  Private (Sports Admins)
 */
const createSportsEvent = asyncHandler(async (req, res) => {
  const {
    eventId,
    sport,
    tournamentType,
    participationType,
    teams,
    individuals,
    fixtures,
    officials,
    rules,
    equipment,
    sponsorship,
  } = req.body;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if event is a sports event
  if (event.eventType !== 'Sports') {
    res.status(400);
    throw new Error('Event must be of type Sports');
  }

  // Check if sports event already exists for this event
  const existingSportsEvent = await SportsEvent.findOne({ eventId });
  if (existingSportsEvent) {
    res.status(400);
    throw new Error('Sports event already exists for this event');
  }

  // Create sports event
  const sportsEvent = await SportsEvent.create({
    eventId,
    sport,
    tournamentType,
    participationType: participationType || 'Individual',
    teams: teams || [],
    individuals: individuals || [],
    fixtures: fixtures || [],
    officials: officials || [],
    rules,
    equipment: equipment || [],
    sponsorship: sponsorship || [],
  });

  // Populate sports event
  const populatedSportsEvent = await SportsEvent.findById(sportsEvent._id)
    .populate('eventId', 'title startDate endDate venue')
    .populate('teams.department', 'name code')
    .populate('teams.captain', 'name email');

  // Create audit log
  await AuditLog.create({
    userId: req.user._id,
    action: 'Sports Event Created',
    resource: 'SportsEvent',
    resourceId: sportsEvent._id,
    details: `Sports event created for: ${event.title}`,
  });

  res.status(201).json({
    success: true,
    message: 'Sports event created successfully',
    data: populatedSportsEvent,
  });
});

/**
 * @desc    Update sports event
 * @route   PUT /api/sports/:id
 * @access  Private (Sports Admins)
 */
const updateSportsEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const sportsEvent = await SportsEvent.findById(id);

  if (!sportsEvent) {
    res.status(404);
    throw new Error('Sports event not found');
  }

  // Update fields
  const allowedUpdates = [
    'sport',
    'tournamentType',
    'participationType',
    'teams',
    'individuals',
    'fixtures',
    'results',
    'standings',
    'prizes',
    'officials',
    'rules',
    'equipment',
    'sponsorship',
  ];

  allowedUpdates.forEach((field) => {
    if (updates[field] !== undefined) {
      sportsEvent[field] = updates[field];
    }
  });

  await sportsEvent.save();

  // Populate updated sports event
  const populatedSportsEvent = await SportsEvent.findById(sportsEvent._id)
    .populate('eventId', 'title startDate endDate')
    .populate('teams.department', 'name code')
    .populate('teams.captain', 'name email');

  // Create audit log
  await AuditLog.create({
    userId: req.user._id,
    action: 'Sports Event Updated',
    resource: 'SportsEvent',
    resourceId: sportsEvent._id,
    details: `Sports event updated`,
  });

  res.status(200).json({
    success: true,
    message: 'Sports event updated successfully',
    data: populatedSportsEvent,
  });
});

/**
 * @desc    Delete sports event
 * @route   DELETE /api/sports/:id
 * @access  Private (Sports Admins)
 */
const deleteSportsEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const sportsEvent = await SportsEvent.findById(id).populate('eventId', 'title');

  if (!sportsEvent) {
    res.status(404);
    throw new Error('Sports event not found');
  }

  const eventTitle = sportsEvent.eventId?.title || 'Unknown Event';

  await sportsEvent.deleteOne();

  // Create audit log
  await AuditLog.create({
    userId: req.user._id,
    action: 'Sports Event Deleted',
    resource: 'SportsEvent',
    resourceId: sportsEvent._id,
    details: `Sports event deleted for: ${eventTitle}`,
  });

  res.status(200).json({
    success: true,
    message: 'Sports event deleted successfully',
  });
});

/**
 * @desc    Register for sports event (individual/team)
 * @route   POST /api/sports/:id/register
 * @access  Private (Students)
 */
const registerForSportsEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { registrationType, teamName, players, jerseyNumber, position, category } = req.body;

  const sportsEvent = await SportsEvent.findById(id).populate('eventId');

  if (!sportsEvent) {
    res.status(404);
    throw new Error('Sports event not found');
  }

  // Check if student is already registered for the main event
  const eventRegistration = await Registration.findOne({
    eventId: sportsEvent.eventId._id,
    studentId: req.user._id,
  });

  if (!eventRegistration) {
    res.status(400);
    throw new Error('Please register for the main event first');
  }

  if (eventRegistration.status !== 'Approved') {
    res.status(400);
    throw new Error('Your event registration is not approved yet');
  }

  // Handle team registration
  if (registrationType === 'team') {
    if (!teamName) {
      res.status(400);
      throw new Error('Team name is required for team registration');
    }

    // Check if team already exists
    const existingTeam = sportsEvent.teams.find((t) => t.teamName === teamName);
    if (existingTeam) {
      res.status(400);
      throw new Error('Team name already exists');
    }

    // Add new team
    sportsEvent.teams.push({
      teamName,
      captain: req.user._id,
      players: players || [{ playerId: req.user._id, jerseyNumber, position }],
    });
  }
  // Handle individual registration
  else if (registrationType === 'individual') {
    // Check if already registered as individual
    const existingIndividual = sportsEvent.individuals.find(
      (i) => i.participantId.toString() === req.user._id.toString()
    );

    if (existingIndividual) {
      res.status(400);
      throw new Error('You are already registered as an individual participant');
    }

    // Add individual participant
    sportsEvent.individuals.push({
      participantId: req.user._id,
      category,
    });
  } else {
    res.status(400);
    throw new Error('Invalid registration type. Must be "team" or "individual"');
  }

  await sportsEvent.save();

  // Create audit log
  await AuditLog.create({
    userId: req.user._id,
    action: 'Sports Event Registration',
    resource: 'SportsEvent',
    resourceId: sportsEvent._id,
    details: `Registered as ${registrationType} for sports event`,
  });

  res.status(200).json({
    success: true,
    message: `Successfully registered as ${registrationType}`,
    data: sportsEvent,
  });
});

/**
 * @desc    Cancel sports event registration
 * @route   DELETE /api/sports/:id/register
 * @access  Private (Students)
 */
const cancelSportsRegistration = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const sportsEvent = await SportsEvent.findById(id);

  if (!sportsEvent) {
    res.status(404);
    throw new Error('Sports event not found');
  }

  // Remove from individuals
  const individualIndex = sportsEvent.individuals.findIndex(
    (i) => i.participantId.toString() === req.user._id.toString()
  );

  if (individualIndex !== -1) {
    sportsEvent.individuals.splice(individualIndex, 1);
  }

  // Remove from teams (if captain, remove entire team; if player, remove from players)
  const teamIndex = sportsEvent.teams.findIndex(
    (t) => t.captain.toString() === req.user._id.toString()
  );

  if (teamIndex !== -1) {
    sportsEvent.teams.splice(teamIndex, 1);
  } else {
    // Remove as player from any team
    sportsEvent.teams.forEach((team) => {
      team.players = team.players.filter(
        (p) => p.playerId.toString() !== req.user._id.toString()
      );
    });
  }

  await sportsEvent.save();

  // Create audit log
  await AuditLog.create({
    userId: req.user._id,
    action: 'Sports Event Registration Cancelled',
    resource: 'SportsEvent',
    resourceId: sportsEvent._id,
    details: 'Cancelled sports event registration',
  });

  res.status(200).json({
    success: true,
    message: 'Registration cancelled successfully',
  });
});

/**
 * @desc    Record sports event result
 * @route   POST /api/sports/:id/results
 * @access  Private (Sports Admins)
 */
const recordResult = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { matchNumber, team1, team2, score, winner, manOfTheMatch, highlights, date } = req.body;

  const sportsEvent = await SportsEvent.findById(id);

  if (!sportsEvent) {
    res.status(404);
    throw new Error('Sports event not found');
  }

  // Add result
  sportsEvent.results.push({
    matchNumber,
    team1,
    team2,
    score,
    winner,
    manOfTheMatch,
    highlights,
    date: date || new Date(),
  });

  // Update team statistics if team event
  if (team1 && team2) {
    const team1Index = sportsEvent.teams.findIndex((t) => t.teamName === team1);
    const team2Index = sportsEvent.teams.findIndex((t) => t.teamName === team2);

    if (team1Index !== -1) {
      sportsEvent.teams[team1Index].matchesPlayed += 1;
      if (winner === team1) {
        sportsEvent.teams[team1Index].matchesWon += 1;
        sportsEvent.teams[team1Index].points += 3; // Example: 3 points for a win
      } else if (winner !== 'Draw') {
        sportsEvent.teams[team1Index].matchesLost += 1;
      }
    }

    if (team2Index !== -1) {
      sportsEvent.teams[team2Index].matchesPlayed += 1;
      if (winner === team2) {
        sportsEvent.teams[team2Index].matchesWon += 1;
        sportsEvent.teams[team2Index].points += 3;
      } else if (winner !== 'Draw') {
        sportsEvent.teams[team2Index].matchesLost += 1;
      }
    }

    // Handle draw
    if (winner === 'Draw') {
      if (team1Index !== -1) sportsEvent.teams[team1Index].points += 1;
      if (team2Index !== -1) sportsEvent.teams[team2Index].points += 1;
    }
  }

  // Update fixture status
  const fixtureIndex = sportsEvent.fixtures.findIndex((f) => f.matchNumber === matchNumber);
  if (fixtureIndex !== -1) {
    sportsEvent.fixtures[fixtureIndex].status = 'Completed';
  }

  await sportsEvent.save();

  // Create audit log
  await AuditLog.create({
    userId: req.user._id,
    action: 'Sports Event Result Recorded',
    resource: 'SportsEvent',
    resourceId: sportsEvent._id,
    details: `Result recorded: ${team1 || 'Participant'} vs ${team2 || 'Participant'}`,
  });

  res.status(200).json({
    success: true,
    message: 'Result recorded successfully',
    data: sportsEvent,
  });
});

/**
 * @desc    Get sports event results
 * @route   GET /api/sports/:id/results
 * @access  Public
 */
const getSportsEventResults = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const sportsEvent = await SportsEvent.findById(id)
    .populate('results.manOfTheMatch', 'name email rollNumber')
    .populate('eventId', 'title');

  if (!sportsEvent) {
    res.status(404);
    throw new Error('Sports event not found');
  }

  res.status(200).json({
    success: true,
    data: {
      eventTitle: sportsEvent.eventId?.title,
      results: sportsEvent.results,
      standings: sportsEvent.standings,
      prizes: sportsEvent.prizes,
    },
  });
});

/**
 * @desc    Get sports statistics
 * @route   GET /api/sports/stats/overview
 * @access  Private (Sports Admins)
 */
const getSportsStats = asyncHandler(async (req, res) => {
  // Get all sports events
  const allSportsEvents = await SportsEvent.find().populate('eventId', 'title status');

  // Calculate statistics
  const stats = {
    totalSportsEvents: allSportsEvents.length,
    totalTeams: 0,
    totalIndividualParticipants: 0,
    totalMatches: 0,
    completedMatches: 0,
    upcomingMatches: 0,
    sportsByCategory: {},
    tournamentTypes: {},
  };

  allSportsEvents.forEach((event) => {
    stats.totalTeams += event.teams.length;
    stats.totalIndividualParticipants += event.individuals.length;
    stats.totalMatches += event.fixtures.length;
    stats.completedMatches += event.fixtures.filter((f) => f.status === 'Completed').length;
    stats.upcomingMatches += event.fixtures.filter((f) => f.status === 'Scheduled').length;

    // Count by category
    const category = event.sport.category || 'Other';
    stats.sportsByCategory[category] = (stats.sportsByCategory[category] || 0) + 1;

    // Count by tournament type
    const tournamentType = event.tournamentType;
    stats.tournamentTypes[tournamentType] = (stats.tournamentTypes[tournamentType] || 0) + 1;
  });

  res.status(200).json({
    success: true,
    data: stats,
  });
});

module.exports = {
  getSportsEvents,
  getSportsEvent,
  createSportsEvent,
  updateSportsEvent,
  deleteSportsEvent,
  registerForSportsEvent,
  cancelSportsRegistration,
  recordResult,
  getSportsEventResults,
  getSportsStats,
};
