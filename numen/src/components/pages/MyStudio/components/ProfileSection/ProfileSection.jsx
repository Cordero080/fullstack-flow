// ProfileSection.jsx - Avatar, song, mood, and about me
import './ProfileSection.scss';

const MOOD_OPTIONS = [
  { id: 'chillin', label: 'chillin' },
  { id: 'hyped', label: 'hyped' },
  { id: 'tired', label: 'tired' },
  { id: 'in-love', label: 'in love' },
  { id: 'pissed', label: 'pissed' },
  { id: 'rockin', label: 'rockin' },
  { id: 'bored', label: 'bored' },
  { id: 'on-fire', label: 'on fire' },
  { id: 'whatever', label: 'whatever' },
  { id: 'emo', label: 'emo' },
];

function ProfileSection({ 
  avatarSrc, 
  displayUsername, 
  songTitle, 
  songArtist, 
  mood, 
  customBio, 
  isEditing, 
  onUpdateField 
}) {
  return (
    <section className="profile-section">
      {/* Avatar */}
      <div className="avatar-container">
        <img 
          src={avatarSrc}
          alt={displayUsername}
          className="mystudio-avatar"
        />
      </div>
      
      {/* Song Display */}
      <div className="song-section">
        <p className="song-label">currently vibing to</p>
        {isEditing ? (
          <div className="song-edit">
            <input
              type="text"
              placeholder="song name"
              value={songTitle}
              onChange={(e) => onUpdateField('songTitle', e.target.value)}
              className="song-input"
            />
            <input
              type="text"
              placeholder="artist"
              value={songArtist}
              onChange={(e) => onUpdateField('songArtist', e.target.value)}
              className="song-input"
            />
          </div>
        ) : (
          <p className="song-display">
            {songTitle 
              ? `${songTitle} - ${songArtist}`
              : 'nothing playing...'}
          </p>
        )}
      </div>
      
      {/* Mood */}
      <div className="mood-section">
        <span className="mood-label">mood:</span>
        {isEditing ? (
          <div className="mood-picker">
            {MOOD_OPTIONS.map(({ id, label }) => (
              <button
                key={id}
                className={`mood-option ${mood === id ? 'selected' : ''}`}
                onClick={() => onUpdateField('mood', id)}
              >
                {label}
              </button>
            ))}
          </div>
        ) : (
          <span className="mood-display">
            {MOOD_OPTIONS.find(m => m.id === mood)?.label || mood}
          </span>
        )}
      </div>

      {/* About Me */}
      <div className="about-section">
        <h2 className="section-title">about me</h2>
        <div className="about-box">
          {isEditing ? (
            <textarea
              className="about-textarea"
              placeholder="tell the world about yourself..."
              value={customBio}
              onChange={(e) => onUpdateField('customBio', e.target.value)}
              rows={4}
            />
          ) : (
            <div 
              className="about-content"
              dangerouslySetInnerHTML={{ 
                __html: customBio || 'this user hasn\'t written anything yet...' 
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default ProfileSection;
