"use strict";

$(main);

function main() {
    var $notice = $("#games-menu-notice");
    var $close = $("#games-menu-notice-close");

    function dismissNotice() {
        $notice.addClass("is-hidden");
        $("body").css("overflow", "");
    }

    $("body").css("overflow", "hidden");
    $close.on("click", dismissNotice);
    $notice.on("click", function (e) {
        if (e.target === this) {
            dismissNotice();
        }
    });

    $("#tetris-card").click(function () {
        window.location = "tetris/";
    });
    $("#memory-card").click(function () {
        window.location = "memory/";
    });
}


