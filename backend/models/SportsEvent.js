const mongoose = require('mongoose');

const sportsEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      unique: true,
    },
    sport: {
      name: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        enum: ['Indoor', 'Outdoor', 'Water Sports', 'Athletics', 'Other'],
      },
    },
    tournamentType: {
      type: String,
      enum: [
        'Knockout',
        'League',
        'Round Robin',
        'Swiss System',
        'Individual',
        'Team',
      ],
      required: true,
    },
    participationType: {
      type: String,
      enum: ['Individual', 'Team', 'Both'],
      default: 'Individual',
    },
    teams: [
      {
        teamName: {
          type: String,
          required: true,
        },
        department: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Department',
        },
        captain: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        players: [
          {
            playerId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
            jerseyNumber: Number,
            position: String,
          },
        ],
        logo: String,
        matchesPlayed: {
          type: Number,
          default: 0,
        },
        matchesWon: {
          type: Number,
          default: 0,
        },
        matchesLost: {
          type: Number,
          default: 0,
        },
        points: {
          type: Number,
          default: 0,
        },
      },
    ],
    individuals: [
      {
        participantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        bib: String,
        category: String, // Age group, weight category, etc.
        bestPerformance: String,
      },
    ],
    fixtures: [
      {
        matchNumber: Number,
        round: String,
        team1: String,
        team2: String,
        date: Date,
        time: String,
        venue: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Venue',
        },
        status: {
          type: String,
          enum: ['Scheduled', 'Live', 'Completed', 'Postponed', 'Cancelled'],
          default: 'Scheduled',
        },
      },
    ],
    results: [
      {
        matchNumber: Number,
        team1: String,
        team2: String,
        score: {
          team1Score: String,
          team2Score: String,
        },
        winner: String,
        manOfTheMatch: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        highlights: String,
        date: Date,
      },
    ],
    standings: [
      {
        rank: Number,
        teamName: String,
        played: Number,
        won: Number,
        lost: Number,
        drawn: Number,
        points: Number,
        goalDifference: Number,
      },
    ],
    prizes: [
      {
        position: {
          type: String,
          enum: ['Winner', 'Runner Up', 'Third Place', 'Special Prize'],
        },
        recipient: String,
        prizeDetails: String,
        amount: Number,
      },
    ],
    officials: [
      {
        name: String,
        role: {
          type: String,
          enum: ['Referee', 'Umpire', 'Scorer', 'Commentator', 'Coordinator'],
        },
        contact: String,
      },
    ],
    rules: {
      type: String,
      maxlength: 2000,
    },
    equipment: [String],
    sponsorship: [
      {
        sponsorName: String,
        amount: Number,
        type: {
          type: String,
          enum: ['Title', 'Associate', 'Kit', 'Other'],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

sportsEventSchema.index({ eventId: 1 });
sportsEventSchema.index({ 'sport.name': 1 });

module.exports = mongoose.model('SportsEvent', sportsEventSchema);