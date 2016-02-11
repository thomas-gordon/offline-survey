let $ = require('jquery');
let Howler = require('howler');

$(function () {
    var sound = new Howler.Howl({
        urls: ['/audio/ping.mp3']
    });

    $('img').mouseup(function () {
        sound.play();
        let currentVal = $(this).closest('.option').find('.js-field').val();
        currentVal++;
        $(this).closest('.option').find('.js-field').val(currentVal);
        $.ajax({
            url: "/save",
            type: "POST",
            data: {
                unhappy: $('#qty').val(),
                neutral: $('#qty2').val(),
                happy: $('#qty3').val()
            }
        });

    });
    $('.js-reset').click(function (e) {
        $('.js-field').val(0)
    });
    $('.js-toggle').click(function () {
        $('.box').slideToggle();
    });
    $('.js-write').click(function () {
        var continueConditional = confirm('Are you sure you want to finalise?');
        if (continueConditional) {
            $.ajax({
                url: "/finalise",
                type: "POST"
            }).done(function () {
                alert('Finalisation point written to text file.')
            });
        } else {
            alert('Finalisation cancelled.')
        }
    })
});
