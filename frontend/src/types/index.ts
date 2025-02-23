import { GoogleMapState } from '@/store/googleMapSlice';
import { PlaceState } from '@/store/placeSlice';
import { ToastState } from '@/store/toastSlice';
import { AuthState } from '@/store/userSlice';

export type Place = {
  id: number;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  google_place_id: string;
  detail_page_url: string;
  thumbnail_url: string;
  rating: number;
  formed_address: string;
  category?: string;
};

export type CoursePlace = Place & CustomPlace & CourseOrder;

export type PlaceWithOrder = {
  placeId: number;
  comment: string;
  order: number;
};

export type CourseOrder = {
  order: number;
};

export type Map = {
  id: number;
  user: User;
  title: string;
  isPublic: boolean;
  thumbnailUrl: string;
  description: string;
  pinCount: number;
  places: (Place & CustomPlace)[];
};

export type Course = {
  id: number;
  user: User;
  title: string;
  isPublic: boolean;
  thumbnailUrl: string;
  description: string;
  pinCount: number;
  places: CoursePlace[];
};

export type PaginatedList<T, K extends string> = {
  [P in K]: T[];
} & {
  totalPages: number;
  currentPage: number;
};
export type MapList = PaginatedList<MapItemType, 'maps'>;
export type CourseList = PaginatedList<MapItemType, 'courses'>;

export type CreateMapType = 'MAP' | 'COURSE';

export type BaseMap = {
  title: string;
  thumbnailUrl?: string;
  description: string;
  isPublic: boolean;
  mode: CreateMapType;
};

export type MapItemType = {
  id: number;
  user: User;
  title: string;
  isPublic: boolean;
  thumbnailUrl: string;
  description: string;
  pinCount: number;
  createdAt: string;
};

export type User = {
  id: number;
  nickname: string;
  profileImageUrl: string;
};

export type MarkerColor =
  | 'RED'
  | 'ORANGE'
  | 'YELLOW'
  | 'GREEN'
  | 'BLUE'
  | 'PURPLE';
export type MarkerCategory = 'restaurant' | 'cafe' | 'attraction' | string;

export type PlaceMarker = {
  placeId: number;
  color: MarkerColor;
  category: MarkerCategory;
};

export type CustomPlace = {
  placeId: number;
  color: MarkerColor;
  comment: string;
};

export type PreSignedURLResponse = {
  fields: {
    'Content-Type': string;
    Policy: string;
    'X-Amz-Algorithm': string;
    'X-Amz-Credential': string;
    'X-Amz-Date': string;
    'X-Amz-Signature': string;
    acl: string;
    bucket: string;
    key: string;
  };
  uploadedUrl: string;
  url: string;
};

export type StoreState = GoogleMapState & PlaceState & ToastState & AuthState;
