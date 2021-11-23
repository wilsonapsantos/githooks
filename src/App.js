import React, { useState, useEffect } from "react";


function App() {

  const [location, setLocation] = useState({});

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(handlePositionReceived);

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  function handlePositionReceived({ coords }) {
    const { latitude, longitude } = coords;

    setLocation({ latitude, longitude });
  }

  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    async function fetchRepositories() {
      const response = await fetch('https://api.github.com/users/wilsonapsantos/repos');
      const data = await response.json();

      setRepositories(data);
    };

    fetchRepositories();
  }, []);

  useEffect(() => {
    const filtered = repositories.filter(repo => repo.favorite);

    document.title = `Você tem ${filtered.length} favoritos`;
  }, [repositories])

  function handleFavorite(id) {
    const newRepositories = repositories.map(repo => {
      return repo.id === id ? { ...repo, favorite: !repo.favorite } : repo
    });

    setRepositories(newRepositories);
  }

  return (
    <>
      <div>
        <h2>Minha localização:</h2>
        Latitude: {location.latitude} <br />
        Longitude: {location.longitude}
      </div>
      <hr></hr>
      <div>
        <h2>Meus repositórios:</h2>
        <ul>
          {repositories.map(repo => (
            <li key={repo.id}>
              {repo.name}
              {repo.favorite && <span style={{ marginLeft: "1rem" }}>(Favorito)</span>}
              <button style={{ marginLeft: "1rem" }} onClick={() => handleFavorite(repo.id)}>Favoritar</button></li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
