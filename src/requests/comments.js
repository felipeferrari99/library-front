import libraryAPI from "../axios/config";

export const newComment = async (id, body, starRating) => {
    try {
        const response = await libraryAPI.post(`/books/${id}/comments`, {
            'body': body,
            'rating': starRating,
        });
        return response.data
    } catch (error) {
        throw error;
    }
}

export const deleteComment = async (id, commentId) => {
    try {
        const response = libraryAPI.delete(`/books/${id}/comments/${commentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}