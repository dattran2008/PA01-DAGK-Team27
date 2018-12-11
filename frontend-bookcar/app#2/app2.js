var socket = io("http://localhost:3000");

$(function () {
    // Lấy danh sách customer
    $.ajax({
        url: "http://localhost:3000/request",
        type: "GET",
        dataType: "json",
        timeout: 10000
    }).done(function (data) {
        var source = document.getElementById("infor-template").innerHTML;
        var template = Handlebars.compile(source);
        var html = template(data);
        $("#infor").html(html);
    })
});

// Nhận danh sách mới khi có thay đổi
socket.on("getCustomers", function (body) {
    var source = document.getElementById("infor-template").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(body);
    $("#infor").html(html);
});

$(function () {
    $("#infor").on("click", "tr", function () {
        $("#infor tbody tr").removeClass("selected");
        $(this).addClass("selected");
        var tableData = $(this)
            .children("td")
            .map(function () {
                return $(this).text();
            })
            .get();
        $("#pac-input").val(tableData[3]);

        var id = tableData[0];
        var name = tableData[1];
        var phone_number = tableData[2];
        var address = tableData[3];
        var note = tableData[4];
        var state = REQ_STATUS_IDENTIFIED;

        const dataReq = {
            id,
            name,
            phone_number,
            address,
            note,
            state
        };

        $.ajax({
            url: 'http://localhost:3000/request',
            type: 'PUT',
            dataType: 'json',
            data: JSON.parse(JSON.stringify(dataReq))
        })
    })
});