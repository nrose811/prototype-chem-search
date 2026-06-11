import MoleculeCard from './MoleculeCard';
import {
	lipinskiRuleOfFive,
	computeExactMass,
	countHeavyAtoms,
	computeFormalCharge,
	formatDate,
	type ChemRegCompound,
} from '../mocks/chemRegData';
import './CompoundCard.css';

interface Props {
	compound: ChemRegCompound;
	/** When provided, renders the "Find Associated Data Files" CTA. */
	onFindFiles?: () => void;
}

/**
 * Rich, full-view card for a single compound.
 * Shows structure-derived descriptors + registration tags typical of an
 * SDF/MOL record — no assay or experimental data.
 * Reused by the Compound Detail step and the structure expand modal.
 */
function CompoundCard({compound: c, onFindFiles}: Props) {
	const lipinski = lipinskiRuleOfFive(c);
	const exactMass = computeExactMass(c.formula);
	const heavyAtoms = countHeavyAtoms(c.formula);
	const formalCharge = computeFormalCharge(c.smiles);

	return (
		<div className="cmpd-card">
			{/* Header */}
			<div className="cmpd-card-header">
				<div className="cmpd-card-heading">
					<h2 className="cmpd-card-name">{c.name}</h2>
					<div className="cmpd-card-subline">
						<span className="cmpd-card-id mono">{c.molId}</span>
						{c.project && <span className="cmpd-card-chip">{c.project}</span>}
					</div>
				</div>
			</div>

			{/* Stat tiles */}
			<div className="cmpd-card-tiles">
				<Tile label="Formula" value={<span className="cmpd-formula">{c.formula}</span>} />
				<Tile label="Mol. Weight" value={`${c.mw.toFixed(1)} g/mol`} />
				<Tile label="Exact Mass" value={`${exactMass.toFixed(4)}`} />
				<Tile label="CAS" value={<span className="mono">{c.casNumber}</span>} />
			</div>

			<div className="cmpd-card-divider" />

			{/* Body: descriptors (left) + structure (right) */}
			<div className="cmpd-card-body">
				<div className="cmpd-card-main">
					{/* SMILES */}
					<Section accent="blue" icon="</>" title="SMILES">
						<div className="cmpd-smiles-block">
							<code>{c.smiles}</code>
						</div>
					</Section>

					<div className="cmpd-card-cols">
						<Section accent="indigo" icon="◇" title="Molecular Descriptors">
							<PropRow label="Heavy Atoms" value={heavyAtoms} />
							<PropRow label="Ring Count" value={c.ringCount} />
							<PropRow label="Stereocenters" value={c.stereocenters} />
							<PropRow label="Formal Charge" value={formalCharge > 0 ? `+${formalCharge}` : formalCharge} />
						</Section>

						<Section accent="amber" icon="◎" title="Drug-Likeness">
							<PropRow label="LogP" value={c.logP.toFixed(1)} />
							<PropRow label="TPSA" value={<>{c.tpsa.toFixed(1)} &#8491;&sup2;</>} />
							<PropRow label="H-Bond Acceptors" value={c.hba} />
							<PropRow label="H-Bond Donors" value={c.hbd} />
							<PropRow label="Rotatable Bonds" value={c.rotatableBonds} />
						</Section>
					</div>

					{/* Lipinski */}
					<div className={`cmpd-lipinski ${lipinski.pass ? 'pass' : 'fail'}`}>
						<div className="cmpd-lipinski-header">
							<span className="cmpd-lipinski-icon">{lipinski.pass ? '✓' : '✗'}</span>
							<strong>Lipinski Rule of 5</strong>
							<span className="cmpd-lipinski-status">
								{lipinski.pass ? 'PASS' : 'FAIL'} ({lipinski.violations} violation
								{lipinski.violations !== 1 ? 's' : ''})
							</span>
						</div>
						<div className="cmpd-lipinski-rules">
							{lipinski.details.map((d) => (
								<span key={d.rule} className={`cmpd-lipinski-rule ${d.pass ? 'pass' : 'fail'}`}>
									{d.rule}: {typeof d.value === 'number' ? d.value.toFixed(1) : d.value}
								</span>
							))}
						</div>
					</div>
				</div>

				{/* Structure (click to zoom) */}
				<aside className="cmpd-card-structure">
					<MoleculeCard smiles={c.smiles} width={260} height={220} expandable />
					<span className="cmpd-structure-hint">Click structure to zoom</span>
				</aside>
			</div>

			{/* Registration meta */}
			<div className="cmpd-card-meta">
				<MetaItem label="Registered" value={formatDate(c.registrationDate)} />
				<MetaItem label="Registered By" value={c.registeredBy} />
			</div>

			{onFindFiles && (
				<button className="cmpd-find-files-btn" onClick={onFindFiles}>
					Find Associated Data Files
				</button>
			)}
		</div>
	);
}

function Tile({label, value}: {label: string; value: React.ReactNode}) {
	return (
		<div className="cmpd-tile">
			<span className="cmpd-tile-label">{label}</span>
			<span className="cmpd-tile-value">{value}</span>
		</div>
	);
}

function Section({
	accent,
	icon,
	title,
	children,
}: {
	accent: 'blue' | 'indigo' | 'amber';
	icon: string;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="cmpd-section">
			<div className="cmpd-section-title">
				<span className={`cmpd-section-bar ${accent}`} />
				<span className="cmpd-section-icon">{icon}</span>
				{title}
			</div>
			<div className="cmpd-section-body">{children}</div>
		</div>
	);
}

function PropRow({label, value}: {label: string; value: React.ReactNode}) {
	return (
		<div className="cmpd-prop-row">
			<span className="cmpd-prop-label">{label}</span>
			<span className="cmpd-prop-value">{value}</span>
		</div>
	);
}

function MetaItem({label, value}: {label: string; value: React.ReactNode}) {
	return (
		<div className="cmpd-meta-item">
			<span className="cmpd-meta-label">{label}</span>
			<span className="cmpd-meta-value">{value}</span>
		</div>
	);
}

/** Modal overlay rendering a full CompoundCard (used by the results table expand). */
export function CompoundCardModal({compound, onClose}: {compound: ChemRegCompound; onClose: () => void}) {
	return (
		<div className="cmpd-modal-overlay" onClick={onClose}>
			<div className="cmpd-modal" onClick={(e) => e.stopPropagation()}>
				<button className="cmpd-modal-close" onClick={onClose} aria-label="Close">
					&times;
				</button>
				<CompoundCard compound={compound} />
			</div>
		</div>
	);
}

export default CompoundCard;
