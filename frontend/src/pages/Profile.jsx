import React, { useState } from 'react';

const Profile = () => {
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  // Your existing profile logic...

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('photo', file);
    const res = await fetch('/api/auth/profile-picture', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData
    });
    const data = await res.json();
    setProfilePictureUrl(data.url);
  };

  return (
    <div>
      {/* Other profile fields */}

      <label htmlFor="profilePicUpload">Upload Profile Picture:</label>
      <input id="profilePicUpload" type="file" onChange={handleFileChange} />

      {profilePictureUrl && (
        <img
          src={profilePictureUrl}
          alt="Profile"
          style={{ width: 100, height: 100, borderRadius: '50%', marginTop: 10 }}
        />
      )}
    </div>
  );
};

export default Profile;
