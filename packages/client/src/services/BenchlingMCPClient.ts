/**
 * Benchling MCP Client
 * Connects to the Benchling MCP Server to fetch life sciences data
 */

import {Client} from "@modelcontextprotocol/sdk/client/index.js";
import {StdioClientTransport} from "@modelcontextprotocol/sdk/client/stdio.js";
import type {
	DNASequence,
	DNASequenceFilters,
	CustomEntity,
	CustomEntityFilters,
	AssayResult,
	AssayResultFilters,
	Container,
	Plate,
	Box,
	InventoryFilters,
	NotebookEntry,
	NotebookEntryFilters,
} from "../types/benchling";

export class BenchlingMCPClient {
	private client: Client | null = null;
	private transport: StdioClientTransport | null = null;
	private isConnected = false;

	/**
	 * Connect to the Benchling MCP Server
	 */
	async connect(): Promise<void> {
		if (this.isConnected) {
			console.log("Already connected to Benchling MCP Server");
			return;
		}

		try {
			// Create stdio transport to communicate with the MCP server
			// Use python -m to run the server since the Scripts dir may not be on PATH
			this.transport = new StdioClientTransport({
				command: import.meta.env.VITE_BENCHLING_MCP_COMMAND || "python",
				args: import.meta.env.VITE_BENCHLING_MCP_COMMAND
					? []
					: ["-m", "benchling_mcp_server.main"],
				env: {
					BENCHLING_URL: import.meta.env.VITE_BENCHLING_URL || "",
					BENCHLING_CLIENT_ID: import.meta.env.VITE_BENCHLING_CLIENT_ID || "",
					BENCHLING_CLIENT_SECRET: import.meta.env.VITE_BENCHLING_CLIENT_SECRET || "",
				},
			});

			// Create MCP client
			this.client = new Client(
				{
					name: "tetra-scientist-client",
					version: "1.0.0",
				},
				{
					capabilities: {},
				},
			);

			// Connect to the server
			await this.client.connect(this.transport);
			this.isConnected = true;
			console.log("✅ Connected to Benchling MCP Server");
		} catch (error) {
			console.error("❌ Failed to connect to Benchling MCP Server:", error);
			throw new Error(`Benchling MCP connection failed: ${error}`);
		}
	}

	/**
	 * Disconnect from the Benchling MCP Server
	 */
	async disconnect(): Promise<void> {
		if (this.client) {
			await this.client.close();
			this.client = null;
		}
		if (this.transport) {
			await this.transport.close();
			this.transport = null;
		}
		this.isConnected = false;
		console.log("Disconnected from Benchling MCP Server");
	}

	/**
	 * Ensure client is connected before making requests
	 */
	private ensureConnected(): void {
		if (!this.isConnected || !this.client) {
			throw new Error("Not connected to Benchling MCP Server. Call connect() first.");
		}
	}

	// ========================================================================
	// DNA Sequences
	// ========================================================================

	async listDNASequences(filters: DNASequenceFilters = {}): Promise<DNASequence[]> {
		this.ensureConnected();
		const result = await this.client!.callTool({
			name: "list_dna_sequences",
			arguments: filters,
		});
		return this.parseToolResponse<DNASequence[]>(result);
	}

	async getDNASequence(sequenceId: string): Promise<DNASequence> {
		this.ensureConnected();
		const result = await this.client!.callTool({
			name: "get_dna_sequence",
			arguments: {sequence_id: sequenceId},
		});
		return this.parseToolResponse<DNASequence>(result);
	}

	// ========================================================================
	// Custom Entities (Registry)
	// ========================================================================

	async listCustomEntities(filters: CustomEntityFilters = {}): Promise<CustomEntity[]> {
		this.ensureConnected();
		const result = await this.client!.callTool({
			name: "list_custom_entities",
			arguments: filters,
		});
		return this.parseToolResponse<CustomEntity[]>(result);
	}

	async getCustomEntity(entityId: string): Promise<CustomEntity> {
		this.ensureConnected();
		const result = await this.client!.callTool({
			name: "get_custom_entity",
			arguments: {entity_id: entityId},
		});
		return this.parseToolResponse<CustomEntity>(result);
	}

	// ========================================================================
	// Assay Results
	// ========================================================================

	async listAssayResults(filters: AssayResultFilters = {}): Promise<AssayResult[]> {
		this.ensureConnected();
		const result = await this.client!.callTool({
			name: "list_assay_results",
			arguments: filters,
		});
		return this.parseToolResponse<AssayResult[]>(result);
	}

	async getAssayResult(resultId: string): Promise<AssayResult> {
		this.ensureConnected();
		const result = await this.client!.callTool({
			name: "get_assay_result",
			arguments: {assay_result_id: resultId},
		});
		return this.parseToolResponse<AssayResult>(result);
	}

	// ========================================================================
	// Inventory - Containers
	// ========================================================================

	async listContainers(filters: InventoryFilters = {}): Promise<Container[]> {
		this.ensureConnected();
		const result = await this.client!.callTool({
			name: "list_containers",
			arguments: filters,
		});
		return this.parseToolResponse<Container[]>(result);
	}

	async getContainer(containerId: string): Promise<Container> {
		this.ensureConnected();
		const result = await this.client!.callTool({
			name: "get_container",
			arguments: {container_id: containerId},
		});
		return this.parseToolResponse<Container>(result);
	}

	// ========================================================================
	// Inventory - Plates
	// ========================================================================

	async listPlates(filters: InventoryFilters = {}): Promise<Plate[]> {
		this.ensureConnected();
		const result = await this.client!.callTool({
			name: "list_plates",
			arguments: filters,
		});
		return this.parseToolResponse<Plate[]>(result);
	}

	async getPlate(plateId: string): Promise<Plate> {
		this.ensureConnected();
		const result = await this.client!.callTool({
			name: "get_plate",
			arguments: {plate_id: plateId},
		});
		return this.parseToolResponse<Plate>(result);
	}

	// ========================================================================
	// Inventory - Boxes
	// ========================================================================

	async listBoxes(filters: InventoryFilters = {}): Promise<Box[]> {
		this.ensureConnected();
		const result = await this.client!.callTool({
			name: "list_boxes",
			arguments: filters,
		});
		return this.parseToolResponse<Box[]>(result);
	}

	async getBox(boxId: string): Promise<Box> {
		this.ensureConnected();
		const result = await this.client!.callTool({
			name: "get_box",
			arguments: {box_id: boxId},
		});
		return this.parseToolResponse<Box>(result);
	}

	// ========================================================================
	// Notebook Entries
	// ========================================================================

	async listNotebookEntries(filters: NotebookEntryFilters = {}): Promise<NotebookEntry[]> {
		this.ensureConnected();
		const result = await this.client!.callTool({
			name: "list_entries",
			arguments: filters,
		});
		return this.parseToolResponse<NotebookEntry[]>(result);
	}

	async getNotebookEntry(entryId: string): Promise<NotebookEntry> {
		this.ensureConnected();
		const result = await this.client!.callTool({
			name: "get_entry",
			arguments: {entry_id: entryId},
		});
		return this.parseToolResponse<NotebookEntry>(result);
	}

	// ========================================================================
	// Helper Methods
	// ========================================================================

	/**
	 * Parse MCP tool response and extract data
	 */
	private parseToolResponse<T>(response: any): T {
		// MCP responses come in the format: {content: [{type: "text", text: "..."}]}
		if (response.content && Array.isArray(response.content)) {
			const textContent = response.content.find((c: any) => c.type === "text");
			if (textContent && textContent.text) {
				try {
					return JSON.parse(textContent.text);
				} catch {
					return textContent.text as T;
				}
			}
		}
		return response as T;
	}
}

