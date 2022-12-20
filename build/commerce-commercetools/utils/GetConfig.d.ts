import { Project } from '@frontastic/extension-types';
import { ClientConfig } from '../interfaces/ClientConfig';
export declare const getConfig: (project: Project, engine: string, locale: string | null) => ClientConfig;
