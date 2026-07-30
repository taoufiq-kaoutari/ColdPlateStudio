<?php
ini_set('display_errors','0');
require_once __DIR__ . '/solver.php';
try {
    $payload = isset($_POST['payload']) ? (string)$_POST['payload'] : '{}';
    $raw = json_decode($payload, true);
    if (!is_array($raw) || json_last_error() !== JSON_ERROR_NONE) throw new Exception('Invalid report data.');
    $c = cfg($raw);
    $r = solve($c, make_geometry($c));
    $rows = result_rows($r);
} catch (Exception $e) {
    http_response_code(422);
    exit('Report unavailable: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8'));
}
?><!doctype html><html><head><meta charset="utf-8"><title>Cold Plate Engineering Report</title><style>body{font-family:Arial,sans-serif;margin:32px;color:#14243a}header{display:flex;justify-content:space-between;border-bottom:3px solid #2868d8;padding-bottom:14px}h1{font-size:22px;margin:0}.tag{background:#e9f1ff;color:#245ec3;padding:6px 10px;border-radius:6px;font-weight:bold;font-size:11px}.note{background:#f2f6fb;border-left:4px solid #19a9c7;padding:11px;margin:18px 0;font-size:12px}.actions{margin-bottom:16px}button{padding:10px 14px;background:#2868d8;color:#fff;border:0;border-radius:6px}table{border-collapse:collapse;width:100%;font-size:12px}th,td{border-bottom:1px solid #dce5ef;padding:9px;text-align:left}th{background:#edf4fb}footer{margin-top:20px;color:#687b91;font-size:10px}@media print{.actions{display:none}body{margin:18mm}}</style></head><body><div class="actions"><button onclick="window.print()">Save as PDF</button></div><header><div><h1>Serpentine Cold Plate Design Report</h1><small>Thermal and hydraulic assessment</small></div><span class="tag">DEMO</span></header><div class="note">Temporary presentation document. Values are engineering estimates and are not certification or manufacturing release data.</div><table><thead><tr><th>Quantity</th><th>Value</th><th>Unit</th></tr></thead><tbody><?php foreach($rows as $x):?><tr><td><?=htmlspecialchars((string)$x[0],ENT_QUOTES,'UTF-8')?></td><td><?=is_numeric($x[1])?number_format((float)$x[1],4,'.',''):htmlspecialchars((string)$x[1],ENT_QUOTES,'UTF-8')?></td><td><?=htmlspecialchars((string)$x[2],ENT_QUOTES,'UTF-8')?></td></tr><?php endforeach?></tbody></table><footer>© <?=date('Y')?> Taoufiq KAOUTARI. All rights reserved.</footer></body></html>
