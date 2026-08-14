type ShowRef = { showId: Show['id']; showType: Show['type'] };

export type ListName = 'popular' | 'top' | 'search' | 'favorite' | 'watchlist' | 'random';

/**
 * The whole analytics surface of the app. Adding an event means adding a line here first,
 * which keeps names and payloads consistent and makes `track` calls type checked.
 */
export type AnalyticsEvents = {
  show_viewed: ShowRef & { title: string; surface: 'page' | 'modal' };
  person_viewed: { personId: string };
  list_loaded_more: { list: ListName; page: number };
  random_shuffled: { index: number };

  search_performed: { query: string; showType: Show['type']; results: number };
  gallery_tab_changed: { tab: string };

  library_toggled: ShowRef & { list: 'favorite' | 'watchlist'; value: boolean };
  auth_completed: EmptyPayload;
  auth_signed_out: EmptyPayload;

  torrents_searched: ShowRef & { provider: string; results: number };
  torrent_selected: { provider: string; seeders: number; quality?: string; source?: string; codec?: string };
  playback_started: ShowRef & { quality?: string };
  playback_failed: ShowRef & { reason: string };
  subtitles_selected: { language: string };
};

export type EmptyPayload = Record<string, never>;

export type AnalyticsEvent = keyof AnalyticsEvents;
