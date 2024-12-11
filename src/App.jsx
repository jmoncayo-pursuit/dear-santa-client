import { useState, useEffect } from 'react';
import api from './services/api';
import './App.css';

function App() {
  const [letters, setLetters] = useState([]);
  const [childName, setChildName] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openLetterId, setOpenLetterId] = useState(null);

  useEffect(() => {
    loadLetters();
  }, []);

  const loadLetters = async () => {
    try {
      const data = await api.getLetters();
      setLetters(data);
    } catch (err) {
      setError('Failed to load letters');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.submitLetter({
        childName,
        letterContent,
      });
      setLetters((prev) => [response, ...prev]);
      setChildName('');
      setLetterContent('');
      setOpenLetterId(response.id);
    } catch (err) {
      setError(err.message || 'Failed to submit letter');
    } finally {
      setLoading(false);
    }
  };

  const toggleLetter = (id) => {
    setOpenLetterId(openLetterId === id ? null : id);
  };

  return (
    <div className='app'>
      <h1>
        <img 
          src="/apple-touch-icon.png" 
          alt="Santa" 
          className="santa-icon"
        />
        <br />
        Dear Santa
      </h1>

      <form onSubmit={handleSubmit} className='letter-form'>
        <input
          type='text'
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          placeholder='Your Name'
          required
          aria-label="Child's name"
        />
        <textarea
          value={letterContent}
          onChange={(e) => setLetterContent(e.target.value)}
          placeholder='Dear Santa...'
          required
          aria-label='Letter content'
        />
        <button type='submit' disabled={loading}>
          {loading ? 'Sending...' : 'Send to Santa'}
        </button>
        {error && <p className='error'>{error}</p>}
      </form>

      <div className='letters'>
        {letters && letters.length > 0 ? (
          letters.map((letter) => (
            <div
              key={letter.id}
              className={`letter ${
                openLetterId === letter.id ? 'open' : ''
              }`}
              onClick={() => toggleLetter(letter.id)}
            >
              <div className='letter-header'>
                <h3>From: {letter.child_name}</h3>
                <span className='toggle-icon'>
                  {openLetterId === letter.id ? '▼' : '▶'}
                </span>
              </div>

              {openLetterId === letter.id && (
                <div className='letter-content'>
                  <div className='child-letter'>
                    <h4>Letter:</h4>
                    <p>{letter.letter_content}</p>
                  </div>
                  {letter.santa_response && (
                    <div className='santa-response'>
                      <h4>Santa's Response:</h4>
                      <p>{letter.santa_response}</p>
                    </div>
                  )}
                  <div className='letter-date'>
                    <small>
                      Sent on:{' '}
                      {new Date(
                        letter.created_at
                      ).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className='no-letters'>
            No letters yet. Be the first to write to Santa!
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
