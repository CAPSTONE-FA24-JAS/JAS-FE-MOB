export interface Notification {
  id: number;
  title: string;
  description: string;
  is_Read: boolean;
  notifiableId: number;
  notifi_Type: string;
  accountId: number;
  imageLink: string;
  creationDate: string;
  statusOfValuation: any;
}

export default {};
