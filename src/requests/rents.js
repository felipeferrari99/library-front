import libraryAPI from "../axios/config";

export const getBooks = async () => {
    try {
      const response = await libraryAPI.get("/available");
      return response.data;
    } catch (error) {
      console.log(error);
    }
};

export const getAllRents = async () => {
    try {
      const response = await libraryAPI.get("/allRents");
      return response.data;
    } catch (error) {
      console.log(error);
    }
};

export const getMyRents = async () => {
    try {
      const response = await libraryAPI.get("/myRents");
      return response.data;
    } catch (error) {
      console.log(error);
    }
};

export const newRent = async (id, days) => {
    try {
        const response = await libraryAPI.post(`/${id}/rent`, {
            'daysRented': days
        });
        return response.data
    } catch (error) {
        throw error;
    }
}

export const returnBook = async (id) => {
    try {
        const response = libraryAPI.post(`/return/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}