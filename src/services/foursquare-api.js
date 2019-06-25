import axios from 'axios';

const foursquareAPI = axios.create({
  baseURL: 'https://api.foursquare.com/v2'
});

export default foursquareAPI;
