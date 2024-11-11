export interface Notification {
  id: number;
  title: string;
  description: string;
  is_Read: boolean;
  notifiableId: number;
  notifi_Type: string;
  accountId: number;
  imageNoti: string;
}
