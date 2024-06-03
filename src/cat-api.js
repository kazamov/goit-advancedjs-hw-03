const API_URL = 'https://api.thecatapi.com/v1';
const API_KEY = import.meta.env.VITE_CAT_API_KEY;

export async function fetchBreeds() {
  try {
    const response = await fetch(API_URL + '/breeds', {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cat breeds');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch cat breeds');
  }
}

export async function fetchCatByBreed(breedId) {
  try {
    const response = await fetch(
      API_URL + `/images/search?breed_id=${breedId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        redirect: 'follow',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch cat by breed');
    }

    const data = await response.json();

    if (data.length === 0) {
      throw new Error('No cat found by breed');
    }

    return data[0];
  } catch (error) {
    throw new Error('Failed to fetch cat by breed');
  }
}
