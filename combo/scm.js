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
                iDispCards  = 7;
                break;
            case 3:
                sLimit      = '1';
                iDispCards  = 8;
                break;
            case 4:
                sLimit      = '2';
                iDispCards  = 10;
                break;
            }
        })();

        $('.chara_set .arts_card .count').text(sLimit).each(function () {
            shuffleCard($(this));
        });
        updUndoButton();
    }

    $(function () {
        (function () {
            var iId = 1;
            $('.arts_card').each(function () {
                $(this).attr('id', 'arts' + iId);
                iId++;
            });
            $('.chara_set').each(function () {
                shuffleCard($(this));
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
            } else {
                // リセット処理はしないと言われた場合、プレーヤー人数セレクトボックスの選択状態を元に戻す
                $(this).val(iPlayers);
            }
        });
        $('.chara_set .arts_card').on('click', function () {
            var $self = $(this);
            var iCount = parseInt($self.find('.count').text());
            iCount--;
            if (iCount <= 0) {
                $self.find('.count').text(sLimit);
                var $hidden = $self.siblings('.hide');
                var $appear = $hidden.eq(parseInt(Math.random() * $hidden.size()));
                $appear.removeClass('hide');
                $self.addClass('hide');
                addUndoLog($self, 'disappear', {'appear_id' : $appear.attr('id')});
            } else {
                $self.find('.count').text(iCount);
                addUndoLog($self, 'count_down');
            }
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
        $('.handle .toggle_trump').on('click', function () {
            $('.arrow > *').toggle();
            $('.handle .toggle_trump').toggle();
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
