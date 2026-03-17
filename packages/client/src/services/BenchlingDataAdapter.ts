/**
 * Transforms raw Benchling REST API data into MockDataResult (Plotly format).
 * All methods are static — no API calls here; pass data fetched by BenchlingAPIClient.
 */
import type {MockDataResult} from '../utils/mockDataGenerators';
import type {
	BenchlingAPIAssayResult,
	BenchlingAPIContainer,
	BenchlingAPIEntry,
	BenchlingAPIDNASequence,
} from './BenchlingAPIClient';

const COLORS = ['#1976D2', '#42A5F5', '#64B5F6', '#90CAF9', '#FF6B6B', '#4ECDC4', '#FFD93D'];

// Utility: count items by a string key
function countByGroup<T>(items: T[], getKey: (item: T) => string): Record<string, number> {
	return items.reduce<Record<string, number>>((acc, item) => {
		const key = getKey(item);
		acc[key] = (acc[key] ?? 0) + 1;
		return acc;
	}, {});
}

// Utility: build a monthly bar chart from any list
function monthlyTimeline<T>(
	items: T[],
	getDate: (item: T) => string,
	title: string,
	yLabel: string,
): MockDataResult {
	const counts = countByGroup(items, (item) => getDate(item).slice(0, 7));
	const months = Object.keys(counts).sort();
	return {
		data: [{type: 'bar', x: months, y: months.map((m) => counts[m]), marker: {color: COLORS[0]}}],
		layout: {title, xaxis: {title: 'Month'}, yaxis: {title: yLabel}},
	};
}

export class BenchlingDataAdapter {
	/**
	 * Assay Results → Scatter: numeric field over time, colored by text category.
	 * Dynamically detects the first float and first text field in the schema.
	 */
	static assayResultsToScatter(results: BenchlingAPIAssayResult[]): MockDataResult {
		if (!results.length) return BenchlingDataAdapter.emptyState('assay results');
		const firstFields = Object.entries(results[0].fields);
		const numField = firstFields.find(([, f]) => f.type === 'float')?.[0];
		const catField = firstFields.find(([, f]) => f.type === 'text')?.[0];
		if (!numField) return BenchlingDataAdapter.emptyState('assay results (no numeric field)');

		const groups = countByGroup(results, (r) =>
			catField ? String(r.fields[catField]?.value ?? 'Unknown') : 'All',
		);
		const traces = Object.keys(groups).map((grp, i) => {
			const subset = results.filter(
				(r) => !catField || String(r.fields[catField]?.value ?? 'Unknown') === grp,
			);
			return {
				type: 'scatter',
				mode: 'markers',
				name: grp,
				x: subset.map((r) => r.createdAt),
				y: subset.map((r) => r.fields[numField]?.value ?? 0),
				marker: {color: COLORS[i % COLORS.length], size: 8},
			};
		});
		return {
			data: traces,
			layout: {
				title: 'Assay Results: Frequency Over Time',
				xaxis: {title: 'Date'},
				yaxis: {title: `${numField} (%)`},
			},
		};
	}

	/**
	 * Assay Results → Grouped Bar: average numeric value per text category.
	 */
	static assayResultsToBar(results: BenchlingAPIAssayResult[]): MockDataResult {
		if (!results.length) return BenchlingDataAdapter.emptyState('assay results');
		const firstFields = Object.entries(results[0].fields);
		const numField = firstFields.find(([, f]) => f.type === 'float')?.[0];
		const catField = firstFields.find(([, f]) => f.type === 'text')?.[0];
		if (!numField || !catField) return BenchlingDataAdapter.assayResultsToScatter(results);

		const groups: Record<string, number[]> = {};
		results.forEach((r) => {
			const cat = String(r.fields[catField]?.value ?? 'Unknown');
			(groups[cat] = groups[cat] ?? []).push(Number(r.fields[numField]?.value ?? 0));
		});
		const categories = Object.keys(groups).sort();
		const avgs = categories.map((c) => groups[c].reduce((a, b) => a + b, 0) / groups[c].length);
		return {
			data: [{type: 'bar', x: categories, y: avgs, marker: {color: COLORS.slice(0, categories.length)}}],
			layout: {
				title: `Avg ${numField} by ${catField}`,
				xaxis: {title: catField},
				yaxis: {title: `Avg ${numField} (%)`},
			},
		};
	}

	/** Containers → Bar chart by month created */
	static containersToTimeline(containers: BenchlingAPIContainer[]): MockDataResult {
		if (!containers.length) return BenchlingDataAdapter.emptyState('containers');
		return monthlyTimeline(containers, (c) => c.createdAt, 'Containers Created by Month', 'Count');
	}

	/** Containers → Pie chart by checkout status */
	static containersToStatus(containers: BenchlingAPIContainer[]): MockDataResult {
		if (!containers.length) return BenchlingDataAdapter.emptyState('containers');
		const counts = countByGroup(containers, (c) => c.checkoutRecord?.status ?? 'UNKNOWN');
		const labels = Object.keys(counts);
		return {
			data: [{type: 'pie', labels, values: labels.map((l) => counts[l]), marker: {colors: COLORS}}],
			layout: {title: 'Container Availability Status'},
		};
	}

	/** Notebook Entries → Bar chart by author name */
	static entriesToAuthorChart(entries: BenchlingAPIEntry[]): MockDataResult {
		if (!entries.length) return BenchlingDataAdapter.emptyState('notebook entries');
		const counts = countByGroup(entries, (e) => e.authors?.[0]?.name ?? e.creator?.name ?? 'Unknown');
		const authors = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
		return {
			data: [{type: 'bar', x: authors, y: authors.map((a) => counts[a]), marker: {color: COLORS[0]}}],
			layout: {title: 'Notebook Entries by Author', xaxis: {title: 'Author'}, yaxis: {title: 'Count'}},
		};
	}

	/** Notebook Entries → Bar chart by month created */
	static entriesToTimeline(entries: BenchlingAPIEntry[]): MockDataResult {
		if (!entries.length) return BenchlingDataAdapter.emptyState('notebook entries');
		return monthlyTimeline(entries, (e) => e.createdAt, 'Notebook Entries by Month', 'Count');
	}

	/** DNA Sequences → Bar chart: top 20 by length (bp) */
	static dnaSequencesToLengthChart(sequences: BenchlingAPIDNASequence[]): MockDataResult {
		if (!sequences.length) return BenchlingDataAdapter.emptyState('DNA sequences');
		const top = [...sequences].sort((a, b) => b.length - a.length).slice(0, 20);
		return {
			data: [{type: 'bar', x: top.map((s) => s.name), y: top.map((s) => s.length), marker: {color: COLORS[0]}}],
			layout: {title: 'DNA Sequences by Length (Top 20)', xaxis: {title: 'Sequence'}, yaxis: {title: 'Length (bp)'}},
		};
	}

	/** Graceful empty state chart shown when no data is available */
	static emptyState(entityType: string): MockDataResult {
		return {
			data: [{type: 'bar', x: ['No Data'], y: [0], marker: {color: COLORS[2]}}],
			layout: {
				title: `No ${entityType} found`,
				annotations: [
					{
						text: `No ${entityType} are currently available in this Benchling project.`,
						showarrow: false,
						x: 0.5,
						y: 0.5,
						xref: 'paper',
						yref: 'paper',
						font: {size: 14},
					},
				],
			},
		};
	}
}

