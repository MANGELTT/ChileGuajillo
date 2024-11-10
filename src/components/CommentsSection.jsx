import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const CommentsSection = ({ movieId, initialComments }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [profileId, setProfileId] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [comments, setComments] = useState(initialComments);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProfileId = localStorage.getItem('profileID');
      if (storedProfileId) {
        setProfileId(storedProfileId);
        checkIfReviewed(storedProfileId);
      } else {
        alert('Hubo un problema al cargar el perfil. Intente de nuevo.');
      }
    }
  }, []);

  const checkIfReviewed = async (profileId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reviews?movie_id=${movieId}&profile_id=${profileId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setHasReviewed(true);
        }
      }
    } catch (error) {
      console.error('Error al verificar la reseña:', error);
    }
  };

  const submitComment = async () => {
    if (hasReviewed) {
      alert('Ya has dejado una reseña para esta película.');
      return;
    }

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
        if (response.status === 409) {
          alert('Ya haz reseñado esta película.');
        } else {
          console.error(`Error en la respuesta del servidor: ${response.status} - ${errorText}`);
          alert('Hubo un error en el servidor');
        }
        return;
      }

      const data = await response.json();
      alert('Comentario enviado correctamente');
      setComment('');
      setRating(0);
      setHasReviewed(true);
      setComments([...comments, data.data]); // Actualiza el estado de los comentarios
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
        disabled={hasReviewed}
      ></textarea>
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={submitComment}
        disabled={hasReviewed}
      >
        {hasReviewed ? 'Ya has dejado una reseña' : 'Enviar'}
      </button>
      <h4 className="text-lg font-bold text-white mt-8 mb-4">Comentarios anteriores:</h4>
      <div className="max-h-64 overflow-y-auto bg-gray-800 p-4 rounded-lg shadow-lg">
        {comments.length > 0 ? (
          comments.map((review) => (
            <div key={review.review_id} className="mb-4 p-4 bg-gray-900 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <i className="fas fa-user-circle text-white text-2xl mr-2"></i>
                <p className="text-white font-bold">{review.user_name || 'Anónimo'}</p>
              </div>
              <p className="text-yellow-400"><strong>Calificación:</strong> {review.rating}/5</p>
              <p className="text-gray-300">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-white">No hay comentarios anteriores.</p>
        )}
      </div>
    </section>
  );
};

export default CommentsSection;