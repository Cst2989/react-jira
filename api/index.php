<?php
// jSON URL which should be requested
$id = intval($_GET['id']);
$Rid = intval($_GET['Rid']);
$url = '';
$issues_url = $url.'rest/agile/latest/board/'.$id.'/issue';
$board_url = $url.'rest/agile/latest/board/'.$id;
$sprint_url = $url.'rest/greenhopper/latest/sprintquery/'.$Rid.'?includeHistoricSprints=true&includeFutureSprints=true';

$username = '';  // authentication
$password = '';  // authentication
// jSON String for request

// Initializing curl
$ch = curl_init( $issues_url );
$ch2 =  curl_init( $board_url );
$ch3 =  curl_init( $sprint_url );
// Configuring curl options
$options = array(
CURLOPT_RETURNTRANSFER => true,
CURLOPT_USERPWD => $username . ":" . $password,  // authentication
CURLOPT_HTTPHEADER => array('Content-type: application/json')
);
// Setting curl options
curl_setopt_array( $ch, $options );
curl_setopt_array( $ch2, $options );
curl_setopt_array( $ch3, $options );
// Getting results
$result = curl_exec($ch);
$result3 = curl_exec($ch3);
$result2 = curl_exec($ch2); // Getting jSON result string

$sprint_id = 0;
$sprints = json_decode($result3, true);

//echo '<pre>';
foreach($sprints['sprints'] as $key => $value) {
    if ($value['state']==='ACTIVE') {
        $sprint_id = $value['id'];
    }
}

$active_sprint = $url.'rest/greenhopper/latest/rapid/charts/sprintreport?rapidViewId='.$Rid.'&sprintId='.$sprint_id;

$ch4 =  curl_init( $active_sprint );
curl_setopt_array( $ch4, $options );
$result4 = curl_exec($ch4);
$sprint_info = json_decode($result4, true);
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
$chart_id = intval($_GET['chart']);
if ($chart_id) {
    $chart = $url.'rest/greenhopper/1.0/rapid/charts/scopechangeburndownchart.json?rapidViewId='.$Rid.'&sprintId='.$sprint_id;
    $ch5 =  curl_init( $chart );
    curl_setopt_array( $ch5, $options );
    $result5= curl_exec($ch5);
    echo $result5;
} else {
    echo json_encode(array_merge(json_decode($result, true),json_decode($result2, true), $sprint_info['sprint']));
}
//echo '<pre>'. $result4;
?>
