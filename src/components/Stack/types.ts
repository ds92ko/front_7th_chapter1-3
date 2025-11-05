export interface NotificationStackProps {
  notifications: { id: string; message: string }[];
  onClose: (_index: number) => void;
}
