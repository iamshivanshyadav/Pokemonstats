import axios from 'axios';

export const getPokemonList = async (limit: number) => {
  return axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
};

export const getPokemonDetails = async (url: string) => {
  return axios.get(url);
};
