<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>ColdPlate Studio</title>

<style>

body{
    font-family: Arial, Helvetica, sans-serif;
    max-width: 1100px;
    margin: auto;
    padding: 40px;
    line-height: 1.7;
    color: #222;
    background: white;
}

h1{
    text-align:center;
    margin-bottom:5px;
}

h2{
    margin-top:50px;
    border-bottom:1px solid #cccccc;
    padding-bottom:8px;
}

h3{
    margin-top:30px;
}

.subtitle{
    text-align:center;
    color:#555;
    margin-bottom:40px;
}

.demo{
    border:1px solid #cccccc;
    padding:20px;
    margin:30px 0;
}

figure{
    margin:40px auto;
    text-align:center;
}

figure img{
    max-width:100%;
}

figcaption{
    margin-top:10px;
    color:#555;
    font-style:italic;
}

ul li{
    margin-bottom:10px;
}

</style>
</head>

<body>

<h1>ColdPlate Studio</h1>

<p class="subtitle">
Thermo-hydraulic design and optimization of serpentine liquid-cooled CPU cold plates
</p>

<p class="subtitle">
A practical engineering dashboard for geometry generation,
hydraulic assessment, thermal prediction, and design comparison.
</p>

<div class="demo">

<h3>Live online demonstration</h3>

<p>
<a href="https://plate.kaoutari.cloud/">
https://plate.kaoutari.cloud/
</a>
</p>

<p>
Open the link in any modern browser. No installation is required.
</p>

</div>

<figure>

<img src="https://github.com/user-attachments/assets/61c29a02-d1e4-402b-8a36-bc1a73a632a1">

<figcaption>
Figure 1. ColdPlate Studio engineering dashboard.
</figcaption>

</figure>

<h2>1. Project overview</h2>

<p>
ColdPlate Studio is a browser-based engineering application
dedicated to the rapid design and analysis of serpentine
liquid-cooled cold plates.
</p>

<p>
The application combines geometry generation, hydraulic
analysis, heat-transfer modelling, temperature-field
reconstruction, and automatic report generation.
</p>

<p>
The objective is not to replace high-fidelity CFD
simulations, but rather to accelerate the preliminary
engineering design process.
</p>

<h2>2. Online demonstration</h2>

<p>
A fully functional demonstration is available online.
Users can define the cold-plate geometry, execute the
thermo-hydraulic solver, visualize the results, and export
engineering reports.
</p>

<p>

<a href="https://plate.kaoutari.cloud/">
https://plate.kaoutari.cloud/
</a>

</p>

<h2>3. Who can benefit from the platform?</h2>

<ul>

<li>Thermal engineers</li>

<li>Mechanical engineers</li>

<li>Researchers</li>

<li>Students</li>

<li>Electronic-cooling specialists</li>

<li>Data-centre designers</li>

</ul>

<h2>4. What the application calculates</h2>

<h3>4.1 Geometry generation</h3>

<p>
The application automatically creates a serpentine channel
route while respecting the dimensions of the cold plate
and the cooling area associated with the processor.
</p>

<h3>4.2 Hydraulic analysis</h3>

<p>
The hydraulic model computes coolant velocity, pressure
drop, hydraulic length, flow rate, and the operating
regime inside the channel network.
</p>

<h3>4.3 Thermal analysis</h3>

<p>
The thermal solver predicts the coolant temperature,
heat-transfer rate, copper temperature distribution,
and maximum processor temperature.
</p>

<figure>

<img src="https://github.com/user-attachments/assets/7ee64b5f-ba70-4b9d-bf4f-81d0afdd31b9">

<figcaption>
Figure 2. Recommended engineering workflow.
</figcaption>

</figure>

<h2>5. CPU heat-capture optimization</h2>

<p>
The objective of ColdPlate Studio is not simply to reduce
temperature but to optimize the complete thermal system.
</p>

<ul>

<li>maximize heat extraction;</li>

<li>minimize hot spots;</li>

<li>maximize cooling-zone coverage;</li>

<li>limit pressure losses;</li>

<li>reduce pumping power requirements.</li>

</ul>

<figure>

<img src="https://github.com/user-attachments/assets/fef827ab-2121-4693-9b1f-5dcfd671a5ba">

<figcaption>
Figure 3. Interpretation of the principal design parameters.
</figcaption>

</figure>

<h2>6. Using the application</h2>

<ol>

<li>Define the plate geometry.</li>

<li>Define the channel network.</li>

<li>Place the inlet and outlet ports.</li>

<li>Specify the CPU thermal load.</li>

<li>Define the coolant properties.</li>

<li>Apply engineering constraints.</li>

<li>Generate the geometry.</li>

<li>Run the simulation.</li>

<li>Analyse the results.</li>

<li>Export reports.</li>

</ol>

<h2>7. Understanding the visual results</h2>

<h3>7.1 Planar channel route</h3>

<p>
This figure shows the complete channel trajectory and
the CPU cooling footprint.
</p>

<h3>7.2 Three-dimensional representation</h3>

<p>
The interactive 3D view helps engineers visualize the
internal structure of the cold plate.
</p>

<h3>7.3 Temperature evolution</h3>

<p>
The temperature profile illustrates heat absorption
along the hydraulic path.
</p>

<h3>7.4 Copper temperature distribution</h3>

<p>
The temperature field identifies hot spots and thermal
gradients across the plate.
</p>

<figure>

<img src="https://github.com/user-attachments/assets/397e8d04-2dc2-47dd-91e9-cebd79c6651a">

<figcaption>
Figure 4. Copper temperature distribution.
</figcaption>

</figure>

<h2>8. Interpreting the performance summary</h2>

<ul>

<li>Coverage ratio</li>

<li>Hydraulic length</li>

<li>Pressure drop</li>

<li>Reynolds number</li>

<li>Outlet temperature</li>

<li>Heat transferred to the coolant</li>

<li>Maximum CPU temperature</li>

</ul>

<h2>9. Recommended optimization strategy</h2>

<ul>

<li>Start from a manufacturable baseline design.</li>

<li>Change one parameter at a time.</li>

<li>Compare pressure drop and temperature simultaneously.</li>

<li>Validate the final geometry using CFD simulations.</li>

<li>Perform experimental measurements whenever possible.</li>

</ul>

<h2>10. Limitations</h2>

<p>
ColdPlate Studio is intended for engineering studies,
research activities, and preliminary design work. It is
not intended to replace detailed CFD analyses or
experimental validation.
</p>

<h2>11. Resources</h2>

<ul>

<li>Live demonstration: https://plate.kaoutari.cloud/</li>

<li>Scientific documentation</li>

<li>Solver source code</li>

<li>Export and reporting modules</li>

</ul>

<h2>12. Author</h2>

<p>

<strong>Taoufiq KAOUTARI</strong>

<br>

HyDynamics

<br>

Thermal management, heat transfer and fluid mechanics.

</p>

</body>
</html>
