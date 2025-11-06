import React, { useState, useEffect } from 'react';

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);

  const handleUpdateOfferStatus = (offerId, status) => {
    console.log('Updating offer:', offerId, 'to', status);
    // Track offers and acceptances
  };

  return (
    <div className="offer-management">
      <h2>Offer Management</h2>
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Company</th>
            <th>Role</th>
            <th>Package</th>
            <th>Offer Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {offers.map(offer => (
            <tr key={offer.id}>
              <td>{offer.studentName}</td>
              <td>{offer.company}</td>
              <td>{offer.role}</td>
              <td>₹{offer.package} LPA</td>
              <td>{offer.offerDate}</td>
              <td>{offer.status}</td>
              <td>
                <button onClick={() => handleUpdateOfferStatus(offer.id, 'accepted')}>
                  Mark Accepted
                </button>
                <button onClick={() => handleUpdateOfferStatus(offer.id, 'rejected')}>
                  Mark Rejected
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OfferManagement;
