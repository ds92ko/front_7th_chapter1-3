import { Event } from '@/types';

type DialogMode = 'edit' | 'delete';

export interface RecurringEventDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (_editSingleOnly: boolean) => void;
  event: Event | null;
  mode?: DialogMode;
}

export interface OverlapEventDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  events: Event[];
}
