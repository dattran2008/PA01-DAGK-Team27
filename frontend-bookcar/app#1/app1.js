
//Submit Request
$("form").on("submit", function (e) {
    e.preventDefault();
    var name = $('#inputName').val();
    var phone_number = $('#inputPhone').val();
    var address = $('#inputAddress').val();
    var note = $('#inputNotes').val();
    var state = REQ_STATUS_UNIDENTIFIED;
    //var date_request = moment().format('YYYY-MM-DD HH:mm');

    const dataReq = {
        name,
        phone_number,
        address,
        note,
        state
    };

    console.log(dataReq);
    $.ajax({
        url: 'http://localhost:3000/request',
        type: 'POST',
        dataType: 'json',
        data: JSON.parse(JSON.stringify(dataReq)),
        success: function () {
            $("#alert-success").show(200);
            $("#alert-danger").hide();
            setTimeout(function () {
                $("#alert-success").hide(200);
            }, 3000);

            $("#name").val("");
            $("#phone").val("");
            $("#address").val("");
            $("#note").val("");
        },
        error: function () {
            $("#alert-success").hide();
            $("#alert-danger").show(200);
            setTimeout(function () {
                $("#alert-danger").hide(200);
            }, 3000);

        }
    });
})