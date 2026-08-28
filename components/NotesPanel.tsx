import React from 'react';
import { DocumentIcon } from './marketlearn/marketlearn-icons';

interface NotesPanelProps {
  notes: string[];
}

const NotesPanel: React.FC<NotesPanelProps> = ({ notes }) => {
  if (notes.length === 0) return null;

  return (
    <section className="panel panel-soft">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Notes</p>
          <h2>Assumptions and gaps</h2>
        </div>
        <div className="section-chip">
          <DocumentIcon className="section-chip-icon" />
          <span>{notes.length} note{notes.length === 1 ? '' : 's'}</span>
        </div>
      </div>

      <ul className="notes-list">
        {notes.map((note, index) => (
          <li key={`${note}-${index}`}>{note}</li>
        ))}
      </ul>
    </section>
  );
};

export default NotesPanel;
