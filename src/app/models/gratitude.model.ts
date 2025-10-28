export interface Gratitude {
  systemTimestamp: string; // when the system stored the entry
  clientTimezone: string;  // IANA timezone id from the client
  id: string;              // entry id (uuid)
  userId: string;          // owner id
  entry: string;           // the gratitude text
  timestamp: string;       // the client/local moment of the entry
}
