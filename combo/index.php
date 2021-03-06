<?php
if (preg_match(';/index.php[#?]?;', $_SERVER['REQUEST_URI'])) {
    header('Location: ./');
    exit;
}
$title = 'スピードコンボマスター';
function createArtName ($seed) {
    $prime = floor($seed / 8);
    $second = $seed % 8;
    switch ($prime) {
    case 0:
        $prime = 'アイス';
        break;
    case 1:
        $prime = 'グランド';
        break;
    case 2:
        $prime = 'サンダー';
        break;
    case 3:
        $prime = 'フレイム';
        break;
    case 4:
        $prime = 'ダーク';
        break;
    case 5:
        $prime = 'ルーン';
        break;
    case 6:
        $prime = 'ライト';
        break;
    case 7:
        $prime = 'ビースト';
        break;
    }
    switch ($second) {
    case 0:
        $second = 'セイバー';
        break;
    case 1:
        $second = 'スラッシュ';
        break;
    case 2:
        $second = 'アロー';
        break;
    case 3:
        $second = 'ストーム';
        break;
    case 4:
        $second = 'バースト';
        break;
    case 5:
        $second = 'ボム';
        break;
    case 6:
        $second = 'レイド';
        break;
    case 7:
        $second = 'ブレイク';
        break;
    }
    return $prime . $second;
}
function initArts() {
    $aArts = array();
    $aNG = array('111', '222', '333', '444');
    for ($k = 0 ; $k < 64 ; $k++) {
        $sCom = '';
        $seed = ($k + 3) % 64;
        for ($l = 0 ; $l < 3 ; $l++) {
            $sCom .= (string)($seed % 4 + 1);
            $seed /= 4;
        }
        if (strlen($sCom) != 3) {
            continue;
        }
        if (in_array($sCom, $aNG)) {
            continue;
        }
        $aArts[] = array(
            'name'      => createArtName($k),
            'command'   => $sCom,
        );
        //$aNG[] = substr($sCom, 1, 2) . '1';
        //$aNG[] = substr($sCom, 1, 2) . '2';
        //$aNG[] = substr($sCom, 1, 2) . '3';
        //$aNG[] = substr($sCom, 1, 2) . '4';
        //$aNG[] = '1' . substr($sCom, 0, 2);
        //$aNG[] = '2' . substr($sCom, 0, 2);
        //$aNG[] = '3' . substr($sCom, 0, 2);
        //$aNG[] = '4' . substr($sCom, 0, 2);
    }
    return $aArts;
}
$aArtCommand = initArts();

$sArtsHtml = '';
foreach ($aArtCommand as $val) {
    $sCommand = '';
    $sCommandData = '';
    $aCommand = str_split($val['command']);
    for ($j = 0 ; $j < count($aCommand) ; $j++) {
        $sCommand .='<span class="arrow">';
        switch ($aCommand[$j]) {
        case '1':
            $sCommand .= '<img src="img/trump/spade.png" style="display:none" />';
            $sCommand .= '<span class="punch">P</span>';
            $sCommandData .= 'P';
            break;
        case '2':
            $sCommand .= '<img src="img/trump/club.png" style="display:none" />';
            $sCommand .= '<span class="kick">K</span>';
            $sCommandData .= 'K';
            break;
        case '3':
            $sCommand .= '<img src="img/trump/dia.png" style="display:none" />';
            $sCommand .= '<span class="glove">G</span>';
            $sCommandData .= 'G';
            break;
        case '4':
            $sCommand .= '<img src="img/trump/heart.png" style="display:none" />';
            $sCommand .= '<span class="tackle">T</span>';
            $sCommandData .= 'T';
            break;
        }
        $sCommand .='</span>';
    }
    $sArtsHtml .= <<<_eos_
        <div class="arts_card">
            <!-- <img class="main" src="./img/elf.png" /> -->
            <div class="summary_info">
                <span class="name">{$val['name']}</span><br />
                <!-- <span class="count">2</span> -->
                <span class="command" data-command="{$sCommandData}">{$sCommand}</span>
            </div>
        </div>

_eos_;
}

$sLifeHtml = '<div class="life_count_frame">';
for ($i = 1 ; $i <= 4 ; $i++) {
    $sLifeHtml .= "<div class='life_count'>プレーヤー$i ライフ：";
    $sLifeHtml .= "<select>";
    $sLifeHtml .= "<option selected>20</option>";
    for ($j = 19 ; $j >= 0 ; $j--) {
        $sLifeHtml .= "<option>$j</option>";
    }
    $sLifeHtml .= "</select>";
    $sLifeHtml .= "<div class='life_bar'><div class='remain'></div></div>";
    $sLifeHtml .= "</div>";
}
$sLifeHtml .= "</div>";

?>
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,user-scalable=yes,initial-scale=1,minimum-scale=1" />
<meta name="robots" content="noindex,follow" />
<title><?=$title?></title>
<link rel="stylesheet" type="text/css" href="style.css?ver=20160220" />
</head>
<body>
<p class="browser_only">
    自作ボードゲーム<a href="/2015/12/27/293/">「スピードコンボマスター」</a>で利用するコマンドカードコンソールです。
</p>
<div class="handle">
    <!--
    <div>
        <button class="toggle_trump" style="background-color:rgb(20, 170, 255);">トランプで遊ぶ</button>
        <button class="toggle_trump" style="background-color:rgb(20, 170, 255);display:none;">コマンドに戻す</button>
    </div>
    -->
    プレーヤー人数
    <select name="players">
        <option value="0">選択して下さい</option>
        <option value="2">2人</option>
        <option value="3">3人</option>
        <option value="4">4人</option>
    </select>
    <br />
    &nbsp;<br />
    <!--
    <button class="undo invalid">元に戻す</button>
    <button class="redo invalid">やり直し</button>
    -->
</div>
<div id="game_board" style="display:none;">
    <button class="shuffle_button">シャッフル</button>
    <div class="chara_set clearfix">
        <div class="card_list">
            <?=$sArtsHtml?>
        </div>
    </div>
</div>
<div id="command_input_console">
    <input type="hidden" id="combo_command" />
    <ul id="command_list" class="clearfix">
        <span class="placeholder" style="display:none;">ボタンを押してコマンド入力</span>
    </ul>
    <ul id="combo_list"></ul>
    <button class="open_combo_list">+</button>
    <div id="combo_damage" style="display:none;">[P][K][G][T]ボタンを押してコマンドを入力して下さい↓</div>
    <button class="motion punch">P</button>
    <button class="motion kick">K</button>
    <button class="motion glove">G</button>
    <button class="motion tackle">T</button>
    <br />
    <button class="delete_command_button">１つ消す</button>
    <button class="delete_combo_button">全て消す</button>
    <button class="combo_start_button">発動</button>
</div>
<?=$sLifeHtml?>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="scm.js"></script>
</body>
</html>
