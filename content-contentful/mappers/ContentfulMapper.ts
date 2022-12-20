import { EntryCollection, Entry } from 'contentful';

export class ContentfulMapper {
  static contentfulEntriesToFrontasticEntries(entries: EntryCollection<unknown>) {
    return entries;
  }

  static contentfulEntryToFrontasticEntry(entry: Entry<unknown>) {
    return entry;
  }
}
