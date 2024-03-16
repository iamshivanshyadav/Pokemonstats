// Modal.tsx
import React from "react";
import "./Modal.css";

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

interface ModalProps {
  pokemon: Pokemon;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ pokemon, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <div className="pokemon-details">
          <div className="pokemon-image-container">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon?.id}.png`}
              alt={pokemon?.name}
              className="pokemon-image"
            />
          </div>
          <div className="pokemon-info">
            <h2 className="pokemon-name">{pokemon?.name}</h2>
            <div className="abilities">
              <h3 className="info-heading">Abilities:</h3>
              <div className="ability">
                {pokemon?.abilities[0]?.ability.name}
              </div>
              <div className="ability">
                {pokemon?.abilities[1]?.ability.name}
              </div>
            </div>
            <div className="types">
              <h3 className="info-heading">Types:</h3>
              {pokemon?.types.map((type, index) => (
                <div key={index} className="type">
                  {type.type.name}
                </div>
              ))}
            </div>
            <div className="base-stats">
              <h3 className="info-heading">Base Stats:</h3>
              <ul>
                {pokemon?.stats.map((stat, index) => (
                  <li key={index}>
                    {stat.stat.name}: {stat.base_stat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
