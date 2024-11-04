import { useState } from 'react';

const CommentsSection = ({ movieId, initialComments }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState({
    profile_id: '',
    comment: '',
    rating: ''
  });

  // Manejar el cambio de los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment({ ...newComment, [name]: value });
  };

  // Enviar nueva reseña
  const submitReview = async (e) => {
    e.preventDefault();

    // Agregar movie_id al comentario
    const reviewToSubmit = { ...newComment, movie_id: movieId };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewToSubmit)
      });

      if (response.ok) {
        const savedReview = await response.json();
        // Actualizar la lista de comentarios con la nueva reseña
        setComments([...comments, savedReview.data]);
        // Limpiar el formulario
        setNewComment({ profile_id: '', comment: '', rating: '' });
      } else {
        console.log('Error al enviar la reseña');
      }
    } catch (error) {
      console.error('Error al enviar la reseña:', error);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">Reseñas</h3>
      
      {comments.length > 0 ? (
        <ul className="mb-4">
          {comments.map((comment) => (
            <li key={comment.review_id} className="text-gray-300 mb-2">
              <strong>Usuario {comment.profile_id}:</strong> {comment.comment} ({comment.rating}/5)
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">Aún no hay reseñas. ¡Sé el primero en dejar una!</p>
      )}

      <form onSubmit={submitReview} className="mt-6">
        <div>
          <label htmlFor="profile_id" className="block text-white mb-1">Usuario:</label>
          <input
            type="text"
            id="profile_id"
            name="profile_id"
            value={newComment.profile_id}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="comment" className="block text-white mb-1">Comentario:</label>
          <textarea
            id="comment"
            name="comment"
            value={newComment.comment}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="rating" className="block text-white mb-1">Calificación:</label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={newComment.rating}
            onChange={handleInputChange}
            min="0"
            max="5"
            step="0.5"
            className="w-full p-2 mb-4 rounded"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Enviar Reseña
        </button>
      </form>
    </div>
  );
};

export default CommentsSection;
