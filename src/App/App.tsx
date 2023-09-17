import { useEffect, useState, useRef } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';
import './App.css';

type Character = {
  id: number;
  name: string;
  image: string;
};

type ApiResponse = { results: Character[]; info: { pages: number } };
type ApiErrorResponse = { error: string };

function App() {
  const [page, setPage] = useState<number>(1);
  const [chars, setChars] = useState<Character[]>([]);
  const [error, setError] = useState('');

  const search_term = useRef('');
  const startPage = useRef(1);
  const endPage = useRef(42);

  let cancelController = useRef<AbortController | null>(null);
  const fetchChars = async () => {
    try {
      if (cancelController.current) {
        cancelController.current.abort();
      }

      cancelController.current = new AbortController();
      const { signal } = cancelController.current;
      if (page) {
        const response: AxiosResponse<ApiResponse> = await axios.get(
          `https://rickandmortyapi.com/api/character/?page=${page}`,
          {
            params: { name: search_term.current },
            headers: {
              'Cache-Control': 'max-age=3600',
            },
            signal,
          }
        );

        cancelController.current = null;

        endPage.current = response.data.info.pages;
        const charToRender = response?.data?.results ?? [];
        setError('');
        setChars(charToRender);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;

        if (axiosError.response) {
          setError(`${axiosError.response.data.error} for search "${search_term.current}"`);
          search_term.current = '';
        } else {
          setError(axiosError.message);
        }
      }
    }
  };

  useEffect(() => {
    fetchChars();
  }, [page]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    setPage(1);
    if (event.key === 'Enter') {
      fetchChars();
    }
  };

  return (
    <div className="App">
      <header>
        <h4 style={{ marginTop: 0, marginBottom: '10px' }}>All Rick And Morty Characters</h4>
        <div style={{ color: 'red' }}>{error}</div>
        <div className={'btn-wrapper'}>
          <button
            className={'act-btn'}
            onClick={() => setPage(page - 1)}
            disabled={page === startPage.current}
          >
            Prev
          </button>
          <div>
            <div style={{ marginLeft: '20px', marginRight: '20px' }}>
              <span>
                {page} <small>of</small> {endPage.current} <small>pages</small>
              </span>
              <span>
                <input
                  placeholder={'Search '}
                  style={{ opacity: search_term.current === '' ? 0.8 : 1, marginLeft: '10px' }}
                  type={'text'}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    (search_term.current = event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={() => {
                    setPage(1);
                    fetchChars();
                  }}
                >
                  Go
                </button>
              </span>
            </div>
            <div>
              <input
                value={page ? page : ''}
                type={'range'}
                min={startPage.current}
                max={endPage.current}
                step={1}
                style={{ width: '90%' }}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setPage(Number(event.target.value))
                }
              />
            </div>
          </div>
          <button
            className={'act-btn'}
            onClick={() => setPage(page + 1)}
            disabled={page === endPage.current}
          >
            Next
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'center' }}></div>
      </header>
      <main className={'card-wrapper'}>
        {chars.map((char) => (
          <div className="card" key={char.id}>
            <img src={char.image} alt="Avatar" style={{ width: '100%' }} />
            <div className="container">
              <div>
                <b>{char.name}</b>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
