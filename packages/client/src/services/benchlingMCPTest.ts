/**
 * Test file to verify Benchling MCP connectivity
 * Run this to ensure the MCP client is working correctly
 */

import {BenchlingMCPClient} from "./BenchlingMCPClient";

async function testBenchlingMCPConnection() {
	console.log("🧪 Testing Benchling MCP Connection...\n");

	const client = new BenchlingMCPClient();

	try {
		// Step 1: Connect
		console.log("1️⃣ Connecting to Benchling MCP Server...");
		await client.connect();
		console.log("✅ Connected successfully!\n");

		// Step 2: Test DNA Sequences
		console.log("2️⃣ Fetching DNA sequences...");
		const sequences = await client.listDNASequences({max_results: 5});
		console.log(`✅ Found ${sequences.length} DNA sequences`);
		if (sequences.length > 0) {
			console.log("   Sample:", sequences[0].name);
		}
		console.log("");

		// Step 3: Test Custom Entities
		console.log("3️⃣ Fetching custom entities...");
		const entities = await client.listCustomEntities({max_results: 5});
		console.log(`✅ Found ${entities.length} custom entities`);
		if (entities.length > 0) {
			console.log("   Sample:", entities[0].name);
		}
		console.log("");

		// Step 4: Test Assay Results
		console.log("4️⃣ Fetching assay results...");
		const results = await client.listAssayResults({max_results: 5});
		console.log(`✅ Found ${results.length} assay results`);
		console.log("");

		// Step 5: Test Inventory
		console.log("5️⃣ Fetching inventory (containers)...");
		const containers = await client.listContainers({max_results: 5});
		console.log(`✅ Found ${containers.length} containers`);
		if (containers.length > 0) {
			console.log("   Sample:", containers[0].name);
		}
		console.log("");

		// Step 6: Test Notebook Entries
		console.log("6️⃣ Fetching notebook entries...");
		const entries = await client.listNotebookEntries({max_results: 5});
		console.log(`✅ Found ${entries.length} notebook entries`);
		if (entries.length > 0) {
			console.log("   Sample:", entries[0].name);
		}
		console.log("");

		console.log("🎉 All tests passed! Benchling MCP connection is working.\n");
	} catch (error) {
		console.error("❌ Test failed:", error);
		console.error("\n💡 Troubleshooting:");
		console.error("   1. Make sure benchling-mcp-server is installed: pipx install benchling-mcp-server");
		console.error("   2. Check your .env.local file has valid credentials");
		console.error("   3. Verify your Benchling URL is correct");
		console.error("   4. Ensure your OAuth2 app has the required scopes\n");
	} finally {
		// Cleanup
		await client.disconnect();
		console.log("👋 Disconnected from Benchling MCP Server");
	}
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	testBenchlingMCPConnection();
}

export {testBenchlingMCPConnection};

