import { useState } from 'react';

export default function SkillsForm({ skills, setSkills }) {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3>Skills</h3>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Enter a skill"
          style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
        />
        <button 
          type="button" 
          onClick={addSkill}
          style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px' }}
        >
          Add Skill
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {skills.map((skill, index) => (
          <span 
            key={index} 
            style={{ 
              backgroundColor: '#e9ecef', 
              padding: '5px 10px', 
              borderRadius: '15px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '5px' 
            }}
          >
            {skill}
            <button 
              type="button" 
              onClick={() => removeSkill(index)}
              style={{ 
                backgroundColor: 'transparent', 
                border: 'none', 
                color: '#dc3545', 
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
