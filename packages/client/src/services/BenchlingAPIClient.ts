/**
 * Benchling REST API client with OAuth2 authentication.
 * Uses browser-native fetch with credentials from Vite env vars.
 */

// REST API response types — camelCase, matching actual Benchling API responses

export interface BenchlingAPIField {
	value: any;
	type: string;
	displayValue?: string;
	textValue?: string;
	unit?: string | null;
	isMulti?: boolean;
}

export interface BenchlingAPIAssayResult {
	id: string;
	createdAt: string;
	modifiedAt: string;
	schema: {id: string; name: string};
	fields: Record<string, BenchlingAPIField>;
	projectId?: string;
	entryId?: string | null;
	creator?: {id: string; name: string; handle: string};
	isReviewed: boolean;
	validationStatus?: string;
}

export interface BenchlingAPIContainer {
	id: string;
	name: string;
	barcode?: string;
	createdAt: string;
	schema: {id: string; name: string};
	parentStorageSchema?: {id: string; name: string};
	parentStorageId?: string;
	projectId?: string;
	checkoutRecord?: {status: string; modifiedAt: string};
	creator?: {id: string; name: string; handle: string};
}

export interface BenchlingAPIEntry {
	id: string;
	name: string;
	displayId?: string;
	createdAt: string;
	modifiedAt: string;
	authors: Array<{id: string; name: string; handle: string}>;
	creator?: {id: string; name: string; handle: string};
	folderId?: string;
	schema?: {id: string; name: string} | null;
}

export interface BenchlingAPIDNASequence {
	id: string;
	name: string;
	bases?: string;
	length: number;
	isCircular: boolean;
	createdAt: string;
	schema?: {id: string; name: string} | null;
}

interface TokenCache {
	token: string;
	expiresAt: number;
}

class BenchlingAPIClient {
	private readonly baseUrl: string;
	private readonly clientId: string;
	private readonly clientSecret: string;
	private tokenCache: TokenCache | null = null;

	constructor() {
		this.baseUrl = (import.meta.env.VITE_BENCHLING_URL as string | undefined)?.replace(/\/$/, '') ?? '';
		this.clientId = (import.meta.env.VITE_BENCHLING_CLIENT_ID as string | undefined) ?? '';
		this.clientSecret = (import.meta.env.VITE_BENCHLING_CLIENT_SECRET as string | undefined) ?? '';
	}

	private async getAccessToken(): Promise<string> {
		if (this.tokenCache && Date.now() < this.tokenCache.expiresAt) {
			return this.tokenCache.token;
		}
		const credentials = btoa(`${this.clientId}:${this.clientSecret}`);
		const res = await fetch(`${this.baseUrl}/api/v2/token`, {
			method: 'POST',
			headers: {
				Authorization: `Basic ${credentials}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: 'grant_type=client_credentials',
		});
		if (!res.ok) throw new Error(`Benchling auth failed: ${res.status}`);
		const data = await res.json();
		this.tokenCache = {token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000};
		return this.tokenCache.token;
	}

	private async get<T>(path: string, params?: Record<string, string>): Promise<T> {
		const token = await this.getAccessToken();
		const url = new URL(`${this.baseUrl}/api/v2${path}`);
		if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
		const res = await fetch(url.toString(), {headers: {Authorization: `Bearer ${token}`}});
		if (!res.ok) throw new Error(`Benchling API error ${res.status}: ${path}`);
		return res.json();
	}

	private async getAllPages<T>(path: string, responseKey: string, maxResults = 500): Promise<T[]> {
		const results: T[] = [];
		let nextToken: string | undefined;
		do {
			const params: Record<string, string> = {pageSize: '50'};
			if (nextToken) params.nextToken = nextToken;
			const page = await this.get<any>(path, params);
			results.push(...(page[responseKey] ?? []));
			nextToken = page.nextToken;
		} while (nextToken && results.length < maxResults);
		return results;
	}

	async getAssayResults(): Promise<BenchlingAPIAssayResult[]> {
		return this.getAllPages<BenchlingAPIAssayResult>('/assay-results', 'assayResults');
	}

	async getContainers(): Promise<BenchlingAPIContainer[]> {
		return this.getAllPages<BenchlingAPIContainer>('/containers', 'containers');
	}

	async getEntries(): Promise<BenchlingAPIEntry[]> {
		return this.getAllPages<BenchlingAPIEntry>('/entries', 'entries');
	}

	async getDNASequences(): Promise<BenchlingAPIDNASequence[]> {
		return this.getAllPages<BenchlingAPIDNASequence>('/dna-sequences', 'dnaSequences');
	}
}

export const benchlingAPIClient = new BenchlingAPIClient();

