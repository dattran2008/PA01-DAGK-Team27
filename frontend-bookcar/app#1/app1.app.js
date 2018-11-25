function onBtnClick() {
    
    var name = $('#inputName').val();
    var phone = $('#inputPhone').val();
    var address = $('#inputAddress').val();
    var note = $('#inputNotes').val();

    var data = { 
        'name': name,
        'phone': phone,
        'address': address,
        'note': note 
    };
    
    console.log(data);

    $.ajax({
        url: 'http://localhost:3000/guest/',
        type: 'GET',
        dataType: 'json',
        data: body ,
        timeout: 10000
    }).done(function (data) {

        if (!data.error) {
            $('#result').text(inp);
            $('#w_name').text(data.name);
            $('#w_mean').text(data.meaning);
        } else {
            alert(data.error);
            $('#w_name').text('');
            $('#w_mean').text('');
        }
    })
}