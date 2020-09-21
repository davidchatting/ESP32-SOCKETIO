function init() {
    $('#config').hide();
    $.getJSON('/credentials', function (json) {
        $('#config').show();
        configure(json);
    });
}

function configure(json) {
    console.log(json);

    $('#save-button').click(onSaveButtonClicked);

    $('#local_ssid').keypress(onKeyPressed);
    $('#local_pass').keypress(onKeyPressed);

    $('#local_ssid').text(json.local_ssid);
    //TODO: use the password length to display
    if(json.remote_mac != "") $('#remote-scad-code-input').attr('value', formatScadCode(json.remote_mac));
    $('#local-scad-code').text(formatScadCode(json.local_mac));

    configureDisplay(json.local_paired_status);

    $('#local_ssid').attr('disabled', true);
    populateNetworksList();
}

function configureDisplay(local_paired_status) {
    switch(local_paired_status) {
        case 'remoteSetup':
            //Show local wifi form, local and remote IDs
            $('#remoteWifiForm').hide();
            $('#remoteMacForm').show();
            break;
        case 'localSetup':
            //Show local wifi form and remote wifi form
            $('#remoteWifiForm').show();
            $('#remoteMacForm').hide();
            break;
        case 'pairedSetup':
            //just show local wifi details
            $('#remoteWifiForm').hide();
            $('#remoteMacForm').show();
            break;
    }
}

function formatScadCode(code) {
    return(code.slice(0, 4) + ' ' + code.slice(4));
}

function onKeyPressed(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        onSaveButtonClicked();
    }
}

function populateNetworksList() {
    let networks = $('#networks-list-select');
    networks.empty();

    $.getJSON('/scan', function (json) {
        $.each(json, function (key, entry) {
            networks.append($('<option></option>').attr('value', entry.SSID));
        });
        $('#local_ssid').attr('disabled', false);
    });
}

function onSaveButtonClicked() {
    var data = {
        local_ssid: $('#local_ssid').val(),
        local_pass: $('#local_pass').val(),
        remote_mac: $('#remote-scad-code-input').val().replace(/\s/g,''),
        remote_ssid: $('#remote_ssid').val(),
        remote_pass: $('#remote_pass').val()
    };

    //NB dataType is 'text' otherwise json validation fails on Safari
    $.ajax({
        type: "POST",
        url: "/credentials",
        data: JSON.stringify(data),
        dataType: 'text',
        contentType: 'application/json; charset=utf-8',
        cache: false,
        timeout: 15000,
        async: false,
        success: function(response, textStatus, jqXHR) {
            console.log(response);
            $('#config').hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}