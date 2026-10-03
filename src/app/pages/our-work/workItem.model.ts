export interface WorkItem {
  id: number;
  type: 'image' | 'video';
  src: string;
  poster?: string;
}