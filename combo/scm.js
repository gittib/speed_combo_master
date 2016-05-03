(function ($) {
    var iPlayers = 0;
    var sLimit;
    var iDispCards;
    var aUndoLog = [];
    var aRedoLog = [];

    function shuffleCard($dom) {
        var $cardList = $dom.closest('.chara_set').find('.card_list .arts_card');
        var iScrollTop = $(window).scrollTop();
        var iCard = $cardList.size();
        $cardList.addClass('hide');
        for (var i = 0 ; i < iDispCards ; i++) {
            var $hidden = $cardList.filter('.hide');
            $hidden.eq(parseInt(Math.random() * $hidden.size()))
                .removeClass('hide');
        }
    }

    function updUndoButton () {
        if (0 < aUndoLog.length) {
            $('.undo').removeClass('invalid');
        } else {
            $('.undo').addClass('invalid');
        }
        if (0 < aRedoLog.length) {
            $('.redo').removeClass('invalid');
        } else {
            $('.redo').addClass('invalid');
        }
    }

    // コマンド確認して使用可能ならコマンド名とダメージを表示する
    function checkCommand () {
        var _checkCombo = function (com) {
            var $com = $('.arts_card .command[data-command="'+com.toUpperCase()+'"]');

            if ($com.size() <= 0) {
                return 0;
            }
            if ($com.closest('.arts_card').hasClass('hide')) {
                return 0;
            }

            // ここまで来たら有効なコマンドなので、ダメージ計算と発動処理を実行
            var damage = 0;
            var $summ = $com.closest('.summary_info');
            if ($summ.hasClass('used')) {
                damage += 1;
            } else {
                damage += 2;
            }
            $summ.addClass('used');

            $('#combo_list').append('<li><span style="font-weight:bold">'+$com.siblings('.name').text()+'</span>発動！</li>');

            return damage;
        };

        var $comboList = $('#combo_list');
        $comboList.css('background-color', 'white').empty();
        var sCommand = $('#combo_command').val();
        var iSumDamage = 0;
        for (var i = 0 ; i < sCommand.length - 2 ; i++) {
            iSumDamage += _checkCombo(sCommand.substr(i, 3));
        }
        $comboList.css('height', 'auto');
        $('#combo_damage').html('<span class="damage_num">'+iSumDamage+'</span>ダメージ！');
    }

    function resetGame (iNewPlayers) {
        // ゲームのリセット処理
        $('#game_board').show();
        aUndoLog = [];
        aRedoLog = [];

        (function _changePlayers () {
            if (iNewPlayers) {
                iPlayers = iNewPlayers;
            }
            switch (iPlayers) {
            case 2:
                sLimit      = '1';
                iDispCards  = 8;
                break;
            case 3:
                sLimit      = '1';
                iDispCards  = 8;
                break;
            case 4:
                sLimit      = '2';
                iDispCards  = 8;
                break;
            }
        })();

        // $('.chara_set .arts_card .count').text(sLimit);
        $('.chara_set .arts_card .count').text(' ');
        $('.life_count').hide();
        $('.life_count select').val(20);
        $('.life_count:lt('+iPlayers+')').show();
        shuffleCard($('.chara_set .arts_card'));
        updUndoButton();
    }

    $(function () {
        (function () {
            var iId = 1;
            $('.arts_card').each(function () {
                $(this).attr('id', 'arts' + iId);
                iId++;
            });
        })();

        $('.handle [name=players]').on('change', function () {
            var bReset;
            if (iPlayers == 0) {
                bReset = true;
            } else if ($(this).val() == 0) {
                bReset = false;
            } else {
                bReset = confirm('プレーヤー人数を変更すると、ゲームがリセットされます。よろしいですか？');
            }
            if (bReset) {
                resetGame(parseInt($(this).val()));
                $('#command_list .placeholder, #combo_damage').show();
            } else {
                // リセット処理はしないと言われた場合、プレーヤー人数セレクトボックスの選択状態を元に戻す
                $(this).val(iPlayers);
            }
        });
        $('.shuffle_button').on('click', function () {
            $('.arts_card .summary_info').removeClass('used');
            shuffleCard($('.arts_card'));
            $('#command_list').empty();
            $('#combo_list').empty();
            $('#combo_damage').empty();
        });
        $('#command_input_console button.motion').on('click', function () {
            var $self = $(this);
            var sHtml = '<li class="'+$self.attr('class')+'">'+$self.text()+'</li>';
            $('#command_list .placeholder').remove();
            $('#command_list').append(sHtml);
        });
        $('.open_combo_list').on('click', function () {
            var $comboList = $('#combo_list');
            $comboList.css({
                'height' :  'auto',
                'background-color': 'white',
            });
            $('.open_combo_list').css('opacity', 0);
        });
        $('.delete_command_button').on('click', function () {
            $('#command_list > li:last').remove();
        });
        $('.delete_combo_button').on('click', function () {
            $('#command_list').empty();
            $('#combo_list').css({
                'height' :  0,
                'background-color': 'gray',
            });
            $('.open_combo_list').css('opacity', 1);
        });
        $('.combo_start_button').on('click', function () {
            var sCommand = '';
            $('#command_list > li').each(function () {
                sCommand += $(this).text();
            });
            $('#combo_command').val(sCommand);
            checkCommand();
            $('.open_combo_list').css('opacity', 0);
        });
        $('.life_count select').on('change', function () {
            var iBar = parseInt($(this).val());
            var $bar = $(this).closest('.life_count').find('.remain');
            if (iBar <= 6) {
                $bar.addClass('pinch');
            } else {
                $bar.removeClass('pinch');
            }
            $bar.css('width', iBar*5 + '%');
        });

        $('.chara_set .arts_card').on('click', function () {
            var $self = $(this);

            // 全部一気に差し替えるパターンではとりあえず色変えだけで終了
            var $card = $self.find('.summary_info');
            $card.toggleClass('used');

            // 1枚1枚チェンジするパターン
            // var iCount = parseInt($self.find('.count').text());
            // iCount--;
            // if (iCount <= 0) {
            //     $self.find('.count').text(sLimit);
            //     var $hidden = $self.siblings('.hide');
            //     var $appear = $hidden.eq(parseInt(Math.random() * $hidden.size()));
            //     $appear.removeClass('hide');
            //     $self.addClass('hide');
            //     addUndoLog($self, 'disappear', {'appear_id' : $appear.attr('id')});
            // } else {
            //     $self.find('.count').text(iCount);
            //     addUndoLog($self, 'count_down');
            // }
        });
        $('.undo').on('click', function () {
            if (0 < aUndoLog.length) {
                var aLog = aUndoLog.pop();
                switch (aLog.type) {
                case 'count_down':
                    $('#'+aLog.id+' .count').text(parseInt($('#'+aLog.id+' .count').text())+1);
                    break;
                case 'disappear':
                    $('#'+aLog.id).removeClass('hide').find('.count').text('1');
                    $('#'+aLog.appear_id).addClass('hide');
                    break;
                }
                aRedoLog.push(aLog);
                updUndoButton();
            }
        });
        $('.redo').on('click', function () {
            if (0 < aRedoLog.length) {
                var aLog = aRedoLog.pop();
                switch (aLog.type) {
                case 'count_down':
                    $('#'+aLog.id+' .count').text(parseInt($('#'+aLog.id+' .count').text())-1);
                    break;
                case 'disappear':
                    $('#'+aLog.id).addClass('hide');
                    $('#'+aLog.appear_id).removeClass('hide').find('.count').text(sLimit);
                    break;
                }
                aUndoLog.push(aLog);
                updUndoButton();
            }
        });

        function addUndoLog($dom, actionType, params) {
            switch (actionType) {
            case 'count_down':
                aUndoLog.push({
                    'id'    : $dom.attr('id'),
                    'type'  : 'count_down',
                });
                break;
            case 'disappear':
                aUndoLog.push({
                    'id'        : $dom.attr('id'),
                    'type'      : 'disappear',
                    'appear_id' : params.appear_id,
                });
                break;
            }
            aRedoLog = [];
            updUndoButton();
        }
    });
})(jQuery);
