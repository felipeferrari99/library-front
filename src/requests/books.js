import libraryAPI from "../axios/config";

export const getBooks = async (search) => {
    try {
      const response = await libraryAPI.get("/books", { params: { search } });
      return response.data;
    } catch (error) {
      console.log(error);
    }
};

export const getBook = async (id) => {
    try {
      const response = await libraryAPI.get(`/books/${id}`)
      return response.data
    } catch (error) {
        console.log(error);
    }
}

export const newBook = async (formData) => {
    try {
        const response = await libraryAPI.post(`/books`, formData);
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const updateBook = async (id, title, author, description, release_date, qty_available) => {
    try {
        await libraryAPI.put(`/books/${id}`, {
            'title': title,
            'author': author,
            'description': description,
            'release_date': release_date,
            'qty_available': qty_available,
        });
    } catch (error) {
        console.log(error);
    }
}

export const changeImage = async (id, formData) => {
    try {
        const response = await libraryAPI.put(`/books/${id}/image`, formData);
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const deleteBook = async (id) => {
    try {
        const response = libraryAPI.delete(`/books/${id}`);
        return response.data;
    } catch (error) {
        console.log(error)
    }
}