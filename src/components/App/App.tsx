import css from "./App.module.css";
import { useState } from "react";
import { fetchNotes } from "../../services/noteService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import Modal from "../Modal/Modal";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setModalIsOpen] = useState(false);

  const handleSearch = useDebouncedCallback((search: string) => {
    setDebouncedSearch(search);
  }, 300);

  const searchQueryChange = (search: string) => {
    setSearch(search);
    setPage(1);
    handleSearch(search);
  };

  const { data, isSuccess } = useQuery({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    enabled: true,
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={searchQueryChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data?.totalPages}
            onPageChange={setPage}
          />
        )}
        <button
          className={css.button}
          type="button"
          onClick={() => setModalIsOpen(true)}
        >
          Create note +
        </button>
      </header>
      {isSuccess && data?.notes?.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>No notes found</p>
      )}
      {isModalOpen && (
        <Modal onClose={() => setModalIsOpen(false)}>
          <NoteForm onClose={() => setModalIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
