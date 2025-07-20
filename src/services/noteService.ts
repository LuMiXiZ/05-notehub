import axios from "axios";
import type { Note, NoteTag } from "../types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_SWAGGER_TOKEN;
const myApiToken = `Bearer ${token}`;
axios.defaults.headers.common["Authorization"] = myApiToken;

interface NoteSearchResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export async function fetchNotes({
  page = 1,
  perPage = 12,
  search,
}: FetchNotesParams): Promise<NoteSearchResponse> {
  const params: FetchNotesParams = {
    page,
    perPage,
  };
  if (search && search.trim() !== "") {
    params.search = search.trim();
  }
  const response = await axios.get(`/notes`, { params });
  return response.data;
}

export async function createNote(note: {
  title: string;
  content: string;
  tag: NoteTag;
}): Promise<Note> {
  const response = await axios.post<Note>("/notes", note);
  return response.data;
}

export async function deleteNote(id: number): Promise<Note> {
  const response = await axios.delete<Note>(`/notes/${id}`);
  return response.data;
}
