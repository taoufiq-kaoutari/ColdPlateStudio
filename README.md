# ColdPlate Studio

**Thermo-hydraulic design and optimization of serpentine liquid-cooled CPU cold plates**

ColdPlate Studio is a browser-based engineering platform for the rapid design, simulation, and comparison of serpentine liquid-cooled cold plates used in CPU, GPU, AI accelerator, and power-electronics cooling.

The application combines geometry generation, hydraulic analysis, thermal prediction, temperature-field visualization, performance screening, and report export in a single engineering workflow.

---

## Live online demonstration

A fully accessible demonstration is available at:

**[Open ColdPlate Studio](https://plate.kaoutari.cloud/)**

No local installation is required to use the public demonstration.

For a first evaluation:

1. Open the live application.
2. Keep the default parameters.
3. Select **Update geometry**.
4. Verify the generated serpentine route.
5. Select **Run calculation**.
6. Review pressure drop, CPU peak temperature, coolant outlet temperature, copper temperature distribution, and the performance summary.
7. Use the export buttons to generate an Excel file or a printable engineering report.

<p align="center">
  <a href="https://plate.kaoutari.cloud/">
    <img width="1065" height="591" alt="ColdPlate Studio engineering dashboard" src="https://github.com/user-attachments/assets/61c29a02-d1e4-402b-8a36-bc1a73a632a1">
  </a>
</p>

<p align="center"><em>Figure 1. ColdPlate Studio engineering dashboard with geometry controls, two-dimensional routing, interactive three-dimensional visualization, and calculated performance indicators.</em></p>

---

## Project overview

ColdPlate Studio is intended for preliminary design, concept screening, education, research, and engineering communication.

The platform brings together the main design decisions that normally have to be evaluated separately:

- cold-plate dimensions;
- CPU footprint and applied heat load;
- serpentine-channel layout;
- channel width and height;
- wall thickness and channel pitch;
- inlet and outlet positions;
- coolant thermophysical properties;
- required flow rate;
- hydraulic resistance;
- coolant temperature rise;
- copper temperature distribution;
- thermal and hydraulic design limits.

The application is designed to help engineers identify promising cold-plate geometries before investing time in detailed three-dimensional CFD, structural analysis, manufacturing preparation, or experimental testing.

ColdPlate Studio is not intended to replace high-fidelity numerical analysis or physical validation. It is a reduced-order engineering tool developed to accelerate early-stage decision-making and controlled design comparisons.

---

## Main objectives

ColdPlate Studio helps users answer practical engineering questions such as:

- How many serpentine passes should be used?
- Does the channel route cover the complete CPU cooling zone?
- What channel width and height provide a reasonable compromise between heat transfer and pressure loss?
- What coolant flow rate is required for the specified thermal load?
- What is the predicted pressure drop through the complete hydraulic path?
- How much does the coolant temperature increase between inlet and outlet?
- What is the maximum predicted temperature in the CPU region?
- How much of the applied processor heat is transferred to the coolant?
- Does the design satisfy the specified temperature and pressure limits?
- Which candidate geometry should be retained for more detailed validation?

---

## Who can benefit from the platform

ColdPlate Studio can support:

- thermal engineers evaluating liquid-cooling concepts;
- mechanical engineers defining plate and channel geometry;
- electronics-cooling specialists working with CPUs, GPUs, and AI accelerators;
- researchers studying reduced-order thermo-hydraulic models;
- students learning the interaction between flow resistance, convection, and solid conduction;
- data-centre engineers investigating heat-removal and heat-recovery concepts;
- project teams preparing feasibility studies, design reviews, proposals, and technical reports;
- power-electronics engineers evaluating direct liquid-cooling solutions.

---

## Application capabilities

### Geometry generation and cooling coverage

The application generates a continuous serpentine channel inside the available cold-plate footprint.

The geometry module evaluates:

- requested and feasible pass count;
- channel pitch;
- plate side and end margins;
- channel orientation;
- inlet and outlet locations;
- connector paths;
- total hydraulic length;
- CPU footprint;
- required cooling zone;
- cooling-zone coverage;
- coverage safety margin.

The generated plan view allows the user to confirm that the cooling path is distributed across the required region rather than concentrated in only one part of the processor footprint.

### Hydraulic analysis

The hydraulic solver estimates:

- coolant mass flow rate;
- coolant volumetric flow rate;
- mean channel velocity;
- hydraulic diameter;
- Reynolds number;
- flow regime;
- friction factor;
- distributed friction losses;
- bend losses;
- inlet and outlet port losses;
- total pressure drop;
- pressure-limit status.

This information is essential because a geometry that produces a low temperature but requires excessive pump head is not a practical optimized design.

### Thermal analysis

The thermal model estimates:

- coolant temperature evolution along the channel;
- coolant outlet temperature;
- internal convective heat-transfer performance;
- heat transferred to the coolant;
- heat lost to the ambient environment;
- temperature distribution through the copper plate;
- maximum temperature in the CPU region;
- CPU-temperature-limit status.

The solver combines the coolant energy balance, internal convection, ambient heat losses, and a two-dimensional copper conduction model.

### Engineering visualization

The dashboard provides:

- a planar channel-route view;
- an interactive three-dimensional plate representation;
- a coolant-velocity profile;
- a coolant-temperature profile;
- a heat-pickup distribution;
- a copper temperature map;
- a detailed numerical performance summary.

### Reporting and export

The project includes:

- an Excel-compatible result export;
- a printable engineering report;
- a representative report page;
- a scientific-basis document;
- a structured numerical result table.

---

## Engineering workflow

The recommended workflow is:

1. Define the cold-plate geometry.
2. Define the CPU footprint and heat load.
3. Define channel dimensions and requested pass count.
4. Position the inlet and outlet ports.
5. Enter coolant properties and operating conditions.
6. Define pressure and temperature limits.
7. Generate and inspect the channel geometry.
8. Run the thermo-hydraulic calculation.
9. Review thermal and hydraulic results together.
10. Compare alternative designs using controlled parameter changes.
11. Export the selected design for reporting and further validation.

<p align="center">
  <img width="1065" height="284" alt="ColdPlate Studio design workflow" src="https://github.com/user-attachments/assets/7ee64b5f-ba70-4b9d-bf4f-81d0afdd31b9">
</p>

<p align="center"><em>Figure 2. Recommended ColdPlate Studio design workflow.</em></p>

---

## How ColdPlate Studio supports CPU heat-capture optimization

In CPU liquid cooling, the engineering objective is not simply to increase coolant velocity.

A successful cold plate should:

- capture a large fraction of the processor heat;
- distribute cooling across the complete CPU footprint;
- limit local hot spots;
- maintain the maximum CPU temperature below the allowable value;
- keep coolant temperature rise within the selected target;
- limit hydraulic resistance;
- remain compatible with the available pump;
- preserve realistic wall thicknesses and manufacturing margins.

ColdPlate Studio supports this multi-objective design process by displaying thermal performance and hydraulic cost at the same time.

### Increasing heat transferred to the coolant

The reported **Heat transferred to water** value indicates how much of the applied CPU heat load is captured by the liquid loop.

This output is useful for:

- evaluating cold-plate effectiveness;
- sizing the downstream radiator or heat exchanger;
- estimating heat available for recovery;
- comparing different channel geometries;
- checking whether a large fraction of the heat escapes to the surroundings instead of entering the coolant.

A high heat-transfer value is desirable, but it should not be considered alone. The user must also review peak temperature, pressure drop, coolant temperature rise, and cooling-zone coverage.

### Reducing local hot spots

The maximum CPU temperature and copper temperature map help identify local thermal problems that may not appear in average values.

The temperature map can reveal:

- insufficient channel coverage;
- excessive channel spacing;
- poor route placement;
- local thermal concentration near the centre of the CPU;
- regions with weak heat spreading;
- designs that require a different pass count or channel pitch.

A good preliminary design generally presents smooth temperature gradients and avoids isolated hot regions outside the channel-covered zone.

### Controlling pumping requirements

Narrow channels, high coolant velocity, long hydraulic paths, and many bends can improve local heat transfer, but they also increase pressure loss.

ColdPlate Studio reports pressure drop together with thermal performance so that users can reject designs that:

- exceed the available pump head;
- require disproportionate pumping power;
- create an unnecessary hydraulic penalty for a very small temperature improvement;
- produce high velocity that may be undesirable in a practical system.

### Comparing design alternatives consistently

The recommended optimization method is to create several controlled design variants.

For example, a user can compare:

- 11, 13, and 15 passes;
- several channel widths;
- several channel heights;
- different wall thicknesses;
- alternative inlet and outlet positions;
- different coolant inlet temperatures;
- several allowable coolant temperature rises.

During the first comparison cycle, only one parameter should be changed at a time. All other operating conditions should remain fixed.

This makes it easier to identify the real influence of each design variable.

<p align="center">
  <img width="1065" height="429" alt="Practical interpretation of the main design variables" src="https://github.com/user-attachments/assets/fef827ab-2121-4693-9b1f-5dcfd671a5ba">
</p>

<p align="center"><em>Figure 3. Practical interpretation of the main cold-plate design variables.</em></p>

---

## Using the online application step by step

### 1. Define the plate geometry

Enter:

- plate length;
- plate width;
- total plate height;
- base thickness;
- top thickness;
- side margin;
- end margin.

These values define the available physical envelope for the internal channel network.

### 2. Define the channel network

Enter:

- requested number of passes;
- channel width;
- channel height;
- wall thickness;
- vertical shift;
- routing mode.

The channel width, channel height, and wall thickness strongly influence channel pitch, flow area, velocity, hydraulic resistance, cooling coverage, and manufacturability.

### 3. Position the inlet and outlet

Enter:

- inlet x-coordinate;
- inlet y-coordinate;
- outlet x-coordinate;
- outlet y-coordinate;
- port inner diameter;
- port outer diameter;
- external port height.

Inspect the generated geometry to confirm that the ports remain inside the plate and that their connector paths are acceptable.

### 4. Define the processor and cooling zone

Enter:

- CPU heat load;
- CPU length;
- CPU width;
- cooling-zone position;
- cooling-zone length;
- cooling-zone width.

The cooling zone can follow the CPU footprint automatically or be defined independently.

### 5. Define thermal operating conditions

Enter:

- coolant inlet temperature;
- target coolant temperature rise;
- maximum allowable CPU temperature;
- ambient temperature;
- ambient pressure;
- copper conductivity;
- surface emissivity;
- plate orientation;
- convection and radiation options.

### 6. Enter coolant properties

Enter values appropriate for the expected coolant and operating temperature:

- density;
- dynamic viscosity;
- heat capacity;
- thermal conductivity.

The default values are representative of water under the selected default conditions. They should be updated when another coolant or temperature range is used.

### 7. Define hydraulic limits

Enter:

- maximum allowable pressure drop;
- bend-loss coefficient;
- combined port-loss coefficient.

The pressure limit should reflect the pump and full-loop pressure budget rather than only the cold plate in isolation.

### 8. Update the geometry

Select **Update geometry**.

Check:

- pass count;
- route orientation;
- cooling-zone coverage;
- channel placement;
- inlet and outlet positions;
- hydraulic path length.

### 9. Run the calculation

Select **Run calculation**.

The application evaluates the geometry, hydraulic model, coolant-temperature profile, ambient losses, and copper temperature field.

### 10. Review the results

Review at least:

- optimized pass count;
- required zone coverage;
- hydraulic length;
- pressure drop;
- Reynolds number;
- mean velocity;
- mass flow rate;
- volumetric flow rate;
- internal heat-transfer coefficient;
- coolant outlet temperature;
- maximum CPU-region temperature;
- heat transferred to water;
- pressure-limit status;
- CPU-temperature status.

### 11. Compare alternative designs

Change one design parameter, rerun the model, and record the effect on:

- peak CPU temperature;
- heat transferred to water;
- coolant outlet temperature;
- pressure drop;
- route coverage.

### 12. Export the selected design

Use:

- **Export Excel** for a spreadsheet-compatible numerical summary;
- **Generate PDF** for a printable engineering report;
- **Representative PDF** for a predefined representative case.

---

## Understanding the visual outputs

### Planar channel route

The planar view shows:

- the complete serpentine centerline;
- the plate boundary;
- the CPU footprint;
- the required cooling zone;
- the inlet;
- the outlet.

Use this figure to identify insufficient coverage, uneven channel distribution, excessive connector length, ports positioned too close to the edge, or a route that does not align well with the CPU region.

### Interactive three-dimensional representation

The three-dimensional view shows the relative positions of the cold plate, channel plane, CPU footprint, inlet, and outlet.

This view is useful in technical reviews because it communicates the internal route more clearly than a plan view alone.

### Coolant velocity profile

The velocity plot provides the predicted velocity along the hydraulic coordinate.

It helps the user verify the flow level associated with the selected channel cross-section and required mass flow rate.

### Coolant temperature profile

The coolant-temperature curve should increase progressively from inlet to outlet.

The profile indicates where the coolant absorbs heat and how the processor heat is distributed along the channel path.

A concentrated temperature increase near the CPU footprint is physically expected.

### Copper temperature distribution

The copper temperature map identifies:

- the hottest location;
- the spatial temperature gradient;
- the relation between the CPU footprint and the channel route;
- regions of weak cooling;
- the maximum predicted plate temperature.

<p align="center">
  <img width="1020" height="639" alt="Representative copper temperature distribution" src="https://github.com/user-attachments/assets/397e8d04-2dc2-47dd-91e9-cebd79c6651a">
</p>

<p align="center"><em>Figure 4. Representative copper temperature distribution and CPU footprint.</em></p>

---

## Interpreting the performance summary

- **Optimized passes:** final pass count used by the generated route.
- **Route orientation:** principal direction of the serpentine legs.
- **Required zone coverage:** fraction of the required cooling region reached by the channel network.
- **Coverage safety margin:** geometric margin relative to the route-coverage threshold.
- **Hydraulic length:** total wetted flow-path length.
- **Pressure drop:** predicted resistance of the complete cold plate.
- **Reynolds number:** indicator of the internal flow regime.
- **Mean velocity:** average coolant speed in the channel.
- **Mass flow rate:** coolant mass transported per unit time.
- **Volumetric flow rate:** coolant volume transported per unit time.
- **Average internal heat-transfer coefficient:** predicted internal convective performance.
- **Outlet temperature:** predicted bulk coolant temperature after heat pickup.
- **Maximum CPU-region temperature:** principal thermal safety indicator.
- **Heat transferred to water:** portion of the CPU load captured by the coolant.
- **Heat transferred to ambient:** portion of heat lost to the surroundings.
- **Pressure-limit status:** pass/fail result against the specified pressure limit.
- **CPU-temperature status:** pass/fail result against the specified temperature limit.

A passing result is a preliminary screening result only. It is not certification or manufacturing approval.

---

## Recommended optimization method

1. Start with a realistic and manufacturable baseline.
2. Keep heat load, coolant properties, inlet temperature, and limits fixed.
3. Change one parameter at a time.
4. Compare peak temperature and pressure drop together.
5. Reject geometries that exceed the pressure limit.
6. Avoid selecting a geometry based only on the lowest predicted temperature.
7. Use cooling-zone coverage and the temperature map together.
8. Check the coolant outlet temperature and heat transferred to water.
9. Repeat the selected design with conservative conditions.
10. Validate the final concept using higher-fidelity analysis and testing.

Useful comparison studies include:

- pass-count sensitivity;
- channel-width sensitivity;
- channel-height sensitivity;
- wall-thickness sensitivity;
- inlet-position sensitivity;
- coolant-temperature sensitivity;
- heat-load sensitivity;
- pressure-limit sensitivity.

---

## Heat-recovery applications

The project can also support preliminary heat-recovery studies.

Once processor heat is captured by the coolant, it may be transported to:

- a liquid-to-air radiator;
- a liquid-to-liquid heat exchanger;
- thermal storage;
- domestic hot-water preheating;
- a low-temperature building-heating circuit;
- another industrial process.

The outputs most relevant to heat recovery are:

- heat transferred to water;
- coolant mass flow rate;
- volumetric flow rate;
- coolant inlet temperature;
- coolant outlet temperature;
- pressure drop.

ColdPlate Studio evaluates heat capture at the cold-plate level. A complete heat-recovery assessment must also include the pump, piping, heat exchanger, storage, controls, and final heat-use temperature requirements.

---

## Typical applications

ColdPlate Studio can be used for preliminary studies involving:

- desktop and workstation CPUs;
- server processors;
- GPUs;
- AI accelerators;
- high-performance computing systems;
- data-centre liquid cooling;
- power electronics;
- inverters and converters;
- battery modules;
- laser systems;
- telecommunications equipment;
- high-power electronic packages.

---

## Repository structure

```text
ColdPlateStudio/
├── assets/
│   ├── app.css
│   └── app.js
├── docs/
│   └── Scientific_Basis.pdf
├── calculate.php
├── export.php
├── index.php
├── report.php
├── representative-report.php
├── solver.php
├── README.md
├── LICENSE
├── CITATION.cff
├── CONTRIBUTING.md
├── SECURITY.md
├── DISCLAIMER.md
└── CHANGELOG.md
```

---

## Main source files

| File | Purpose |
|---|---|
| `index.php` | Main user interface and engineering input definition |
| `solver.php` | Geometry, hydraulic, thermal, and result-processing functions |
| `calculate.php` | JSON calculation endpoint used by the browser application |
| `app.js` | Input handling, API requests, plotting, visualization, and interaction |
| `assets/app.css` | Application layout and interface styling |
| `report.php` | Printable engineering report |
| `representative-report.php` | Representative predefined report |
| `export.php` | Excel-compatible result export |
| `docs/Scientific_Basis.pdf` | Scientific description of the implemented model |

---

## Installation

### Requirements

- PHP 8.0 or later;
- Apache, Nginx, or another PHP-compatible web server;
- a modern web browser;
- JavaScript enabled.

### Local deployment

Clone the repository:

```bash
git clone https://github.com/HyDynamics/ColdPlateStudio.git
```

Move into the project directory:

```bash
cd ColdPlateStudio
```

Start the PHP development server:

```bash
php -S localhost:8000
```

Open:

```text
http://localhost:8000/
```

### Shared hosting deployment

Upload the complete project contents to the web root or subdomain directory.

The web root must directly contain:

```text
index.php
calculate.php
solver.php
report.php
export.php
representative-report.php
assets/
docs/
```

Ensure that:

- folders normally use permission `755`;
- files normally use permission `644`;
- PHP 8 or later is selected;
- `assets/app.css` and `assets/app.js` preserve their exact names;
- HTTPS is enabled for the public domain.

---

## Scientific basis

The complete model description is available in:

```text
docs/Scientific_Basis.pdf
```

The documentation describes channel-path generation, route coverage, connector geometry, coolant flow, pressure-drop estimation, ambient losses, coolant heat pickup, copper temperature-field calculation, assumptions, and numerical limitations.

---

## Model limitations

ColdPlate Studio is a reduced-order engineering model.

The results should not be treated as:

- manufacturing-release data;
- product certification;
- safety certification;
- a replacement for detailed CFD;
- a replacement for experimental testing;
- a guarantee of real-world performance.

Real performance can be influenced by surface roughness, thermal-contact resistance, thermal-interface materials, nonuniform processor heat flux, temperature-dependent material properties, manufacturing tolerances, fouling, leakage, pump behavior, tubing and fitting losses, manifold losses, two-phase flow, deformation, and structural effects.

Final designs should be validated using appropriate CFD, structural checks, manufacturing reviews, leak testing, pressure testing, and experimental thermal measurements.

---

## Security

Do not commit passwords, hosting credentials, API keys, access tokens, private server paths, or confidential customer data.

Security issues should be reported privately according to `SECURITY.md`.

---

## Contributing

Contributions are welcome.

Before submitting a change:

1. Create a dedicated branch.
2. Explain the engineering purpose of the modification.
3. Identify any correlations or assumptions that were changed.
4. Test the application with default and extreme input cases.
5. Confirm that the report and export functions still work.
6. Submit a pull request with a clear technical description.

See `CONTRIBUTING.md` for additional guidance.

---

## Citation

When the software, methodology, results, or figures are used in academic or engineering work, please cite the project.

Citation metadata is provided in:

```text
CITATION.cff
```

Suggested citation:

> Taoufiq KAOUTARI, *ColdPlate Studio: Thermo-hydraulic design and optimization of serpentine liquid-cooled cold plates*, HyDynamics, 2026.

---

## Author

**Taoufiq KAOUTARI**  
**HyDynamics**

Areas of work:

- thermal management;
- heat transfer;
- fluid mechanics;
- numerical modelling;
- electronics cooling;
- liquid-cooled cold plates.

---

## License

This project is distributed under the license provided in the repository `LICENSE` file.

---

## Quick links

- **Live demonstration:** [https://plate.kaoutari.cloud/](https://plate.kaoutari.cloud/)
- **Scientific documentation:** `docs/Scientific_Basis.pdf`
- **Core solver:** `solver.php`
- **Calculation endpoint:** `calculate.php`
- **Application interface:** `index.php`
- **Reporting module:** `report.php`
- **Spreadsheet export:** `export.php`

---

<p align="center">
  <strong>ColdPlate Studio</strong><br>
  Rapid thermo-hydraulic screening for liquid-cooled electronic systems
</p>
