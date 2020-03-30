import axios from 'axios';
import callService from './callService';

export const fetchData = async (url) =>{
  if ((window as any).isVscode) {
    return await callService('material', 'fetchData', url);
  } else {
    const { data } = await axios.get(url);
    return data;
  }
}
