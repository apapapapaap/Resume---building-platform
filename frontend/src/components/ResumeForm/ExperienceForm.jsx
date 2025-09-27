export default function ExperienceForm({ experienceList, onExperienceChange, onAddExperience }) {
  const removeExperience = (index) => {
    if (experienceList.length > 1) {
      const updated = experienceList.filter((_, i) => i !== index);
      onExperienceChange(0, 'update_all', updated);
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3>Work Experience</h3>
      {experienceList.map((exp, index) => (
        <div key={index} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label>Company Name</label>
              <input
                type="text"
                value={exp.company || ''}
                onChange={(e) => onExperienceChange(index, 'company', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label>Position</label>
              <input
                type="text"
                value={exp.position || ''}
                onChange={(e) => onExperienceChange(index, 'position', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label>Start Year</label>
              <input
                type="text"
                value={exp.startYear || ''}
                onChange={(e) => onExperienceChange(index, 'startYear', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label>End Year</label>
              <input
                type="text"
                value={exp.endYear || ''}
                onChange={(e) => onExperienceChange(index, 'endYear', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label>Location</label>
              <input
                type="text"
                value={exp.location || ''}
                onChange={(e) => onExperienceChange(index, 'location', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Job Description</label>
            <textarea
              value={exp.description || ''}
              onChange={(e) => onExperienceChange(index, 'description', e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          {experienceList.length > 1 && (
            <button 
              type="button" 
              onClick={() => removeExperience(index)}
              style={{ backgroundColor: '#dc3545', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px' }}
            >
              Remove Experience
            </button>
          )}
        </div>
      ))}
      
      <button 
        type="button" 
        onClick={onAddExperience}
        style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px' }}
      >
        Add Experience
      </button>
    </div>
  );
}
