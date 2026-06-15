// Ketcher renders a molecule only when it has 2D coordinates. A bare SMILES
// has none and this Ketcher build has no structure service to lay one out, so
// setMolecule(smiles) resolves but draws nothing. We use the bundled RDKit to
// generate a molblock with coordinates, which Ketcher renders directly.

import rdkitWasmUrl from '@rdkit/rdkit/dist/RDKit_minimal.wasm?url';

let rdkitPromise: Promise<any> | null = null;

async function getRDKit(): Promise<any> {
	if (!rdkitPromise) {
		rdkitPromise = (async () => {
			type RDKitLoader = (opts?: {locateFile?: () => string}) => Promise<any>;
			const mod = (await import('@rdkit/rdkit')) as unknown as {default?: RDKitLoader};
			// Under a bundler the UMD exposes the loader as the module export;
			// fall back to the global if a future build attaches it to window.
			const init = mod.default ?? (window as unknown as {initRDKitModule?: RDKitLoader}).initRDKitModule;
			if (!init) throw new Error('initRDKitModule not found');
			// Point RDKit at the bundled wasm so init works in any build layout.
			return await init({locateFile: () => rdkitWasmUrl});
		})();
	}
	return rdkitPromise;
}

/**
 * Convert a SMILES string to a molblock with generated 2D coordinates.
 * Returns null if RDKit is unavailable or the SMILES can't be parsed, so the
 * caller can fall back to the raw SMILES.
 */
export async function smilesToMolblock(smiles: string): Promise<string | null> {
	try {
		const RDKit = await getRDKit();
		const mol = RDKit.get_mol(smiles);
		if (!mol) return null;
		try {
			mol.set_new_coords();
			return mol.get_molblock();
		} finally {
			mol.delete();
		}
	} catch (e) {
		console.error('[smilesToMolblock] RDKit conversion failed', e);
		return null;
	}
}
