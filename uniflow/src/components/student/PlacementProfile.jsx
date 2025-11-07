import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiUpload, FiCheckCircle, FiXCircle, FiPlus, FiTrash2, FiEdit2, FiSave, FiDownload, FiBriefcase, FiAward, FiBook, FiCode, FiGithub, FiLinkedin, FiArrowLeft } from 'react-icons/fi';
import { colors, commonStyles, hoverEffects } from '../../styles/globalStyles';

const PlacementProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [profileData, setProfileData] = useState({
    rollNo: 'CS2021001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@university.edu',
    phone: '+91 9876543210',
    linkedIn: 'linkedin.com/in/rajeshkumar',
    github: 'github.com/rajeshkumar',
    cgpa: 8.45,
    percentage10th: 92.5,
    percentage12th: 88.0,
    activeBacklogs: 0,
    branch: 'Computer Science & Engineering',
    semester: '8th Semester',
    resumeUploaded: true,
    resumeName: 'Rajesh_Kumar_Resume.pdf',
    isEligible: true,
    placementStatus: 'Eligible',
    skills: ['Python', 'Java', 'React.js', 'Node.js', 'MySQL', 'MongoDB', 'Machine Learning', 'Data Structures'],
    projects: [
      { id: 1, title: 'E-Commerce Platform', tech: 'React, Node.js, MongoDB', description: 'Full-stack e-commerce application with payment gateway', duration: '3 months' },
      { id: 2, title: 'ML-based Chatbot', tech: 'Python, TensorFlow, Flask', description: 'AI chatbot for customer support automation', duration: '2 months' }
    ],
    internships: [
      { id: 1, company: 'Tech Corp', role: 'Software Development Intern', duration: 'May 2023 - July 2023', description: 'Developed REST APIs and worked on frontend optimization' }
    ],
    certifications: ['AWS Certified Developer', 'Google Cloud Professional', 'Python Programming - Coursera']
  });

  const [editedData, setEditedData] = useState({ ...profileData });
  const [newSkill, setNewSkill] = useState('');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showInternshipModal, setShowInternshipModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', tech: '', description: '', duration: '' });
  const [newInternship, setNewInternship] = useState({ company: '', role: '', duration: '', description: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleDownloadResume = () => {
    showToast(`📄 Downloading ${profileData.resumeName}...`, 'success');
    console.log('Downloading resume:', profileData.resumeName);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...editedData });
    setIsEditing(false);
    showToast('Placement profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...profileData });
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setEditedData(prev => ({ ...prev, resumeUploaded: true, resumeName: file.name }));
      showToast('Resume uploaded successfully!');
    } else {
      showToast('Please upload a PDF file', 'error');
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setEditedData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setEditedData({
      ...editedData,
      skills: editedData.skills.filter((_, i) => i !== index)
    });
  };

  const handleAddProject = () => {
    if (!newProject.title || !newProject.tech || !newProject.description || !newProject.duration) {
      showToast('Please fill all project fields', 'error');
      return;
    }
    const projectToAdd = {
      id: editedData.projects.length + 1,
      ...newProject
    };
    setEditedData({
      ...editedData,
      projects: [...editedData.projects, projectToAdd]
    });
    setNewProject({ title: '', tech: '', description: '', duration: '' });
    setShowProjectModal(false);
    showToast('Project added successfully!');
  };

  const handleAddInternship = () => {
    if (!newInternship.company || !newInternship.role || !newInternship.duration || !newInternship.description) {
      showToast('Please fill all internship fields', 'error');
      return;
    }
    const internshipToAdd = {
      id: editedData.internships.length + 1,
      ...newInternship
    };
    setEditedData({
      ...editedData,
      internships: [...editedData.internships, internshipToAdd]
    });
    setNewInternship({ company: '', role: '', duration: '', description: '' });
    setShowInternshipModal(false);
    showToast('Internship added successfully!');
  };

  const currentData = isEditing ? editedData : profileData;

  return (
    <div style={commonStyles.container}>
      {toast.show && <div style={{...commonStyles.toast, backgroundColor: toast.type === 'success' ? colors.success : colors.error}}>{toast.message}</div>}
      
      <div style={commonStyles.content}>
        <div style={commonStyles.pageHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/student/dashboard')} style={{ ...commonStyles.secondaryBtn, padding: '10px 12px' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.gray200; e.currentTarget.style.transform = 'translateX(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.gray100; e.currentTarget.style.transform = 'translateX(0)'; }}>
              <FiArrowLeft size={18} />
            </button>
            <div>
              <h1 style={commonStyles.pageTitle}>Placement Profile</h1>
              <p style={commonStyles.pageSubtitle}>Manage your placement readiness and recruiter visibility</p>
            </div>
          </div>
          {!isEditing ? (
            <button onClick={handleEdit} style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
              <FiEdit2 size={18} /> Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleCancel} style={commonStyles.secondaryBtn}>Cancel</button>
              <button onClick={handleSave} style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
                <FiSave size={18} /> Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Eligibility Status Card */}
        <div style={{ ...commonStyles.card, marginBottom: '24px', backgroundColor: currentData.isEligible ? colors.successLight : colors.errorLight, border: `2px solid ${currentData.isEligible ? colors.success : colors.error}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '14px', backgroundColor: colors.white, borderRadius: '12px' }}>
              {currentData.isEligible ? <FiCheckCircle size={32} color={colors.success} /> : <FiXCircle size={32} color={colors.error} />}
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: currentData.isEligible ? colors.successDark : colors.errorDark, margin: '0 0 4px 0' }}>
                {currentData.isEligible ? 'Placement Eligible' : 'Not Eligible'}
              </h3>
              <p style={{ fontSize: '14px', color: currentData.isEligible ? colors.successDark : colors.errorDark, margin: 0 }}>
                {currentData.isEligible ? 'You meet the criteria for campus placements' : 'Please improve your academic performance'}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Personal Info */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: `2px solid ${colors.gray200}` }}>Personal Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600 }}>Roll Number</label>
                <div style={{ padding: '12px', backgroundColor: colors.gray100, borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: colors.gray600 }}>{currentData.rollNo}</div></div>
              <div><label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600 }}>Full Name</label>
                {isEditing ? <input type="text" value={currentData.name} onChange={(e) => handleInputChange('name', e.target.value)} style={commonStyles.input} /> :
                <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: colors.gray800 }}>{currentData.name}</div>}</div>
              <div><label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600 }}>Email</label>
                <div style={{ padding: '12px', backgroundColor: colors.gray100, borderRadius: '8px', fontSize: '14px', color: colors.gray600 }}>{currentData.email}</div></div>
              <div><label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'flex', alignItems: 'center', gap: '6px' }}><FiLinkedin size={14} /> LinkedIn Profile</label>
                {isEditing ? <input type="text" value={currentData.linkedIn} onChange={(e) => handleInputChange('linkedIn', e.target.value)} style={commonStyles.input} /> :
                <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px', fontSize: '14px', color: colors.primary, cursor: 'pointer' }}>{currentData.linkedIn}</div>}</div>
              <div><label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'flex', alignItems: 'center', gap: '6px' }}><FiGithub size={14} /> GitHub Profile</label>
                {isEditing ? <input type="text" value={currentData.github} onChange={(e) => handleInputChange('github', e.target.value)} style={commonStyles.input} /> :
                <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px', fontSize: '14px', color: colors.gray800 }}>{currentData.github}</div>}</div>
            </div>
          </div>

          {/* Academic Info */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: `2px solid ${colors.gray200}` }}>Academic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600 }}>CGPA</label>
                {isEditing ? <input type="number" step="0.01" value={currentData.cgpa} onChange={(e) => handleInputChange('cgpa', e.target.value)} style={commonStyles.input} /> :
                <div style={{ padding: '12px', backgroundColor: colors.successLight, borderRadius: '8px', fontSize: '18px', fontWeight: '700', color: colors.success }}>{currentData.cgpa}</div>}</div>
              <div><label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600 }}>Active Backlogs</label>
                {isEditing ? <input type="number" value={currentData.activeBacklogs} onChange={(e) => handleInputChange('activeBacklogs', e.target.value)} style={commonStyles.input} /> :
                <div style={{ padding: '12px', backgroundColor: currentData.activeBacklogs === 0 ? colors.successLight : colors.errorLight, borderRadius: '8px', fontSize: '18px', fontWeight: '700', color: currentData.activeBacklogs === 0 ? colors.success : colors.error }}>{currentData.activeBacklogs}</div>}</div>
              <div><label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600 }}>10th %</label>
                {isEditing ? <input type="number" step="0.1" value={currentData.percentage10th} onChange={(e) => handleInputChange('percentage10th', e.target.value)} style={commonStyles.input} /> :
                <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px', fontSize: '16px', fontWeight: '600', color: colors.gray800 }}>{currentData.percentage10th}%</div>}</div>
              <div><label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600 }}>12th %</label>
                {isEditing ? <input type="number" step="0.1" value={currentData.percentage12th} onChange={(e) => handleInputChange('percentage12th', e.target.value)} style={commonStyles.input} /> :
                <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px', fontSize: '16px', fontWeight: '600', color: colors.gray800 }}>{currentData.percentage12th}%</div>}</div>
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div style={{ ...commonStyles.card, marginTop: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: `2px solid ${colors.gray200}` }}>Resume</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', backgroundColor: colors.gray50, borderRadius: '10px' }}>
            <div style={{ padding: '14px', backgroundColor: currentData.resumeUploaded ? colors.successLight : colors.errorLight, borderRadius: '10px' }}>
              {currentData.resumeUploaded ? <FiCheckCircle size={28} color={colors.success} /> : <FiUpload size={28} color={colors.error} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: colors.gray800 }}>{currentData.resumeUploaded ? currentData.resumeName : 'No resume uploaded'}</div>
              <div style={{ fontSize: '13px', color: colors.gray500, marginTop: '4px' }}>PDF format only • Max 2MB</div>
            </div>
            {isEditing && (
              <label style={{ ...commonStyles.primaryBtn, cursor: 'pointer' }} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
                <FiUpload size={16} /> Upload
                <input type="file" accept=".pdf" onChange={handleResumeUpload} style={{ display: 'none' }} />
              </label>
            )}
            {currentData.resumeUploaded && (
              <button style={{ ...commonStyles.secondaryBtn }} onClick={handleDownloadResume} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.gray200} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.gray100}>
                <FiDownload size={16} /> Download
              </button>
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div style={{ ...commonStyles.card, marginTop: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: `2px solid ${colors.gray200}` }}>Technical Skills</h3>
          {isEditing && (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a skill" style={{ ...commonStyles.input, flex: 1 }} />
              <button onClick={addSkill} style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}><FiPlus size={16} /> Add</button>
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {currentData.skills.map((skill, i) => (
              <div key={i} style={{ padding: '10px 16px', backgroundColor: colors.primaryLight, borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: colors.primary, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {skill}
                {isEditing && <FiTrash2 size={14} style={{ cursor: 'pointer' }} onClick={() => removeSkill(i)} />}
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div style={{ ...commonStyles.card, marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: `2px solid ${colors.gray200}` }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: 0 }}>Projects</h3>
            {isEditing && <button style={commonStyles.primaryBtn} onClick={() => setShowProjectModal(true)} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}><FiPlus size={16} /> Add Project</button>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentData.projects.map(project => (
              <div key={project.id} style={{ padding: '16px', backgroundColor: colors.gray50, borderRadius: '10px', border: `1px solid ${colors.gray200}` }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: colors.gray800, margin: '0 0 8px 0' }}>{project.title}</h4>
                <p style={{ fontSize: '13px', color: colors.primary, margin: '0 0 8px 0', fontWeight: '500' }}>{project.tech}</p>
                <p style={{ fontSize: '14px', color: colors.gray600, margin: '0 0 8px 0' }}>{project.description}</p>
                <span style={{ fontSize: '12px', color: colors.gray500 }}>Duration: {project.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Internships */}
        <div style={{ ...commonStyles.card, marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: `2px solid ${colors.gray200}` }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: 0 }}>Internships</h3>
            {isEditing && <button style={commonStyles.primaryBtn} onClick={() => setShowInternshipModal(true)} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}><FiPlus size={16} /> Add Internship</button>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentData.internships.map(intern => (
              <div key={intern.id} style={{ padding: '16px', backgroundColor: colors.gray50, borderRadius: '10px', border: `1px solid ${colors.gray200}` }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: colors.gray800, margin: '0 0 4px 0' }}>{intern.role}</h4>
                <p style={{ fontSize: '14px', color: colors.primary, margin: '0 0 8px 0', fontWeight: '500' }}>{intern.company}</p>
                <p style={{ fontSize: '14px', color: colors.gray600, margin: '0 0 8px 0' }}>{intern.description}</p>
                <span style={{ fontSize: '12px', color: colors.gray500 }}>{intern.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div style={{ ...commonStyles.card, marginTop: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: `2px solid ${colors.gray200}` }}>Certifications</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentData.certifications.map((cert, i) => (
              <div key={i} style={{ padding: '14px', backgroundColor: colors.successLight, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FiAward size={20} color={colors.success} />
                <span style={{ fontSize: '14px', fontWeight: '500', color: colors.gray800 }}>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      {showProjectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setShowProjectModal(false)}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, marginBottom: '20px' }}>Add New Project</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'block', marginBottom: '8px' }}>Project Title *</label>
                <input type="text" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="E-Commerce Platform" style={commonStyles.input} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'block', marginBottom: '8px' }}>Technologies Used *</label>
                <input type="text" value={newProject.tech} onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })} placeholder="React, Node.js, MongoDB" style={commonStyles.input} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'block', marginBottom: '8px' }}>Description *</label>
                <textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} placeholder="Full-stack e-commerce application with payment gateway" style={{ ...commonStyles.input, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'block', marginBottom: '8px' }}>Duration *</label>
                <input type="text" value={newProject.duration} onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })} placeholder="3 months" style={commonStyles.input} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button style={{ ...commonStyles.secondaryBtn, flex: 1 }} onClick={() => { setShowProjectModal(false); setNewProject({ title: '', tech: '', description: '', duration: '' }); }}>Cancel</button>
                <button style={{ ...commonStyles.primaryBtn, flex: 1 }} onClick={handleAddProject}>Add Project</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Internship Modal */}
      {showInternshipModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setShowInternshipModal(false)}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, marginBottom: '20px' }}>Add New Internship</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'block', marginBottom: '8px' }}>Company Name *</label>
                <input type="text" value={newInternship.company} onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })} placeholder="Tech Corp" style={commonStyles.input} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'block', marginBottom: '8px' }}>Role/Position *</label>
                <input type="text" value={newInternship.role} onChange={(e) => setNewInternship({ ...newInternship, role: e.target.value })} placeholder="Software Development Intern" style={commonStyles.input} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'block', marginBottom: '8px' }}>Duration *</label>
                <input type="text" value={newInternship.duration} onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })} placeholder="May 2023 - July 2023" style={commonStyles.input} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'block', marginBottom: '8px' }}>Description *</label>
                <textarea value={newInternship.description} onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })} placeholder="Developed REST APIs and worked on frontend optimization" style={{ ...commonStyles.input, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button style={{ ...commonStyles.secondaryBtn, flex: 1 }} onClick={() => { setShowInternshipModal(false); setNewInternship({ company: '', role: '', duration: '', description: '' }); }}>Cancel</button>
                <button style={{ ...commonStyles.primaryBtn, flex: 1 }} onClick={handleAddInternship}>Add Internship</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementProfile;
