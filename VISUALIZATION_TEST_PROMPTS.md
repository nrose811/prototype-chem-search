# Visualization Test Prompts

This document contains example prompts to test all 60+ visualization types available in the TetraScience Data Platform - Scientist Experience prototype.

## Table of Contents
- [Plotly.js Visualizations (35 types)](#plotlyjs-visualizations)
- [RDKit.js Visualizations (6 types)](#rdkitjs-visualizations)
- [3Dmol.js Visualizations (1 type)](#3dmoljs-visualizations)
- [Mol* Visualizations (9 types)](#mol-visualizations)
- [IGV.js Visualizations (7 types)](#igvjs-visualizations)

---

## Plotly.js Visualizations

### Core "Workhorse" Plots

#### Line Chart
- "Show me a line chart of temperature over time"
- "Create a time series plot"
- "Plot concentration vs time"

#### Scatter Plot
- "Create a scatter plot for calibration curve"
- "Show me a scatter plot of dose vs response"
- "Plot correlation between two variables"

#### Bar Chart
- "Make a bar chart comparing groups"
- "Show me a bar graph of sample counts"
- "Create a column chart of measurements"

#### Box Plot
- "Create a box plot showing distribution"
- "Show me a box and whisker plot"
- "Display quartile analysis"

#### Violin Plot
- "Make a violin plot of the data"
- "Show distribution with violin plot"
- "Create a violin chart"

#### Histogram
- "Show me a histogram of values"
- "Create a frequency distribution"
- "Plot histogram of measurements"

### Experimental Design & Statistics

#### Error Bars
- "Show error bars on the plot"
- "Create a plot with standard deviation"
- "Display confidence intervals"

#### Dose-Response Curve
- "Create a dose-response curve"
- "Show me an IC50 plot"
- "Plot dose vs response with curve fit"

#### ANOVA Plot
- "Show me an ANOVA comparison"
- "Create analysis of variance plot"
- "Display group comparisons"

#### Forest Plot
- "Create a forest plot for meta-analysis"
- "Show me effect sizes with confidence intervals"
- "Display odds ratios"

#### ROC Curve
- "Show me an ROC curve"
- "Create receiver operating characteristic plot"
- "Display classifier performance"

### High-Throughput, Omics & Multivariate

#### Heatmap
- "Create a heatmap of expression data"
- "Show me a correlation heatmap"
- "Display intensity matrix"

#### PCA Plot
- "Show me a PCA clustering plot"
- "Create principal component analysis"
- "Display dimensionality reduction"

#### Volcano Plot
- "Make a volcano plot"
- "Show differential expression"
- "Create fold change vs p-value plot"

#### MA Plot
- "Create an MA plot"
- "Show log ratio vs mean intensity"
- "Display microarray analysis"

#### Bubble Plot
- "Make a bubble plot"
- "Show three-dimensional scatter"
- "Create bubble chart with size encoding"

#### Circos Plot
- "Create a circos plot"
- "Show circular genomic visualization"
- "Display chromosomal relationships"

### Assay, Plate & Lab Operations

#### Plate Layout
- "Show me a 96-well plate layout"
- "Create a plate map"
- "Display well positions"

#### Control Chart
- "Create a control chart"
- "Show process control limits"
- "Display quality control trends"

#### Throughput Plot
- "Show throughput over time"
- "Create samples per day plot"
- "Display lab productivity"

### Chemistry, Bioprocess & Analytical

#### Chromatogram
- "Show me a chromatogram"
- "Create HPLC trace"
- "Display retention time peaks"

#### Spectrum
- "Show me a spectrum"
- "Create absorption spectrum"
- "Display wavelength vs intensity"

#### Kinetics Plot
- "Create enzyme kinetics plot"
- "Show reaction rate curve"
- "Display Michaelis-Menten"

#### Phase Diagram
- "Show me a phase diagram"
- "Create ternary plot"
- "Display phase boundaries"

### Clinical, Translational & Biomarker

#### Longitudinal Plot
- "Create longitudinal patient data"
- "Show repeated measures over time"
- "Display patient trajectories"

#### Kaplan-Meier Curve
- "Show me a Kaplan-Meier survival curve"
- "Create survival analysis"
- "Display time to event"

#### Demographic Plot
- "Show demographic distribution"
- "Create population pyramid"
- "Display age and gender breakdown"

### Spatial, Imaging & Maps

#### 2D Intensity Map
- "Create a 2D intensity map"
- "Show spatial distribution"
- "Display heat distribution"

#### 3D Surface Plot
- "Show me a 3D surface plot"
- "Create three-dimensional visualization"
- "Display topography"

#### Geographic Map
- "Show geographic distribution"
- "Create location map"
- "Display spatial data on map"

---

## RDKit.js Visualizations

### Chemical Structures

#### 2D Structure
- "Show me a 2D chemical structure"
- "Display 2D molecular structure"
- "Create chemical drawing"

#### Reaction Scheme
- "Show me a reaction scheme"
- "Display chemical reaction"
- "Create reaction pathway"

#### Chemical Space Map
- "Create a chemical space map"
- "Show chemical space t-SNE"
- "Display compound clustering"

#### Structure-Activity Heatmap
- "Show structure-activity heatmap"
- "Create SAR matrix"
- "Display IC50 values"

#### Similarity Network
- "Create molecular similarity network"
- "Show compound relationships"
- "Display Tanimoto similarity"

#### Matched Molecular Pairs
- "Show matched molecular pairs"
- "Display structure comparison"
- "Create MMP analysis"

---

## 3Dmol.js Visualizations

### 3D Molecular Structures

#### 3D Molecular Structure
- "Show me a 3D molecular structure"
- "Display 3D molecule ball and stick"
- "Create molecular model 3D"

---

## Mol* Visualizations

### Protein Structures

#### 3D Protein Structure
- "Show me a 3D protein structure"
- "Display protein 3D from PDB"
- "Create protein ribbon diagram"

#### Domain Architecture
- "Show protein domain architecture"
- "Display functional regions"
- "Create domain diagram"

#### Contact Map
- "Create protein contact map"
- "Show residue-residue distances"
- "Display distance matrix"

#### Secondary Structure
- "Show secondary structure plot"
- "Display helix and strand regions"
- "Create structure profile"

#### Disorder Profile
- "Show disorder profile"
- "Display intrinsic disorder"
- "Create flexibility prediction"

#### MD Trajectory
- "Show MD trajectory analysis"
- "Display RMSD plot"
- "Create molecular dynamics results"

---

## IGV.js Visualizations

### Genomics Visualizations

#### Genome Track
- "Show me a genome browser track"
- "Display genomic track with genes"
- "Create genome browser view"

#### Variant Lollipop
- "Show variant lollipop plot"
- "Display mutations along sequence"
- "Create variant visualization"

#### Sequence Logo
- "Create sequence logo"
- "Show nucleotide frequencies"
- "Display motif conservation"

#### Manhattan Plot
- "Show Manhattan plot for GWAS"
- "Display genome-wide significance"
- "Create association study plot"

#### Sashimi Plot
- "Show Sashimi plot"
- "Display RNA-seq splicing"
- "Create splice junction visualization"

#### Assembly Graph
- "Show assembly graph"
- "Display de Bruijn graph"
- "Create contig relationships"

---

## Tips for Testing

1. **Be flexible with wording** - The keyword detection system is designed to recognize variations
2. **Try different phrasings** - "show me", "create", "display", "make", etc. all work
3. **Combine keywords** - Use multiple relevant terms for better detection
4. **Check the routing** - The system automatically selects the best library for each visualization type

## Expected Behavior

- **Plotly.js** charts are fully interactive with zoom, pan, and hover tooltips
- **RDKit.js** visualizations show chemical structures with full implementations
- **3Dmol.js** displays 3D molecular structures
- **Mol*** shows protein structure visualizations with detailed annotations
- **IGV.js** displays genomics data with tracks and annotations

All visualizations are rendered with mock data for demonstration purposes.


