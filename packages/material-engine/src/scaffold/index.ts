import axios from 'axios';

export async function getAll(source: string) {
  const response = await axios.get(source);
  return response.data.scaffolds;
}
