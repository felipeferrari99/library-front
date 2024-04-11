import libraryAPI from "../axios/config";

export const loginRequest = async (username, password) => {
  try {
    const response = await libraryAPI.post('/login', {
      'username': username,
      'password': password,
    })
    return response.data
  } catch (error) {
    throw error;
  }
}

export const registerRequest = async (username, email, password) => {
  try {
    const response = await libraryAPI.post('/register', {
      'username': username,
      'email': email,
      'password': password,
    })
    return response.data
  } catch (error) {
    throw error;
  }
}

export const getUser = async (id) => {
  try {
    const response = await libraryAPI.get(`/user/${id}`);
    return response.data
  } catch (error) {
    throw error;
  }
}

export const updateUser = async (id, email, password, description) => {
  try {
    await libraryAPI.put(`/user/${id}`, {
      'email': email,
      'password': password,
      'description': description,
    });
  } catch (error) {
    throw error;
  }
}

export const changeImage = async (id, formData) => {
  try {
    const response = await libraryAPI.put(`/user/${id}/image`, formData);
    return response.data
  } catch (error) {
    throw error;
  }
}

export const alterFavorite = async (id) => {
  try {
    await libraryAPI.put(`/books/${id}/favorite`);
  } catch (error) {
    console.log(error)
  }
}