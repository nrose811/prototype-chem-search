/**
 * TypeScript type definitions for Benchling data entities
 * Based on Benchling MCP Server v0.2.0
 */

// ============================================================================
// DNA Sequences
// ============================================================================

export interface DNASequence {
	id: string;
	name: string;
	bases?: string;
	length: number;
	is_circular: boolean;
	folder_id?: string;
	schema_id?: string;
	registry_id?: string;
	created_at?: string;
	modified_at?: string;
}

export interface DNASequenceFilters {
	name?: string;
	name_includes?: string;
	folder_id?: string;
	project_id?: string;
	registry_id?: string;
	schema_id?: string;
	modified_at?: string;
	created_at?: string;
	creator_ids?: string[];
	max_results?: number;
}

// ============================================================================
// Custom Entities (Registry)
// ============================================================================

export interface CustomEntity {
	id: string;
	name: string;
	schema_id?: string;
	folder_id?: string;
	registry_id?: string;
	created_at?: string;
	modified_at?: string;
	fields?: Record<string, any>;
}

export interface CustomEntityFilters {
	schema_id?: string;
	name?: string;
	name_includes?: string;
	folder_id?: string;
	project_id?: string;
	registry_id?: string;
	modified_at?: string;
	created_at?: string;
	creator_ids?: string[];
	max_results?: number;
}

// ============================================================================
// Assay Results
// ============================================================================

export interface AssayResult {
	id: string;
	schema_id?: string;
	created_at?: string;
	modified_at?: string;
	fields?: Record<string, any>;
}

export interface AssayResultFilters {
	schema_id?: string;
	entity_ids?: string[];
	assay_run_ids?: string[];
	created_at_gt?: string;
	created_at_gte?: string;
	created_at_lt?: string;
	created_at_lte?: string;
	modified_at_gt?: string;
	modified_at_gte?: string;
	modified_at_lt?: string;
	modified_at_lte?: string;
	max_results?: number;
}

// ============================================================================
// Inventory
// ============================================================================

export interface Container {
	id: string;
	name: string;
	barcode?: string;
	schema_id?: string;
	parent_storage_id?: string;
	created_at?: string;
	modified_at?: string;
}

export interface Plate {
	id: string;
	name: string;
	barcode?: string;
	schema_id?: string;
	parent_storage_id?: string;
	created_at?: string;
	modified_at?: string;
}

export interface Box {
	id: string;
	name: string;
	barcode?: string;
	schema_id?: string;
	parent_storage_id?: string;
	created_at?: string;
	modified_at?: string;
}

export interface InventoryFilters {
	schema_id?: string;
	name?: string;
	name_includes?: string;
	barcode?: string;
	modified_at?: string;
	created_at?: string;
	creator_ids?: string[];
	max_results?: number;
}

// ============================================================================
// Notebook Entries
// ============================================================================

export interface NotebookEntry {
	id: string;
	name: string;
	display_id?: string;
	folder_id?: string;
	schema_id?: string;
	created_at?: string;
	modified_at?: string;
}

export interface NotebookEntryFilters {
	name?: string;
	project_id?: string;
	folder_id?: string;
	schema_id?: string;
	modified_at?: string;
	creator_ids?: string[];
	author_ids_any_of?: string[];
	review_status?: string;
	max_results?: number;
}

// ============================================================================
// MCP Tool Response Types
// ============================================================================

export interface MCPToolResponse<T> {
	content: Array<{
		type: string;
		text?: string;
		data?: T;
	}>;
	isError?: boolean;
}

