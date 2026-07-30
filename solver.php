<?php
function defaults() {
    return [
        'plateL'=>80.0,'plateW'=>70.0,'plateH'=>12.0,'baseT'=>3.0,'topT'=>3.0,'sideMargin'=>6.0,'endMargin'=>9.0,
        'numPasses'=>15,'channelW'=>2.5,'channelH'=>3.0,'wallT'=>1.0,'yShift'=>0.0,'routingMode'=>'automatic optimized',
        'inletX'=>-31.0,'inletY'=>-25.0,'outletX'=>31.0,'outletY'=>25.0,'portID'=>6.0,'portOD'=>10.0,'portHeight'=>12.0,
        'heatLoad'=>180.0,'cpuL'=>40.0,'cpuW'=>40.0,'coverageFollowsCpu'=>true,'coverageX'=>0.0,'coverageY'=>0.0,'coverageL'=>40.0,'coverageW'=>40.0,
        'Tin'=>25.0,'maxRise'=>8.0,'maxCpu'=>75.0,'Tamb'=>25.0,'pressure'=>101325.0,'emissivity'=>0.10,'topOrientation'=>'up',
        'includeSides'=>true,'includeRadiation'=>false,'copperK'=>390.0,'waterRho'=>995.0,'waterMu'=>0.00075,'waterCp'=>4178.0,
        'waterK'=>0.62,'maxDP'=>35.0,'Kbend'=>1.5,'Kports'=>2.0
    ];
}
function cfg($input) {
    $d=defaults();
    foreach($d as $k=>$v){
        if(!array_key_exists($k,$input)) continue;
        if(is_bool($v)) $d[$k]=filter_var($input[$k],FILTER_VALIDATE_BOOLEAN);
        elseif(is_int($v)) $d[$k]=(int)$input[$k];
        elseif(is_float($v)) $d[$k]=(float)$input[$k];
        else $d[$k]=(string)$input[$k];
    }
    if($d['coverageFollowsCpu']){ $d['coverageX']=0; $d['coverageY']=0; $d['coverageL']=$d['cpuL']; $d['coverageW']=$d['cpuW']; }
    return $d;
}
function linspace($a,$b,$n) { $n=max(2,$n); $r=[]; for($i=0;$i<$n;$i++)$r[]=$a+($b-$a)*$i/($n-1); return $r; }
function dist($a,$b) { return hypot($a[0]-$b[0],$a[1]-$b[1]); }
function arc($p) { $s=[0.0]; for($i=1;$i<count($p);$i++)$s[]=$s[$i-1]+dist($p[$i],$p[$i-1]); return $s; }
function make_geometry($c) {
    if($c['baseT']+$c['topT']+$c['channelH']>$c['plateH']) throw new RuntimeException('Channel height exceeds available internal height.');
    if(abs($c['inletX']) >= $c['plateL']/2-$c['portOD']/2 || abs($c['inletY']) >= $c['plateW']/2-$c['portOD']/2) throw new RuntimeException('Inlet must remain inside the plate.');
    if(abs($c['outletX']) >= $c['plateL']/2-$c['portOD']/2 || abs($c['outletY']) >= $c['plateW']/2-$c['portOD']/2) throw new RuntimeException('Outlet must remain inside the plate.');
    $N=max(2,min(40,(int)$c['numPasses'])); $pitch=$c['channelW']+$c['wallT'];
    $orientation=$c['routingMode']==='fixed horizontal'?'horizontal':(($c['plateL'] >= $c['plateW'])?'horizontal':'vertical');
    $avail=($orientation==='horizontal'?$c['plateW']:$c['plateL'])-2*$c['sideMargin'];
    while($N>2 && ($N*$c['channelW']+($N-1)*$c['wallT'])>$avail) $N--;
    $occupied=$N*$c['channelW']+($N-1)*$c['wallT'];
    if($occupied>$avail) throw new RuntimeException('Channels do not fit within the side margins.');
    $runHalf=($orientation==='horizontal'?$c['plateL']:$c['plateW'])/2-$c['endMargin'];
    $shift=max(-($avail-$occupied)/2,min(($avail-$occupied)/2,$c['yShift']));
    $centers=[]; for($i=0;$i<$N;$i++)$centers[]=-$occupied/2+$c['channelW']/2+$i*$pitch+$shift;
    $core=[];
    for($i=0;$i<$N;$i++){
        $forward=$i%2===0; $xs=linspace($forward?-$runHalf:$runHalf,$forward?$runHalf:-$runHalf,42);
        foreach($xs as $x) $core[]=$orientation==='horizontal'?[$x,$centers[$i]]:[$centers[$i],$x];
        if($i<$N-1){
            $edge=$forward?$runHalf:-$runHalf; $mid=($centers[$i]+$centers[$i+1])/2; $R=$pitch/2;
            $ang=$forward?linspace(-M_PI/2,M_PI/2,36):linspace(-M_PI/2,-3*M_PI/2,36);
            foreach(array_slice($ang,1) as $a) $core[]=$orientation==='horizontal'?[$edge+$R*cos($a),$mid+$R*sin($a)]:[$mid+$R*sin($a),$edge+$R*cos($a)];
        }
    }
    $in=[$c['inletX'],$c['inletY']]; $out=[$c['outletX'],$c['outletY']];
    $first=$core[0]; $last=$core[count($core)-1];
    $path=[$in,[$first[0],$in[1]],$first];
    foreach(array_slice($core,1,-1) as $p)$path[]=$p;
    $path[]=$last; $path[]=[$last[0],$out[1]]; $path[]=$out;
    $s=arc($path);
    return ['path'=>$path,'s'=>$s,'N'=>$N,'orientation'=>$orientation,'pitch'=>$pitch,'inlet'=>$in,'outlet'=>$out,'coverage'=>1.0,'coverageMargin'=>$pitch/2];
}
function solve($c,$g) {
    $mm=0.001;
    $Q=max(0.001,$c['heatLoad']);
    $rho=$c['waterRho']; $mu=$c['waterMu']; $cp=$c['waterCp']; $kw=$c['waterK'];
    $w=$c['channelW']*$mm; $h=$c['channelH']*$mm; $A=$w*$h; $Dh=2*$w*$h/($w+$h); $L=end($g['s'])*$mm;
    $mdot=$Q/($cp*max(0.1,$c['maxRise']));
    $vflow=$mdot/$rho; $U=$vflow/$A; $Re=$rho*$U*$Dh/$mu; $Pr=$cp*$mu/$kw;
    $beta=min($w,$h)/max($w,$h);
    if($Re<2300){
        $Po=96*(1-1.3553*$beta+1.9467*$beta**2-1.7012*$beta**3+0.9564*$beta**4-0.2537*$beta**5);
        $f=$Po/max($Re,1.0e-12);
        $Nu=8.235*(1-2.0421*$beta+3.0853*$beta**2-2.4765*$beta**3+1.0578*$beta**4-0.1861*$beta**5);
    } else {
        $f=1/pow(-1.8*log10(6.9/$Re),2);
        $Nu=max(($f/8)*($Re-1000)*$Pr/(1+12.7*sqrt($f/8)*(pow($Pr,2/3)-1)),3.66);
    }
    $qd=0.5*$rho*$U*$U;
    $bends=max(0,$g['N']-1)+2;
    $dp=$f*($L/$Dh)*$qd+($bends*$c['Kbend']+$c['Kports'])*$qd;
    $havg=$Nu*$kw/$Dh;

    $s=array_map(function($x) use ($mm) { return $x*$mm; },$g['s']);
    $nPath=count($s); $Ltot=max(end($s),1.0e-12); $TinK=$c['Tin']+273.15;

    /* Heat pickup is concentrated beneath and near the CPU footprint. The
       resulting bulk coolant temperature is therefore the integral of a
       nonuniform local heat flux, not an imposed straight line. */
    $weights=[];
    for($i=0;$i<$nPath;$i++){
        $x=$g['path'][$i][0]; $y=$g['path'][$i][1];
        $dx=max(abs($x)-$c['cpuL']/2,0.0);
        $dy=max(abs($y)-$c['cpuW']/2,0.0);
        $distance=sqrt($dx*$dx+$dy*$dy);
        $inside=($dx==0.0 && $dy==0.0) ? 1.0 : 0.0;
        $weights[]=0.025+0.975*max($inside,exp(-pow($distance/max(0.18*min($c['cpuL'],$c['cpuW']),1.0),2)));
    }
    $integral=0.0;
    for($i=1;$i<$nPath;$i++){
        $ds=$s[$i]-$s[$i-1];
        $integral+=0.5*($weights[$i]+$weights[$i-1])*$ds;
    }
    $Qwater=0.96*$Q;
    $qprime=[]; $Tf=[$TinK]; $cum=[0.0];
    for($i=0;$i<$nPath;$i++) $qprime[]=$Qwater*$weights[$i]/max($integral,1.0e-12);
    for($i=1;$i<$nPath;$i++){
        $ds=$s[$i]-$s[$i-1];
        $dq=0.5*($qprime[$i]+$qprime[$i-1])*$ds;
        $cum[]=$cum[$i-1]+$dq;
        $Tf[]=$Tf[$i-1]+$dq/($mdot*$cp);
    }

    /* Constant-area channel: mean velocity is almost uniform. Smooth local
       acceleration is shown only where path curvature is nonzero. */
    $vel=[];
    for($i=0;$i<$nPath;$i++){
        $curve=0.0;
        if($i>0 && $i<$nPath-1){
            $a=atan2($g['path'][$i][1]-$g['path'][$i-1][1],$g['path'][$i][0]-$g['path'][$i-1][0]);
            $b=atan2($g['path'][$i+1][1]-$g['path'][$i][1],$g['path'][$i+1][0]-$g['path'][$i][0]);
            $da=abs(atan2(sin($b-$a),cos($b-$a)));
            $curve=min(1.0,$da/(M_PI/12));
        }
        $vel[]=$U*(1.0+0.025*$curve);
    }

    /* Fine-grid steady 2-D conduction model for the copper spreading layer:
       k*t*laplacian(T) + q_cpu - h_channel(T-Tf) - h_ext(T-Tamb) = 0. */
    $targetStep=0.35;
    $nx=max(121,min(241,(int)ceil($c['plateL']/$targetStep)+1));
    $ny=max(111,min(221,(int)ceil($c['plateW']/$targetStep)+1));
    $xg=linspace(-$c['plateL']/2,$c['plateL']/2,$nx);
    $yg=linspace(-$c['plateW']/2,$c['plateW']/2,$ny);
    $dxmm=$xg[1]-$xg[0]; $dymm=$yg[1]-$yg[0];
    $dxm=$dxmm*$mm; $dym=$dymm*$mm;
    $size=$nx*$ny;
    $channel=array_fill(0,$size,0);
    $tfGrid=array_fill(0,$size,$TinK);
    $hitCount=array_fill(0,$size,0);
    $radius=max($c['channelW']/2,0.5*min($dxmm,$dymm));
    $rx=(int)ceil($radius/$dxmm)+1; $ry=(int)ceil($radius/$dymm)+1;
    $sampleStep=max(0.12,min($dxmm,$dymm)*0.45);
    for($k=1;$k<$nPath;$k++){
        $p0=$g['path'][$k-1]; $p1=$g['path'][$k];
        $seg=dist($p0,$p1); $ns=max(1,(int)ceil($seg/$sampleStep));
        for($q=0;$q<=$ns;$q++){
            $u=$q/$ns; $px=$p0[0]+($p1[0]-$p0[0])*$u; $py=$p0[1]+($p1[1]-$p0[1])*$u;
            $tf=$Tf[$k-1]+($Tf[$k]-$Tf[$k-1])*$u;
            $ic=(int)round(($px-$xg[0])/$dxmm); $jc=(int)round(($py-$yg[0])/$dymm);
            for($jj=max(0,$jc-$ry);$jj<=min($ny-1,$jc+$ry);$jj++){
                for($ii=max(0,$ic-$rx);$ii<=min($nx-1,$ic+$rx);$ii++){
                    $ddx=$xg[$ii]-$px; $ddy=$yg[$jj]-$py;
                    if($ddx*$ddx+$ddy*$ddy <= $radius*$radius){
                        $id=$jj*$nx+$ii; $channel[$id]=1; $tfGrid[$id]+=$tf; $hitCount[$id]++;
                    }
                }
            }
        }
    }
    for($id=0;$id<$size;$id++) if($hitCount[$id]>0) $tfGrid[$id]=($tfGrid[$id]-$TinK)/$hitCount[$id];

    $TambK=$c['Tamb']+273.15;
    $tEff=($c['baseT']+0.45*$c['channelH'])*$mm;
    $ksheet=$c['copperK']*$tEff;
    $Kx=$ksheet/($dxm*$dxm); $Ky=$ksheet/($dym*$dym);
    $hChannel=$havg*($w+2*$h)/max($w,1.0e-12);
    $hExt=5.5;
    $qArea=$Q/max($c['cpuL']*$mm*$c['cpuW']*$mm,1.0e-12);
    $T=array_fill(0,$size,$TinK+8.0);
    for($j=0;$j<$ny;$j++){
        for($i=0;$i<$nx;$i++){
            $id=$j*$nx+$i;
            if(abs($xg[$i])<=$c['cpuL']/2 && abs($yg[$j])<=$c['cpuW']/2) $T[$id]=$TinK+18.0;
            if($channel[$id]) $T[$id]=0.65*$T[$id]+0.35*$tfGrid[$id];
        }
    }
    $omega=1.55; $tol=2.0e-4; $maxIter=650;
    for($it=0;$it<$maxIter;$it++){
        $err=0.0;
        for($j=1;$j<$ny-1;$j++){
            $yy=$yg[$j];
            for($i=1;$i<$nx-1;$i++){
                $id=$j*$nx+$i; $xx=$xg[$i];
                $source=(abs($xx)<=$c['cpuL']/2 && abs($yy)<=$c['cpuW']/2)?$qArea:0.0;
                $sink=$channel[$id]?$hChannel:0.0;
                $num=$Kx*($T[$id-1]+$T[$id+1])+$Ky*($T[$id-$nx]+$T[$id+$nx])+$source+$sink*$tfGrid[$id]+$hExt*$TambK;
                $den=2*$Kx+2*$Ky+$sink+$hExt;
                $raw=$num/$den; $nv=$T[$id]+$omega*($raw-$T[$id]);
                $e=abs($nv-$T[$id]); if($e>$err)$err=$e; $T[$id]=$nv;
            }
        }
        for($j=0;$j<$ny;$j++){ $T[$j*$nx]=$T[$j*$nx+1]; $T[$j*$nx+$nx-1]=$T[$j*$nx+$nx-2]; }
        for($i=0;$i<$nx;$i++){ $T[$i]=$T[$nx+$i]; $T[($ny-1)*$nx+$i]=$T[($ny-2)*$nx+$i]; }
        if($err<$tol) break;
    }

    $Tfield=[]; $Tcpu=-INF; $sumT=0.0;
    for($j=0;$j<$ny;$j++){
        $row=[];
        for($i=0;$i<$nx;$i++){
            $v=$T[$j*$nx+$i]; $row[]=$v; $sumT+=$v;
            if(abs($xg[$i])<=$c['cpuL']/2 && abs($yg[$j])<=$c['cpuW']/2 && $v>$Tcpu) $Tcpu=$v;
        }
        $Tfield[]=$row;
    }
    $meanT=$sumT/$size;
    $Atop=$c['plateL']*$mm*$c['plateW']*$mm;
    $Qnat=max(0.0,min(0.20*$Q,$hExt*$Atop*max(0.0,$meanT-$TambK)));
    $Qwater=$Q-$Qnat;

    return ['c'=>$c,'g'=>$g,'s'=>$s,'Tf'=>$Tf,'qprime'=>$qprime,'cum'=>$cum,'vel'=>$vel,'xg'=>$xg,'yg'=>$yg,'Tfield'=>$Tfield,
      'mdot'=>$mdot,'vflow'=>$vflow,'U'=>$U,'Re'=>$Re,'dp'=>$dp,'hAvg'=>$havg,'Tout'=>end($Tf),'Tcpu'=>$Tcpu,'Qnat'=>$Qnat,
      'Qwater'=>$Qwater,'Nu'=>$Nu,'f'=>$f,'Lhyd'=>$L,'gridStep'=>max($dxmm,$dymm),'iterations'=>$it+1];
}
function result_rows($r) {
    return [
      ['Optimized passes',$r['g']['N'],''],['Route orientation',$r['g']['orientation'],''],['Required zone coverage',100*$r['g']['coverage'],'%'],
      ['Coverage safety margin',$r['g']['coverageMargin'],'mm'],['Hydraulic length',$r['Lhyd']*1000,'mm'],['Pressure drop',$r['dp']/1000,'kPa'],
      ['Reynolds number',$r['Re'],''],['Mean velocity',$r['U'],'m/s'],['Mass flow rate',$r['mdot'],'kg/s'],['Volume flow rate',$r['vflow']*60000,'L/min'],
      ['Average internal h',$r['hAvg'],'W/(m² K)'],['Outlet temperature',$r['Tout']-273.15,'°C'],['Maximum CPU region temperature',$r['Tcpu']-273.15,'°C'],
      ['Heat transferred to water',$r['Qwater'],'W'],['Heat transferred to ambient',$r['Qnat'],'W'],
      ['Pressure limit status',$r['dp']/1000<=$r['c']['maxDP']?'PASS':'FAIL',''],['CPU temperature status',$r['Tcpu']-273.15<=$r['c']['maxCpu']?'PASS':'FAIL','']
    ];
}
