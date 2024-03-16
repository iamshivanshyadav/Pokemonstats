// App.tsx
import React, { useState, useEffect } from "react";
import {
  getPokemonList,
  getPokemonDetails,
} from "../../services/pokemonService";
import Modal from "../Modal/Modal";
import "./App.css";
import { debounce } from "../../utils/debounce";

interface Ability {
  name: string;
}

interface Type {
  name: string;
}

interface Stat {
  stat: { name: string };
  base_stat: number;
}

interface Pokemon {
  id: number;
  name: string;
  abilities: { ability: Ability }[];
  types: { type: Type }[];
  stats: Stat[];
}

const App: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [pokemonTypes, setPokemonTypes] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchPokemonData();
  }, []);

  const fetchPokemonData = async () => {
    try {
      const response = await getPokemonList(20);
      const updatedPokemonList: Pokemon[] = await fetchAllPokemonTypes(
        response.data.results
      );
      setPokemonList(updatedPokemonList);
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
    }
  };

  const fetchAllPokemonTypes = async (
    pokemonList: any[]
  ): Promise<Pokemon[]> => {
    try {
      const typesPromises = pokemonList.map((pokemon) =>
        getPokemonDetails(pokemon.url)
      );
      const typesResponses = await Promise.all(typesPromises);
      const updatedPokemonList = typesResponses.map(
        (response) => response.data as Pokemon
      );
      const typesData = updatedPokemonList.map((pokemon) =>
        pokemon.types.map((type) => type.type.name)
      );
      const uniqueTypes = Array.from(new Set(typesData.flat()));
      setPokemonTypes(uniqueTypes);
      return updatedPokemonList;
    } catch (error) {
      console.error("Error fetching Pokemon types:", error);
      return [];
    }
  };

  const handlePokemonClick = async (id: number) => {
    try {
      const response = await getPokemonDetails(
        `https://pokeapi.co/api/v2/pokemon/${id}/`
      );
      setSelectedPokemon(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching Pokemon details:", error);
    }
  };

  const closeModal = () => {
    setSelectedPokemon(null);
    setIsModalOpen(false);
  };

  const filteredPokemonList = pokemonList.filter((pokemon) => {
    const lowercaseName = pokemon.name.toLowerCase();
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    const isNameMatched = lowercaseName.includes(lowercaseSearchTerm);
    const isTypeMatched =
      !filterType ||
      (pokemon.types &&
        pokemon.types.some((type) => type.type.name === filterType));
    return isNameMatched && isTypeMatched;
  });

  return (
    <div className="main-container">
      <h1>Pokemon Stats</h1>
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search Pokemon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="">All Types</option>
          {pokemonTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="pokemon-grid">
        {filteredPokemonList.map((pokemon, index) => (
          <div
            key={index}
            className="pokemon-card"
            onClick={() => handlePokemonClick(pokemon.id)}
          >
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
              alt={pokemon.name}
              className="pokemon-image"
            />
            <p className="pokemon-name">{pokemon.name}</p>
          </div>
        ))}
      </div>

      {isModalOpen && selectedPokemon && (
        <Modal pokemon={selectedPokemon} onClose={closeModal} />
      )}
    </div>
  );
};

export default App;
