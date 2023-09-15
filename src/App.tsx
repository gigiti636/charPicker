import { useEffect, useState, useDeferredValue } from 'react';
import './App.css';
import axios, { AxiosResponse } from 'axios';

type Character = {
  id: number;
  name: string;
  image: string;
};

const firstPage = 1;
const lastPage = 40;

function App() {
  const [page, setPage] = useState<null | number>(null);
  const [chars, setChars] = useState<Character[] | null>(null);
  //display the page we are at
  //we can add also arrows for next and previous page
  //we can add also a search bar , //we will then have to set pages too because their number changes after search

  //show a loader while fetching
  // we can add a try catch here and handle the error
  //abort previous request when one is happening or prevent it by loading
  const fetchChars = async () => {
    if (page) {
      const response: AxiosResponse<{ results: Character[] }> = await axios.get(
        `https://rickandmortyapi.com/api/character/?page=${page}`,
        { params: { name: '' } }
      );
      const charToRender = response?.data?.results ?? [];
      setChars(charToRender);
    }
  };

  useEffect(() => {
    fetchChars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  //this is an extra point
  const render_chars = useDeferredValue(chars);

  //css improvements
  //responsive design

  //extra point to making the card a component for re-usability

  //extra point for building a modal for when clicking on a card to show more information
  return (
    <div className="App">
      <header>
        <div>Pick a Page</div>
        <input
          value={page ? page : ''}
          type={'range'}
          min={firstPage}
          max={lastPage}
          step={1}
          style={{ width: '600px' }}
          onChange={(event) => setPage(Number(event.target.value))}
        />
      </header>
      <main className={'card-wrapper'}>
        {render_chars &&
          render_chars.map((char) => (
            <div className="card" key={char.id}>
              <img src={char.image} alt="Avatar" style={{ width: '100%' }} />
              <div className="container">
                <h4>
                  <b>{char.name}</b>
                </h4>
              </div>
            </div>
          ))}
      </main>
    </div>
  );
}

export default App;
