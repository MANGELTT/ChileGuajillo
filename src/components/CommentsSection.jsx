import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const CommentsSection = ({ movieId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProfileId = localStorage.getItem('profileID');
      if (storedProfileId) {
        setProfileId(storedProfileId);
      } else {
        alert('Hubo un problema al cargar el perfil. Intente de nuevo.');
      }
    }
  }, []);

  const submitComment = async () => {
    const token = JSON.parse(localStorage.getItem('tokerUser_Verified'));

    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      return;
    }
    
    if (!profileId) {
      alert('Hubo un problema al cargar el perfil. Intente de nuevo.');
      return;
    }
    if (rating === 0 || comment === '') {
      alert('Por favor, selecciona una calificación y escribe un comentario.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          movie_id: movieId,
          profile_id: profileId,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error en la respuesta del servidor: ${response.status} - ${errorText}`);
        alert('Hubo un error en el servidor');
        return;
      }

      const data = await response.json();
      alert('Comentario enviado correctamente');
      setComment('');
      setRating(0);
    } catch (error) {
      console.error('Error al enviar el comentario:', error);
      alert('Hubo un error al enviar el comentario');
    }
  };

  return (
    <section>
      <h4 className="text-lg font-bold text-white mb-4">Deja tu calificación:</h4>
      <div className="flex items-center space-x-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <label key={star}>
            <input
              type="radio"
              name="rating"
              value={star}
              onChange={() => setRating(star)}
              checked={rating === star}
              style={{ display: 'none' }}
            />
            <i
              className={`fa-star ${star <= rating ? 'text-yellow-400' : 'text-gray-400'} fas cursor-pointer`}
              onClick={() => setRating(star)}
            ></i>
          </label>
        ))}
      </div>
      <textarea
        className="w-full h-32 p-2 rounded bg-gray-700 text-white mb-4"
        placeholder="Escribe un comentario..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={submitComment}
      >
        Enviar
      </button>
    </section>
  );
};

export default CommentsSection;
