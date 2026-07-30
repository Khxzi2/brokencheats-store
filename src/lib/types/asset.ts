export interface Asset {
  id: string;
  title: string;
  category: string;
  slug: string;
  direct_download_url?: string | null;
  file_path?: string | null;
  image_url?: string | null;
  gallery_images?: string[] | null;
  video_url?: string | null;
  audio_url?: string | null;
  youtube_video_id?: string | null;
  instructions?: string | null;
  ad_fly_link?: string | null;
  download_count: number;
  status: 'active' | 'hidden';
  created_at?: string;
}

export type AssetInput = Omit<Asset, 'id' | 'download_count' | 'created_at'>;

export interface AdConfig {
  headerBannerHtml?: string;
  sidebarBannerHtml?: string;
  popUnderScriptUrl?: string;
  interstitialEnabled?: boolean;
}
