import { createClient, ContentfulClientApi, CreateClientParams } from 'contentful';
import { ContentfulMapper } from '../mappers/ContentfulMapper';

export default class BaseApi {
  private client: ContentfulClientApi;
  private locale: string;

  constructor(params: CreateClientParams, locale?: string) {
    this.client = createClient(params);
    this.locale = this.mapLocale(locale);
  }

  private mapLocale(locale?: string) {
    return { en: 'en-US' }[locale ?? ''] ?? 'en-US';
  }

  async getEntries() {
    const data = await this.client.getEntries({ locale: this.locale });
    return ContentfulMapper.contentfulEntriesToFrontasticEntries(data);
  }

  async getEntry(id: string) {
    const data = await this.client.getEntry(id, { locale: this.locale });
    return ContentfulMapper.contentfulEntryToFrontasticEntry(data);
  }
}
