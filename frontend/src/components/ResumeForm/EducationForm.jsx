// EducationForm.jsx
export default function EducationForm({ educationList, onEducationChange, onAddEducation }) {
  return (
    <div>
      {educationList.map((edu, index) => (
        <div key={index} style={{ marginBottom: '1rem' }}>
          <input
            value={edu.school}
            onChange={(e) => onEducationChange(index, 'school', e.target.value)}
            placeholder="School Name"
            style={{ display: 'block', marginBottom: 4, width: '100%' }}
          />
          <input
            value={edu.degree}
            onChange={(e) => onEducationChange(index, 'degree', e.target.value)}
            placeholder="Degree"
            style={{ display: 'block', marginBottom: 4, width: '100%' }}
          />
          <input
            value={edu.startYear}
            onChange={(e) => onEducationChange(index, 'startYear', e.target.value)}
            placeholder="Start Year"
            style={{ display: 'block', marginBottom: 4, width: '100%' }}
          />
          <input
            value={edu.endYear}
            onChange={(e) => onEducationChange(index, 'endYear', e.target.value)}
            placeholder="End Year"
            style={{ display: 'block', marginBottom: 4, width: '100%' }}
          />
        </div>
      ))}
      <button onClick={onAddEducation}>Add Education</button>
    </div>
  );
}
