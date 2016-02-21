let $ = require('jquery');
let Howler = require('howler');
let Store = require('store');

$(function () {

    if (typeof Store.get('counts') !== 'undefined') {
        var storeObj = Store.get('counts');
        $('#qty').val(storeObj.unhappy)
        $('#qty2').val(storeObj.neutral)
        $('#qty3').val(storeObj.happy)
    }

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

        Store.set('counts', {
            unhappy: $('#qty').val(),
            neutral: $('#qty2').val(),
            happy: $('#qty3').val()
        })
    });
    $('.js-reset').click(function (e) {
        var test = confirm('This will reset all the counters!');
        if (test === true){
            Store.remove('counts');
            $('#qty').val(0)
            $('#qty2').val(0)
            $('#qty3').val(0)
        }
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
