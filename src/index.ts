import axios from 'axios';

async function fetchUser(user: string) {
  try {
    const response = await axios.get(`https://api.github.com/users/${user}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

fetchUser('milliorn')
  .then(data => console.log('User data:', data))
  .catch(error => console.error('Error:', error));
