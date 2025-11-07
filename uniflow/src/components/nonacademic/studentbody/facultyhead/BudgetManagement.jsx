import React, { useState, useEffect } from 'react';
import FacultyHeadTopNav from './FacultyHeadTopNav';
import { styles } from './BudgetManagementStyles';

// Mock data for budget allocations
const mockAllocations = [
  { 
    id: 1, 
    eventName: 'Annual Tech Fest', 
    department: 'Computer Science',
    allocated: 150000, 
    spent: 120000, 
    pending: 15000,
    status: 'Active',
    approvalLimit: 50000,
    requestedBy: 'Dr. Sharma',
    date: '2023-09-15',
    expenses: [
      { id: 1, description: 'Venue Booking', amount: 50000, status: 'Approved', date: '2023-09-20' },
      { id: 2, description: 'Equipment Rental', amount: 40000, status: 'Approved', date: '2023-09-22' },
      { id: 3, description: 'Marketing Materials', amount: 30000, status: 'Approved', date: '2023-09-25' },
      { id: 4, description: 'Catering Services', amount: 15000, status: 'Pending', date: '2023-09-28' },
    ]
  },
  { 
    id: 2, 
    eventName: 'Sports Championship', 
    department: 'Physical Education',
    allocated: 100000, 
    spent: 75000, 
    pending: 10000,
    status: 'Active',
    approvalLimit: 30000,
    requestedBy: 'Prof. Kumar',
    date: '2023-09-20',
    expenses: [
      { id: 1, description: 'Sports Equipment', amount: 45000, status: 'Approved', date: '2023-09-22' },
      { id: 2, description: 'Trophy & Medals', amount: 30000, status: 'Approved', date: '2023-09-24' },
      { id: 3, description: 'Refreshments', amount: 10000, status: 'Pending', date: '2023-09-26' },
    ]
  },
  { 
    id: 3, 
    eventName: 'Cultural Week', 
    department: 'Arts',
    allocated: 80000, 
    spent: 60000, 
    pending: 5000,
    status: 'Active',
    approvalLimit: 25000,
    requestedBy: 'Dr. Patel',
    date: '2023-10-01',
    expenses: [
      { id: 1, description: 'Stage Setup', amount: 35000, status: 'Approved', date: '2023-10-03' },
      { id: 2, description: 'Sound System', amount: 25000, status: 'Approved', date: '2023-10-05' },
      { id: 3, description: 'Decorations', amount: 5000, status: 'Pending', date: '2023-10-07' },
    ]
  },
  { 
    id: 4, 
    eventName: 'Research Symposium', 
    department: 'Science',
    allocated: 120000, 
    spent: 90000, 
    pending: 0,
    status: 'Completed',
    approvalLimit: 40000,
    requestedBy: 'Dr. Singh',
    date: '2023-08-10',
    expenses: [
      { id: 1, description: 'Conference Hall', amount: 40000, status: 'Approved', date: '2023-08-12' },
      { id: 2, description: 'Guest Speakers', amount: 50000, status: 'Approved', date: '2023-08-15' },
    ]
  },
];

const BudgetManagement = () => {
  const [budget, setBudget] = useState({
    total: 500000,
    allocated: 450000,
    utilized: 345000,
    remaining: 50000
  });
  const [allocations, setAllocations] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const [newAllocation, setNewAllocation] = useState({
    eventName: '',
    department: '',
    amount: '',
    approvalLimit: '',
    requestedBy: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        setTimeout(() => {
          setAllocations(mockAllocations);
          
          const pending = mockAllocations.flatMap(allocation => 
            allocation.expenses
              .filter(expense => expense.status === 'Pending')
              .map(expense => ({
                ...expense,
                eventName: allocation.eventName,
                allocationId: allocation.id
              }))
          );
          setPendingApprovals(pending);
          
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching budget data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAllocateBudget = () => {
    if (!newAllocation.eventName || !newAllocation.amount) {
      alert('Please fill in all required fields');
      return;
    }

    const allocation = {
      id: allocations.length + 1,
      eventName: newAllocation.eventName,
      department: newAllocation.department,
      allocated: parseFloat(newAllocation.amount),
      spent: 0,
      pending: 0,
      status: 'Active',
      approvalLimit: parseFloat(newAllocation.approvalLimit),
      requestedBy: newAllocation.requestedBy,
      date: new Date().toISOString().split('T')[0],
      expenses: []
    };

    setAllocations([...allocations, allocation]);
    setBudget({
      ...budget,
      allocated: budget.allocated + allocation.allocated,
      remaining: budget.remaining - allocation.allocated
    });

    setNewAllocation({
      eventName: '',
      department: '',
      amount: '',
      approvalLimit: '',
      requestedBy: ''
    });
    setShowAllocationModal(false);
  };

  const handleApproveExpense = (allocationId, expenseId) => {
    const updatedAllocations = allocations.map(allocation => {
      if (allocation.id === allocationId) {
        const updatedExpenses = allocation.expenses.map(expense => {
          if (expense.id === expenseId) {
            return { ...expense, status: 'Approved' };
          }
          return expense;
        });
        
        const approvedExpense = allocation.expenses.find(e => e.id === expenseId);
        return {
          ...allocation,
          expenses: updatedExpenses,
          spent: allocation.spent + approvedExpense.amount,
          pending: allocation.pending - approvedExpense.amount
        };
      }
      return allocation;
    });

    setAllocations(updatedAllocations);
    setPendingApprovals(pendingApprovals.filter(p => p.id !== expenseId || p.allocationId !== allocationId));
  };

  const handleRejectExpense = (allocationId, expenseId) => {
    const updatedAllocations = allocations.map(allocation => {
      if (allocation.id === allocationId) {
        const updatedExpenses = allocation.expenses.map(expense => {
          if (expense.id === expenseId) {
            return { ...expense, status: 'Rejected' };
          }
          return expense;
        });
        return { ...allocation, expenses: updatedExpenses };
      }
      return allocation;
    });

    setAllocations(updatedAllocations);
    setPendingApprovals(pendingApprovals.filter(p => p.id !== expenseId || p.allocationId !== allocationId));
  };

  const filteredAllocations = filterStatus === 'All' 
    ? allocations 
    : allocations.filter(a => a.status === filterStatus);

  if (isLoading) {
    return (
      <>
        <FacultyHeadTopNav />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading budget data...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <FacultyHeadTopNav />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Budget Management Dashboard</h2>
          <button
            style={styles.primaryButton}
            onClick={() => setShowAllocationModal(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4338CA';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4F46E5';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            + Allocate New Budget
          </button>
        </div>

        {/* Budget Overview Cards */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Total Budget', value: budget.total, color: '#111827', subtext: 'Annual allocation' },
            { label: 'Allocated', value: budget.allocated, color: '#4F46E5', subtext: `${((budget.allocated / budget.total) * 100).toFixed(1)}% of total` },
            { label: 'Utilized', value: budget.utilized, color: '#10B981', subtext: `${((budget.utilized / budget.allocated) * 100).toFixed(1)}% spent` },
            { label: 'Remaining', value: budget.remaining, color: '#8B5CF6', subtext: 'Available for allocation' }
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                ...styles.statCard,
                ...(hoveredCard === index ? styles.statCardHover : {})
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h3 style={styles.statLabel}>{stat.label}</h3>
              <p style={{ ...styles.statValue, color: stat.color }}>₹{stat.value.toLocaleString()}</p>
              <p style={styles.statSubtext}>{stat.subtext}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          <div style={styles.tabsHeader}>
            {['overview', 'allocations', 'approvals'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab ? styles.tabActive : {})
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.color = '#4F46E5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.color = '#6B7280';
                  }
                }}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'allocations' && 'Budget Allocations'}
                {tab === 'approvals' && (
                  <>
                    Pending Approvals
                    {pendingApprovals.length > 0 && (
                      <span style={styles.badge}>{pendingApprovals.length}</span>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div style={styles.tabContent}>
              <div style={styles.overviewGrid}>
                <div style={styles.chartPlaceholder}>
                  <h3 style={styles.chartTitle}>Budget Distribution</h3>
                  <div style={styles.chartInfo}>
                    <div style={styles.chartLegend}>
                      <div style={styles.legendItem}>
                        <span style={{ ...styles.legendDot, backgroundColor: '#4F46E5' }}></span>
                        <span>Utilized: ₹{budget.utilized.toLocaleString()}</span>
                      </div>
                      <div style={styles.legendItem}>
                        <span style={{ ...styles.legendDot, backgroundColor: '#FBBF24' }}></span>
                        <span>Pending: ₹{(budget.allocated - budget.utilized).toLocaleString()}</span>
                      </div>
                      <div style={styles.legendItem}>
                        <span style={{ ...styles.legendDot, backgroundColor: '#10B981' }}></span>
                        <span>Available: ₹{budget.remaining.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={styles.chartPlaceholder}>
                  <h3 style={styles.chartTitle}>Department-wise Spending</h3>
                  <div style={styles.departmentList}>
                    {[...new Set(allocations.map(a => a.department))].map(dept => {
                      const deptTotal = allocations
                        .filter(a => a.department === dept)
                        .reduce((sum, a) => sum + a.spent, 0);
                      return (
                        <div key={dept} style={styles.departmentItem}>
                          <span style={styles.departmentName}>{dept}</span>
                          <span style={styles.departmentAmount}>₹{deptTotal.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Allocations Tab */}
          {activeTab === 'allocations' && (
            <div style={styles.tabContent}>
              <div style={styles.tableHeader}>
                <h3 style={styles.tableTitle}>Budget Allocations</h3>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={styles.select}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.th}>Event</th>
                      <th style={styles.th}>Department</th>
                      <th style={styles.th}>Allocated</th>
                      <th style={styles.th}>Spent</th>
                      <th style={styles.th}>Pending</th>
                      <th style={styles.th}>Available</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAllocations.map(allocation => {
                      const available = allocation.allocated - allocation.spent - allocation.pending;
                      
                      return (
                        <tr 
                          key={allocation.id} 
                          style={styles.tableRow}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F9FAFB';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                          }}
                        >
                          <td style={styles.td}><strong>{allocation.eventName}</strong></td>
                          <td style={styles.td}>{allocation.department}</td>
                          <td style={styles.td}>₹{allocation.allocated.toLocaleString()}</td>
                          <td style={{ ...styles.td, color: '#10B981' }}>₹{allocation.spent.toLocaleString()}</td>
                          <td style={{ ...styles.td, color: '#F59E0B' }}>₹{allocation.pending.toLocaleString()}</td>
                          <td style={{ ...styles.td, color: '#4F46E5' }}>₹{available.toLocaleString()}</td>
                          <td style={styles.td}>
                            <span style={{
                              ...styles.statusBadge,
                              backgroundColor: allocation.status === 'Active' ? '#D1FAE5' : '#E5E7EB',
                              color: allocation.status === 'Active' ? '#065F46' : '#1F2937'
                            }}>
                              {allocation.status}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <button
                              onClick={() => {
                                setSelectedAllocation(allocation);
                                setShowExpenseModal(true);
                              }}
                              style={styles.linkButton}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#3730A3';
                                e.currentTarget.style.textDecoration = 'underline';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#4F46E5';
                                e.currentTarget.style.textDecoration = 'none';
                              }}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Approvals Tab */}
          {activeTab === 'approvals' && (
            <div style={styles.tabContent}>
              <h3 style={styles.tableTitle}>Pending Expense Approvals</h3>
              
              {pendingApprovals.length === 0 ? (
                <div style={styles.emptyState}>
                  No pending approvals at this time.
                </div>
              ) : (
                <div style={styles.approvalsList}>
                  {pendingApprovals.map(approval => (
                    <div 
                      key={`${approval.allocationId}-${approval.id}`} 
                      style={styles.approvalCard}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={styles.approvalContent}>
                        <div>
                          <h4 style={styles.approvalTitle}>{approval.eventName}</h4>
                          <p style={styles.approvalDescription}>{approval.description}</p>
                          <div style={styles.approvalMeta}>
                            <span>Amount: <strong>₹{approval.amount.toLocaleString()}</strong></span>
                            <span>Date: {new Date(approval.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div style={styles.approvalActions}>
                          <button
                            onClick={() => handleApproveExpense(approval.allocationId, approval.id)}
                            style={styles.approveButton}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#059669';
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#10B981';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectExpense(approval.allocationId, approval.id)}
                            style={styles.rejectButton}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#B91C1C';
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#DC2626';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Allocation Modal */}
        {showAllocationModal && (
          <div style={styles.modalOverlay} onClick={() => setShowAllocationModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>Allocate New Budget</h3>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Event Name *</label>
                <input
                  type="text"
                  value={newAllocation.eventName}
                  onChange={(e) => setNewAllocation({ ...newAllocation, eventName: e.target.value })}
                  style={styles.input}
                  placeholder="Enter event name"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Department *</label>
                <input
                  type="text"
                  value={newAllocation.department}
                  onChange={(e) => setNewAllocation({ ...newAllocation, department: e.target.value })}
                  style={styles.input}
                  placeholder="Enter department"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Budget Amount (₹) *</label>
                <input
                  type="number"
                  value={newAllocation.amount}
                  onChange={(e) => setNewAllocation({ ...newAllocation, amount: e.target.value })}
                  style={styles.input}
                  placeholder="Enter amount"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Approval Limit (₹)</label>
                <input
                  type="number"
                  value={newAllocation.approvalLimit}
                  onChange={(e) => setNewAllocation({ ...newAllocation, approvalLimit: e.target.value })}
                  style={styles.input}
                  placeholder="Max amount per expense"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Requested By</label>
                <input
                  type="text"
                  value={newAllocation.requestedBy}
                  onChange={(e) => setNewAllocation({ ...newAllocation, requestedBy: e.target.value })}
                  style={styles.input}
                  placeholder="Enter requester name"
                />
              </div>
              
              <div style={styles.modalActions}>
                <button
                  onClick={handleAllocateBudget}
                  style={styles.primaryButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4338CA';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#4F46E5';
                  }}
                >
                  Allocate Budget
                </button>
                <button
                  onClick={() => setShowAllocationModal(false)}
                  style={styles.secondaryButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#D1D5DB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Expense Details Modal */}
        {showExpenseModal && selectedAllocation && (
          <div style={styles.modalOverlay} onClick={() => setShowExpenseModal(false)}>
            <div style={{ ...styles.modal, maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <div>
                  <h3 style={styles.modalTitle}>{selectedAllocation.eventName}</h3>
                  <p style={styles.modalSubtitle}>{selectedAllocation.department}</p>
                </div>
                <button
                  onClick={() => setShowExpenseModal(false)}
                  style={styles.closeButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#111827';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#6B7280';
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={styles.expenseGrid}>
                {[
                  { label: 'Allocated Budget', value: selectedAllocation.allocated },
                  { label: 'Approval Limit', value: selectedAllocation.approvalLimit },
                  { label: 'Total Spent', value: selectedAllocation.spent, color: '#10B981' },
                  { label: 'Available', value: selectedAllocation.allocated - selectedAllocation.spent - selectedAllocation.pending, color: '#4F46E5' }
                ].map((item, index) => (
                  <div key={index} style={styles.expenseCard}>
                    <p style={styles.expenseLabel}>{item.label}</p>
                    <p style={{ ...styles.expenseValue, color: item.color || '#111827' }}>
                      ₹{item.value.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              
              <h4 style={styles.sectionTitle}>Expense Breakdown</h4>
              <div style={styles.expenseList}>
                {selectedAllocation.expenses.map(expense => (
                  <div key={expense.id} style={styles.expenseItem}>
                    <div>
                      <p style={styles.expenseDescription}>{expense.description}</p>
                      <p style={styles.expenseDate}>{new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={styles.expenseAmount}>₹{expense.amount.toLocaleString()}</p>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: 
                          expense.status === 'Approved' ? '#D1FAE5' :
                          expense.status === 'Pending' ? '#FEF3C7' : '#FEE2E2',
                        color:
                          expense.status === 'Approved' ? '#065F46' :
                          expense.status === 'Pending' ? '#92400E' : '#991B1B'
                      }}>
                        {expense.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default BudgetManagement;
