export interface Media {
  id: string;
  chatId: number;
  userId: string;
  picture: Picture;
  fileType: string;
}

interface Picture {
  type: number;
  data: string;
}
