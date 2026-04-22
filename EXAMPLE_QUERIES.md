# Example Queries for Chemical Search

## SMILES — Exact Matches (in mock DB)

| Compound | SMILES |
|----------|--------|
| Aspirin | `CC(=O)OC1=CC=CC=C1C(=O)O` |
| Caffeine | `CN1C=NC2=C1C(=O)N(C(=O)N2C)C` |
| Acetaminophen | `CC(=O)NC1=CC=C(C=C1)O` |
| Metformin | `CN(C)C(=N)NC(=N)N` |
| Imatinib | `CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5` |
| Celecoxib | `CC1=CC=C(C=C1)C2=CC(=NN2C3=CC=C(C=C3)S(=O)(=O)N)C(F)(F)F` |
| Fluoxetine | `CNCCC(C1=CC=CC=C1)OC2=CC=C(C=C2)C(F)(F)F` |
| Erlotinib | `COCCOC1=C(C=C2C(=C1)C(=NC=N2)NC3=CC=CC(=C3)C#C)OCCOC` |

## SMILES — Similarity Hits (not in DB, but structurally similar)

| Description | SMILES | Expected matches |
|-------------|--------|------------------|
| Benzamide core | `C1=CC=C(C=C1)C(=O)N` | Imatinib, Sorafenib, TS compounds |
| Pyrimidine scaffold | `C1=CN=CN=C1N` | JAK2 series, kinase inhibitors |
| Sulfonamide | `C1=CC=C(C=C1)S(=O)(=O)N` | Celecoxib, TS-4220 |
| Piperazine fragment | `C1CNCCN1` | Imatinib, Gefitinib |
| Simple phenol | `C1=CC=C(C=C1)O` | Acetaminophen, Aspirin |
| Urea linker | `NC(=O)NC1=CC=CC=C1` | Sorafenib |

## Formula Search

| Formula | Matches |
|---------|---------|
| `C9H8O4` | Aspirin |
| `C8H10N4O2` | Caffeine |
| `C8H9NO2` | Acetaminophen |
| `C4H11N5` | Metformin |
| `C17H14F3N3O2S` | Celecoxib |
| `C29H31N7O` | Imatinib |
| `C22H23N3O4` | Erlotinib |
| `C21H16ClF3N4O3` | Sorafenib |

## Tips

- **Similarity mode**: Lower threshold (10-30%) returns more hits. Default 40% is moderate.
- **Tanimoto vs Dice**: Tanimoto is stricter (lower scores). Dice inflates similarity slightly.
- **Substructure mode**: Query must be substring of target SMILES (simplified, not true graph matching).
- **Formula search**: Exact element-count match required.
- **Multi-select**: Check multiple compounds in results, then "Find Files for Selected" to see all associated files.
