'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useNoteStore } from '@/lib/store/noteStore';
import { NoteFormValues, NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

const TAGS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.back();
    },
  });

  const handleCreate = (formData: FormData) => {
    const note: NoteFormValues = {
      title: String(formData.get('title') || '').trim(),
      content: String(formData.get('content') || '').trim(),
      tag: String(formData.get('tag') || 'Todo') as NoteTag,
    };

    if (!note.title || !note.content) return;

    mutation.mutate(note);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          className={css.input}
          type="text"
          id="title"
          name="title"
          value={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          className={css.textarea}
          id="content"
          name="content"
          value={draft.content}
          onChange={(e) => setDraft({ content: e.target.value })}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          className={css.select}
          id="tag"
          name="tag"
          value={draft.tag}
          onChange={(e) => setDraft({ tag: e.target.value as NoteTag })}
        >
          {TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" onClick={handleCancel} className={css.cancelButton}>
          Cancel
        </button>
        <button
          type="submit"
          formAction={handleCreate}
          disabled={mutation.isPending}
          className={css.submitButton}
        >
          {mutation.isPending ? 'Saving...' : 'Create Note'}
        </button>
      </div>
    </form>
  );
}
