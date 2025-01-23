import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pokemon.css';

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(20); 
  const [hasMore, setHasMore] = useState(true); 


  const fetchPokemons = (offset) => {
    setLoading(true);
    axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=0`)
      .then((response) => {
        const pokemonData = response.data.results;
        const pokemonDetailsPromises = pokemonData.map((pokemon) =>
          axios.get(pokemon.url)
        );

        Promise.all(pokemonDetailsPromises).then((responses) => {
          const pokemonDetails = responses.map((res) => res.data);
          setPokemons((prevPokemons) => [...prevPokemons, ...pokemonDetails]);
          setLoading(false);

          if (pokemonDetails.length < 20) {
            setHasMore(false);
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching Pokémon data: ', error);
        setLoading(false);
      });
  };


  useEffect(() => {
    fetchPokemons(offset);
  }, [offset]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setOffset((prevOffset) => prevOffset); 
    }
  };

// console.log(pokemons.slice(0, 20));

  function downloadJSON()  {
    const first20Pokemons = pokemons.slice(0, 20);
    
      const jsonData = JSON.stringify(first20Pokemons, null, 2); 
      const blob = new Blob([jsonData], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Data.json'; 
      link.click();
    

  };

  return (
    <div>
      <h1>Pokémon List</h1>
      <div className="pokemon-list">
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} className="pokemon-card">
            <h3>{pokemon.name}</h3>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          </div>
        ))}
      </div>
      {loading ? (
        <div>Loading Pokémon...</div>
      ) : (
        <>
          {hasMore && (
            <button onClick={handleLoadMore} className="load-more">
              Read More
            </button>
          )}
          <button onClick={downloadJSON} className="download-json">
            Download Data as JSON
          </button>
        </>
      )}
    </div>
  );
};

export default PokemonList;
