import libraryAPI from "../axios/config";

export const getAuthors = async (search) => {
    try {
      const response = await libraryAPI.get("/authors", { params: { search } });
      return response.data;
    } catch (error) {
      console.log(error);
    }
};

export const getAuthor = async (id) => {
    try {
      const response = await libraryAPI.get(`/authors/${id}`)
      return response.data
    } catch (error) {
        console.log(error);
    }
}

export const newAuthor = async (formData) => {
    try {
        const response = await libraryAPI.post(`/authors`, formData);
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const updateAuthor = async (id, name, description) => {
    try {
        await libraryAPI.put(`/authors/${id}`, {
            'name': name,
            'description': description,
        });
    } catch (error) {
        console.log(error);
    }
}

export const changeImage = async (id, formData) => {
    try {
        const response = await libraryAPI.put(`/authors/${id}/image`, formData);
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const deleteAuthor = async (id) => {
    try {
        const response = libraryAPI.delete(`/authors/${id}`);
        return response.data;
    } catch (error) {
        console.log(error)
    }
}