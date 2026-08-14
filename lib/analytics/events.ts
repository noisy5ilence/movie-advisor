type ShowRef = { showId: Show['id']; showType: Show['type']; showTitle: string };

export type ListName = 'popular' | 'top' | 'search' | 'favorite' | 'watchlist' | 'random';

export type AnalyticsEvents = {
  show_viewed: ShowRef & { surface: 'page' | 'modal' };
  person_viewed: { personId: string; personName: string };
  list_loaded_more: { list: ListName; page: number };
  random_shuffled: { index: number; showTitle: string };

  search_performed: { query: string; showType: Show['type']; results: number };
  gallery_tab_changed: { tab: string };

  library_toggled: ShowRef & { list: 'favorite' | 'watchlist'; value: boolean };
  auth_completed: void;
  auth_signed_out: void;

  torrents_searched: ShowRef & { provider: string; results: number };
  torrent_selected: ShowRef & {
    provider: string;
    torrentTitle: string;
    seeders: number;
    quality?: string;
    source?: string;
    codec?: string;
  };
  playback_started: ShowRef;
  playback_failed: ShowRef & { reason: string };
  subtitles_selected: { language: string };
};

export type AnalyticsEvent = keyof AnalyticsEvents;
