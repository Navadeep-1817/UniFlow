import React, { useState, useEffect } from 'react';

const StudentBodyMembership = () => {
  const [studentBodies, setStudentBodies] = useState([]);
  const [myMemberships, setMyMemberships] = useState([]);

  const handleJoin = (bodyId) => {
    console.log('Joining student body:', bodyId);
    // Join student bodies (SAC, NSS, etc.)
  };

  return (
    <div className="student-body-membership">
      <h2>Student Body Membership</h2>
      <div className="available-bodies">
        <h3>Available Student Bodies</h3>
        <div className="bodies-grid">
          {studentBodies.map(body => (
            <div key={body.id} className="body-card">
              <h4>{body.name}</h4>
              <p>{body.description}</p>
              <p>Members: {body.memberCount}</p>
              <p>Faculty Head: {body.facultyHead}</p>
              <button onClick={() => handleJoin(body.id)}>
                Join
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="my-memberships">
        <h3>My Memberships</h3>
        {myMemberships.map(membership => (
          <div key={membership.id} className="membership-card">
            <h4>{membership.bodyName}</h4>
            <p>Joined on: {membership.joinedDate}</p>
            <p>Role: {membership.role}</p>
            <button>View Events</button>
            <button>Leave</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentBodyMembership;
